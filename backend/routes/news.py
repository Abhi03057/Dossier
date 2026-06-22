from fastapi import APIRouter
import httpx
from dotenv import load_dotenv
import os

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

router = APIRouter(prefix="/news")


async def fetch_company_news(company_name: str) -> dict:
    if not NEWS_API_KEY:
        return {"articles": [], "error": "NEWS_API_KEY not configured"}

    params = {
        "qInTitle": f'"{company_name}"',
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": 10,
        "apiKey": NEWS_API_KEY,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://newsapi.org/v2/everything", params=params, timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

        articles = [
            {
                "title": a.get("title"),
                "description": a.get("description"),
                "url": a.get("url"),
                "publishedAt": a.get("publishedAt"),
                "source": a.get("source", {}).get("name"),
            }
            for a in data.get("articles", [])
        ]

        # NewsAPI matching is case-insensitive, so common-word company names
        # (e.g. "Stripe") pick up generic lowercase usage ("candy stripe",
        # package version strings). Require the company name to appear with
        # its given capitalization in the title, since real coverage of a
        # company writes its name as a proper noun. Fall back to the
        # unfiltered list if this would otherwise drop every result.
        cased_matches = [a for a in articles if company_name in (a["title"] or "")]
        if cased_matches:
            articles = cased_matches

        return {"articles": articles}

    except httpx.HTTPStatusError as e:
        return {"articles": [], "error": f"NewsAPI error: {e.response.status_code}"}
    except Exception as e:
        return {"articles": [], "error": str(e)}


@router.get("/{company_name}")
async def get_company_news(company_name: str):
    result = await fetch_company_news(company_name)
    return {
        "company": company_name,
        "articles": result["articles"],
        "count": len(result["articles"]),
        **({"error": result["error"]} if "error" in result else {}),
    }
