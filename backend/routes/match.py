from fastapi import APIRouter
import httpx
import json
import asyncio
from datetime import datetime, timezone, timedelta
from collections import Counter
from groq import Groq
from dotenv import load_dotenv
import os

from routes.github import _build_headers, fetch_github_intel
from routes.jobs import fetch_company_jobs

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

router = APIRouter(prefix="/match")

_groq = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


async def fetch_developer_profile(github_username: str) -> dict:
    async with httpx.AsyncClient(headers=_build_headers(), timeout=15.0) as client:
        try:
            user_resp = await client.get(f"https://api.github.com/users/{github_username}")
            user_resp.raise_for_status()
            user = user_resp.json()
        except Exception as e:
            return {"found": False, "message": str(e)}

        try:
            repos_resp = await client.get(
                f"https://api.github.com/users/{github_username}/repos",
                params={"per_page": 30, "sort": "updated"},
            )
            repos_resp.raise_for_status()
            raw_repos = repos_resp.json()
        except Exception as e:
            return {"found": True, "message": str(e)}

        lang_counts = Counter(r["language"] for r in raw_repos if r.get("language"))
        top_languages = [lang for lang, _ in lang_counts.most_common(5)]

        topics: list[str] = []
        for r in raw_repos:
            for t in r.get("topics", []):
                if t not in topics:
                    topics.append(t)

        cutoff = datetime.now(timezone.utc) - timedelta(days=90)
        recent_activity = sum(
            1
            for r in raw_repos
            if r.get("updated_at")
            and datetime.fromisoformat(r["updated_at"].replace("Z", "+00:00")) > cutoff
        )

        top_projects = [
            {
                "name": r["name"],
                "description": r.get("description"),
                "language": r.get("language"),
                "stars": r.get("stargazers_count", 0),
            }
            for r in sorted(raw_repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)[:3]
        ]

        return {
            "found": True,
            "bio": user.get("bio"),
            "public_repos": user.get("public_repos", 0),
            "top_languages": top_languages,
            "topics": topics,
            "recent_activity": recent_activity,
            "top_projects": top_projects,
        }


_MATCH_FIELDS = ("matching_skills", "gap_skills", "standout_projects", "learning_path")


def _normalize_match(match: dict) -> dict:
    """Coerce list fields to plain string lists and fill in safe defaults
    so the frontend never breaks on a malformed Groq response."""
    for field in _MATCH_FIELDS:
        items = match.get(field)
        if not isinstance(items, list):
            match[field] = []
            continue
        match[field] = [str(i) for i in items if i is not None]

    match["match_score"] = match.get("match_score") if isinstance(match.get("match_score"), (int, float)) else 0
    match["verdict"] = match.get("verdict") or ""
    level = match.get("match_level")
    match["match_level"] = level if level in ("Strong", "Moderate", "Weak") else "Moderate"
    return match


async def synthesize_match(
    github_username: str,
    company_name: str,
    developer: dict,
    company_github: dict,
    job_keywords: list[str],
) -> dict:
    if not _groq:
        return {"error": "GROQ_API_KEY not configured"}

    user_prompt = f"""Compare this developer's GitHub profile against {company_name}:

DEVELOPER PROFILE:
Languages: {', '.join(developer.get('top_languages', [])) or 'none found'}
Topics/Technologies: {', '.join(developer.get('topics', [])) or 'none found'}
Recent projects: {', '.join(p['name'] + (' - ' + p['description'] if p.get('description') else '') for p in developer.get('top_projects', [])) or 'none found'}
Active repos last 90 days: {developer.get('recent_activity', 0)}

COMPANY STACK (from GitHub + Jobs):
Languages: {', '.join(company_github.get('top_languages', [])) or 'unknown'}
Job tech keywords: {', '.join(job_keywords) or 'unknown'}

Return JSON with:
{{
  "match_score": number 0-100,
  "matching_skills": ["skills that directly match"],
  "gap_skills": ["skills company needs that developer lacks"],
  "standout_projects": ["developer projects most relevant to company"],
  "learning_path": ["3-4 specific things to learn/build to improve match"],
  "verdict": "one sentence honest assessment of fit",
  "match_level": "Strong" or "Moderate" or "Weak"
}}"""

    response = await asyncio.to_thread(
        _groq.chat.completions.create,
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a technical career advisor. Compare a developer's GitHub "
                    "profile against a company's tech stack and hiring signals. "
                    "Return ONLY valid JSON, no markdown."
                ),
            },
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
    )

    raw_text = response.choices[0].message.content.strip()

    try:
        match = json.loads(raw_text)
    except json.JSONDecodeError:
        cleaned = raw_text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            match = json.loads(cleaned)
        except json.JSONDecodeError:
            return {"error": "Failed to parse Groq response", "raw": raw_text}

    return _normalize_match(match)


@router.get("/{github_username}/{company_name}")
async def get_profile_match(github_username: str, company_name: str):
    developer, company_github, jobs_data = await asyncio.gather(
        fetch_developer_profile(github_username),
        fetch_github_intel(company_name),
        fetch_company_jobs(company_name),
    )

    if not developer.get("found"):
        return {
            "github_username": github_username,
            "company": company_name,
            "error": developer.get("message", "GitHub user not found"),
        }

    job_keywords = jobs_data.get("tech_keywords", [])

    match = await synthesize_match(
        github_username, company_name, developer, company_github, job_keywords
    )

    return {
        "github_username": github_username,
        "company": company_name,
        "developer": {
            "top_languages": developer.get("top_languages", []),
            "top_projects": developer.get("top_projects", []),
            "recent_activity": developer.get("recent_activity", 0),
        },
        "match": match,
    }
