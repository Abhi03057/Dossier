from fastapi import APIRouter
import asyncio
import json
from groq import Groq
from dotenv import load_dotenv
import os

from routes.news import fetch_company_news
from routes.jobs import fetch_company_jobs
from routes.github import fetch_github_intel

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

router = APIRouter(prefix="/analyze")

_groq = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


async def fetch_all_data(company_name: str) -> tuple:
    return await asyncio.gather(
        fetch_company_news(company_name),
        fetch_company_jobs(company_name),
        fetch_github_intel(company_name),
    )


async def synthesize_intel(
    company_name: str,
    news_data: dict,
    jobs_data: dict,
    github_data: dict,
) -> dict:
    if not _groq:
        return {"error": "GROQ_API_KEY not configured"}

    # Build context strings
    articles = news_data.get("articles", [])[:8]
    news_context = "\n".join(
        f"- Title: {a.get('title', '')} | URL: {a.get('url', '')} | "
        f"Description: {a.get('description', '')}"
        for a in articles
    ) or "No news data available."

    jobs = jobs_data.get("jobs", [])
    tech_keywords = jobs_data.get("tech_keywords", [])
    jobs_context = (
        "Job titles: " + ", ".join(j["title"] for j in jobs if j.get("title"))
        + "\nTech keywords found: " + ", ".join(tech_keywords)
    ) if jobs else "No jobs data available."

    github_context = (
        f"GitHub org: {github_data.get('github_org', 'not found')}\n"
        f"Top languages: {', '.join(github_data.get('top_languages', []))}\n"
        f"Total public repos: {github_data.get('total_public_repos', 0)}\n"
        f"Active repos (last 90 days): {github_data.get('active_repos_last_90_days', 0)}"
    ) if github_data.get("found") else "No GitHub org found."

    user_prompt = f"""Based on this data about {company_name}:

NEWS:
{news_context}

JOB POSTINGS:
{jobs_context}

GITHUB:
{github_context}

Generate a JSON brief with exactly these fields. For every item in
hiring_trends, recent_developments, growth_signals, risk_signals, and
candidate_tips, cite where the observation came from so the reader can
verify it:
{{
  "summary": "2-3 sentence company overview based on recent activity",
  "tech_stack": ["list of technologies inferred from jobs + github"],
  "hiring_trends": [
    {{"text": "observation about their hiring", "source": "job title or 'GitHub' or 'NewsAPI'"}}
  ],
  "recent_developments": [
    {{"text": "news highlight", "url": "the actual article URL from NEWS above, or null if not from a specific article"}}
  ],
  "growth_signals": [
    {{"text": "positive growth indicator", "source": "where this was inferred from, e.g. 'NewsAPI', 'Job postings', 'GitHub activity'"}}
  ],
  "risk_signals": [
    {{"text": "potential concern or risk", "source": "where this was inferred from"}}
  ],
  "candidate_tips": [
    {{"text": "practical, specific tip for a candidate applying to this company — based on tech_stack, hiring_trends, and growth_signals. Make it concrete and actionable.", "source": "'GitHub' or 'Jobs' or 'News'"}}
  ],
  "competitors": ["list of 4-5 likely competitors"],
  "intelligence_score": 8
}}

hiring_trends should have 3-4 items, recent_developments 5-6 items,
growth_signals 3 items, risk_signals 2-3 items, candidate_tips 3-4 items.
Use the exact article URLs given in the NEWS section above for
recent_developments — do not invent URLs. Cover as many distinct
articles from the NEWS section as you can in recent_developments."""

    response = await asyncio.to_thread(
        _groq.chat.completions.create,
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a competitive intelligence analyst. Given scraped public data "
                    "about a company, generate a structured JSON intelligence brief. "
                    "Return ONLY valid JSON, no markdown, no backticks, no explanation."
                ),
            },
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
    )

    raw_text = response.choices[0].message.content.strip()

    try:
        brief = json.loads(raw_text)
    except json.JSONDecodeError:
        # Strip any accidental markdown fences and retry
        cleaned = raw_text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            brief = json.loads(cleaned)
        except json.JSONDecodeError:
            return {"error": "Failed to parse Groq response", "raw": raw_text}

    return _normalize_brief(brief)


_CITED_FIELDS = ("hiring_trends", "recent_developments", "growth_signals", "risk_signals", "candidate_tips")


def _normalize_brief(brief: dict) -> dict:
    """Ensure every item in the cited fields is {text, url, source}, even if
    the model returned a plain string."""
    for field in _CITED_FIELDS:
        items = brief.get(field)
        if not isinstance(items, list):
            continue
        normalized = []
        for item in items:
            if isinstance(item, str):
                normalized.append({"text": item, "url": None, "source": None})
            elif isinstance(item, dict):
                normalized.append({
                    "text": item.get("text", ""),
                    "url": item.get("url"),
                    "source": item.get("source"),
                })
            # silently drop anything else malformed
        brief[field] = normalized
    return brief


@router.get("/{company_name}")
async def get_intel_brief(company_name: str):
    news_data, jobs_data, github_data = await fetch_all_data(company_name)

    brief = await synthesize_intel(company_name, news_data, jobs_data, github_data)

    return {
        "company": company_name,
        "brief": brief,
        "raw": {
            "news_count": len(news_data.get("articles", [])),
            "jobs_count": len(jobs_data.get("jobs", [])),
            "github_found": github_data.get("found", False),
            "github_org": github_data.get("github_org"),
            "top_languages": github_data.get("top_languages", []),
            "news_articles": news_data.get("articles", []),
        },
    }
