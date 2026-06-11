from fastapi import APIRouter
import httpx
from datetime import datetime, timezone, timedelta
from collections import Counter

router = APIRouter(prefix="/github")

GITHUB_HEADERS = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "competitive-intel-tool",
}


async def fetch_github_intel(company_name: str) -> dict:
    async with httpx.AsyncClient(headers=GITHUB_HEADERS, timeout=15.0) as client:
        # Step 1 — find org
        try:
            resp = await client.get(
                "https://api.github.com/search/users",
                params={"q": f"{company_name} type:org", "per_page": 3},
            )
            resp.raise_for_status()
            items = resp.json().get("items", [])
        except Exception as e:
            return {"found": False, "message": str(e)}

        if not items:
            return {"found": False, "message": "No GitHub org found"}

        org = items[0]
        org_login = org["login"]

        # Step 2 — fetch repos
        try:
            resp = await client.get(
                f"https://api.github.com/orgs/{org_login}/repos",
                params={"per_page": 20, "sort": "updated"},
            )
            resp.raise_for_status()
            raw_repos = resp.json()
        except Exception as e:
            return {"found": True, "github_org": org_login, "message": str(e)}

        repos = [
            {
                "name": r["name"],
                "description": r.get("description"),
                "language": r.get("language"),
                "stars": r.get("stargazers_count", 0),
                "forks": r.get("forks_count", 0),
                "updated_at": r.get("updated_at"),
                "topics": r.get("topics", []),
            }
            for r in raw_repos
        ]

        # Step 3 — language stats
        lang_counts = Counter(
            r["language"] for r in repos if r["language"]
        )
        top_languages = [lang for lang, _ in lang_counts.most_common(5)]

        # Step 4 — activity score
        cutoff = datetime.now(timezone.utc) - timedelta(days=90)
        active_repos = sum(
            1 for r in repos
            if r["updated_at"]
            and datetime.fromisoformat(r["updated_at"].replace("Z", "+00:00")) > cutoff
        )

        return {
            "found": True,
            "github_org": org_login,
            "repos": repos,
            "top_languages": top_languages,
            "active_repos": active_repos,
        }


@router.get("/{company_name}")
async def get_github_intel(company_name: str):
    result = await fetch_github_intel(company_name)

    if not result.get("found"):
        return {"company": company_name, **result}

    return {
        "company": company_name,
        "github_org": result["github_org"],
        "found": True,
        "top_languages": result.get("top_languages", []),
        "repos": result.get("repos", []),
        "total_public_repos": len(result.get("repos", [])),
        "active_repos_last_90_days": result.get("active_repos", 0),
        **({"message": result["message"]} if "message" in result else {}),
    }
