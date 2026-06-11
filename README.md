# Competitive Intelligence Tool

A full-stack tool for gathering real-time competitive intelligence on any company — news coverage, job postings, and GitHub activity — in one place.

**Stack:** FastAPI (Python) · Next.js (TypeScript) · Tailwind CSS

---

## Project Structure

```
competitive-intel-tool/
├── backend/               # FastAPI backend
│   ├── main.py            # App entry point, CORS, router registration
│   ├── requirements.txt
│   ├── .env               # API keys (not committed)
│   └── routes/
│       ├── news.py        # NewsAPI — recent press coverage
│       ├── jobs.py        # SerpAPI — job postings + LinkedIn
│       └── github.py      # GitHub API — org repos, tech stack, activity
└── frontend/              # Next.js frontend
    ├── app/
    └── ...
```

---

## Setup

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `/backend` with:

```
GROQ_API_KEY=
NEWS_API_KEY=
SERP_API_KEY=
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

---

## API Routes

### `GET /`
Health check.
```json
{ "status": "ok", "message": "Competitive Intel API is running" }
```

---

### `GET /news/{company_name}`
Recent news articles via [NewsAPI](https://newsapi.org). Uses exact phrase matching for relevance.

**Example:** `GET /news/Ather Energy`

```json
{
  "company": "Ather Energy",
  "articles": [
    {
      "title": "Ather to consider fresh fund raise at June 12 board meet",
      "description": "...",
      "url": "https://...",
      "publishedAt": "2026-06-10T02:19:14Z",
      "source": "The Times of India"
    }
  ],
  "count": 10
}
```

**Requires:** `NEWS_API_KEY`

---

### `GET /jobs/{company_name}`
Job postings from two parallel SerpAPI calls — Google Jobs engine and LinkedIn organic results — merged and deduplicated. Also extracts tech keywords from all job descriptions.

**Example:** `GET /jobs/Ather Energy`

```json
{
  "company": "Ather Energy",
  "jobs": [
    {
      "title": "Module Lead - Manufacturing Engineer",
      "location": "Bengaluru, India",
      "via": "LinkedIn",
      "description": "...",
      "schedule_type": "Full-time"
    }
  ],
  "tech_keywords": ["Python", "AWS", "React"],
  "total_jobs": 11
}
```

**Requires:** `SERP_API_KEY`

---

### `GET /github/{company_name}`
GitHub org intelligence via the public GitHub API (no auth token required). Finds the company's GitHub org, fetches their public repos, infers tech stack from language usage, and measures recent activity.

**Example:** `GET /github/Ather Energy`

```json
{
  "company": "Ather Energy",
  "github_org": "AtherEnergy",
  "found": true,
  "top_languages": ["C", "Rust", "R", "JavaScript", "HTML"],
  "repos": [
    {
      "name": "rumqtt",
      "description": "Pure rust mqtt client",
      "language": "Rust",
      "stars": 204,
      "forks": 68,
      "updated_at": "2026-05-03T03:30:55Z",
      "topics": ["iot", "mqtt-client", "pure-rust"]
    }
  ],
  "total_public_repos": 11,
  "active_repos_last_90_days": 5
}
```

**Requires:** No API key (uses public GitHub API, rate-limited to 60 req/hr unauthenticated)

---

## API Keys

| Key | Source |
|---|---|
| `NEWS_API_KEY` | [newsapi.org](https://newsapi.org) |
| `SERP_API_KEY` | [serpapi.com](https://serpapi.com) |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — reserved for AI summarisation |

---

## GitHub

[github.com/Abhi03057/competitive-intel-tool](https://github.com/Abhi03057/competitive-intel-tool)
