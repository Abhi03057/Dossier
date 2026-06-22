from fastapi import APIRouter
import asyncio
import json
from groq import Groq
from dotenv import load_dotenv
import os

from routes.analyze import fetch_all_data

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

router = APIRouter(prefix="/compare")

_groq = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def _build_context(news_data: dict, jobs_data: dict, github_data: dict) -> tuple[str, str, str]:
    articles = news_data.get("articles", [])[:5]
    news_context = "\n".join(
        f"- {a.get('title', '')}: {a.get('description', '')}" for a in articles
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

    return news_context, jobs_context, github_context


async def synthesize_comparison(
    company_a: str,
    company_b: str,
    news_a: dict, jobs_a: dict, github_a: dict,
    news_b: dict, jobs_b: dict, github_b: dict,
) -> dict:
    if not _groq:
        return {"error": "GROQ_API_KEY not configured"}

    news_ctx_a, jobs_ctx_a, github_ctx_a = _build_context(news_a, jobs_a, github_a)
    news_ctx_b, jobs_ctx_b, github_ctx_b = _build_context(news_b, jobs_b, github_b)

    user_prompt = f"""Compare {company_a} vs {company_b}:

{company_a} DATA:
News: {news_ctx_a}
Jobs/Tech: {jobs_ctx_a}
GitHub: {github_ctx_a}

{company_b} DATA:
News: {news_ctx_b}
Jobs/Tech: {jobs_ctx_b}
GitHub: {github_ctx_b}

Return JSON:
{{
  "verdict": "one paragraph honest comparison summary",
  "winner": "{company_a}" or "{company_b}" or "Tie",
  "winner_reason": "one sentence why",
  "company_a": {{
    "strengths": ["3 strengths"],
    "weaknesses": ["2 weaknesses"],
    "tech_stack": ["list of technologies"],
    "hiring_velocity": "High" or "Medium" or "Low",
    "intelligence_score": number 0-10
  }},
  "company_b": {{
    "strengths": ["3 strengths"],
    "weaknesses": ["2 weaknesses"],
    "tech_stack": ["list of technologies"],
    "hiring_velocity": "High" or "Medium" or "Low",
    "intelligence_score": number 0-10
  }},
  "head_to_head": [
    {{
      "category": "Tech Stack",
      "company_a_edge": "string",
      "company_b_edge": "string",
      "winner": "company_a" or "company_b" or "tie"
    }}
  ],
  "best_for_candidates": "which company is better to join and why"
}}

head_to_head should compare at least these 4 categories: "Tech Stack",
"Hiring Momentum", "News & Growth Signals", "Engineering Activity".
The "company_a" and "company_b" keys above refer literally to
{company_a} and {company_b} respectively — do not swap them."""

    response = await asyncio.to_thread(
        _groq.chat.completions.create,
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a competitive intelligence analyst. Compare two companies "
                    "objectively. Return ONLY valid JSON, no markdown."
                ),
            },
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
    )

    raw_text = response.choices[0].message.content.strip()

    try:
        comparison = json.loads(raw_text)
    except json.JSONDecodeError:
        cleaned = raw_text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            comparison = json.loads(cleaned)
        except json.JSONDecodeError:
            return {"error": "Failed to parse Groq response", "raw": raw_text}

    return _normalize_comparison(comparison, company_a, company_b)


def _normalize_side(side: dict | None) -> dict:
    side = side if isinstance(side, dict) else {}
    strengths = side.get("strengths")
    weaknesses = side.get("weaknesses")
    tech_stack = side.get("tech_stack")
    velocity = side.get("hiring_velocity")
    score = side.get("intelligence_score")
    return {
        "strengths": [str(s) for s in strengths] if isinstance(strengths, list) else [],
        "weaknesses": [str(w) for w in weaknesses] if isinstance(weaknesses, list) else [],
        "tech_stack": [str(t) for t in tech_stack] if isinstance(tech_stack, list) else [],
        "hiring_velocity": velocity if velocity in ("High", "Medium", "Low") else "Medium",
        "intelligence_score": score if isinstance(score, (int, float)) else 5,
    }


def _normalize_comparison(comparison: dict, company_a: str, company_b: str) -> dict:
    winner = comparison.get("winner")
    if winner not in (company_a, company_b, "Tie"):
        winner = "Tie"

    head_to_head_raw = comparison.get("head_to_head")
    head_to_head = []
    if isinstance(head_to_head_raw, list):
        for row in head_to_head_raw:
            if not isinstance(row, dict):
                continue
            row_winner = row.get("winner")
            if row_winner not in ("company_a", "company_b", "tie"):
                row_winner = "tie"
            head_to_head.append({
                "category": str(row.get("category", "")),
                "company_a_edge": str(row.get("company_a_edge", "")),
                "company_b_edge": str(row.get("company_b_edge", "")),
                "winner": row_winner,
            })

    return {
        "verdict": str(comparison.get("verdict", "")),
        "winner": winner,
        "winner_reason": str(comparison.get("winner_reason", "")),
        "company_a": _normalize_side(comparison.get("company_a")),
        "company_b": _normalize_side(comparison.get("company_b")),
        "head_to_head": head_to_head,
        "best_for_candidates": str(comparison.get("best_for_candidates", "")),
    }


@router.get("/{company_a}/{company_b}")
async def compare_companies(company_a: str, company_b: str):
    (news_a, jobs_a, github_a), (news_b, jobs_b, github_b) = await asyncio.gather(
        fetch_all_data(company_a),
        fetch_all_data(company_b),
    )

    comparison = await synthesize_comparison(
        company_a, company_b, news_a, jobs_a, github_a, news_b, jobs_b, github_b
    )

    return {
        "company_a": company_a,
        "company_b": company_b,
        "comparison": comparison,
    }
