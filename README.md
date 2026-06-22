# Dossier

A full-stack competitive intelligence tool. Type a company name and get an AI-synthesized intelligence brief — news, hiring signals, tech stack, GitHub activity, growth/risk signals, candidate prep tips, and competitor links — all generated from live, public data.

**Stack:** FastAPI (Python) · Next.js 16 (TypeScript, App Router) · Tailwind CSS v4 · Groq (`llama-3.3-70b-versatile`)

---

## Features

- **Intelligence Brief** (`/analyze/{company}`) — AI-synthesized summary, tech stack, hiring trends, growth/risk signals, recent developments, candidate tips, and competitors, each citing its source (a job title, "GitHub", "NewsAPI", or a direct article URL)
- **Job board** — open roles scraped from Google Jobs, LinkedIn, and company careers pages, deduplicated, with "View & apply" links straight to the source posting
- **News gallery** — full article list behind a "View more" toggle, beyond the AI-distilled highlights
- **GitHub Profile Matcher** (`/match/{username}/{company}`) — paste your GitHub username and get a 0–100 fit score against a company's tech stack and hiring signals, with skill gaps and a concrete learning path
- **Company vs Company comparison** (`/compare/{companyA}/{companyB}`) — head-to-head verdict, category-by-category breakdown, side-by-side strengths/weaknesses, and a "best for candidates" recommendation
- **Light / dark theme toggle** — persists via `localStorage`, respects system preference, no flash on reload

---

## Project Structure

```
competitive-intel-tool/
├── backend/                       # FastAPI backend
│   ├── main.py                    # App entry point, CORS, router registration
│   ├── requirements.txt
│   ├── .env                       # API keys (not committed)
│   └── routes/
│       ├── news.py                # NewsAPI — recent press coverage (title-only match)
│       ├── jobs.py                # SerpAPI — Google Jobs + LinkedIn + careers pages
│       ├── github.py              # GitHub API — org repos, tech stack, activity
│       ├── analyze.py             # Groq synthesis — the intelligence brief
│       ├── match.py               # Groq synthesis — developer-vs-company fit score
│       └── compare.py             # Groq synthesis — company-vs-company comparison
└── frontend/                      # Next.js frontend
    ├── app/
    │   ├── page.tsx                            # Landing page
    │   ├── layout.tsx                          # Fonts, theme provider, FOUC script
    │   ├── analyze/[company]/page.tsx          # Intelligence brief dashboard
    │   ├── compare/page.tsx                    # "Company A vs Company B" search
    │   └── compare/[companyA]/[companyB]/page.tsx  # Comparison results
    └── components/
        ├── SearchBar.tsx
        ├── ScoreBadge.tsx          # SVG gauge — intelligence score / match score
        ├── SignalCard.tsx          # Cited signal items (text + source/url)
        ├── TechChips.tsx           # Pill chips (tech stack / competitors)
        ├── StatCard.tsx
        ├── JobCard.tsx             # Linked job posting card
        ├── NewsArticleCard.tsx     # Linked news article card
        ├── MatchCard.tsx           # GitHub profile match results
        ├── LoadingState.tsx
        ├── ThemeProvider.tsx       # Theme context + localStorage
        └── ThemeToggle.tsx         # Sun/moon toggle button
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
GITHUB_TOKEN=
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
Recent news articles via [NewsAPI](https://newsapi.org). Matches the company name in the article **title only** (`qInTitle`), then applies a case-sensitive filter requiring the name appear capitalized as a proper noun — this prevents common-word company names (e.g. "Stripe") from matching unrelated articles that happen to contain the lowercase word.

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
Job postings merged from three parallel SerpAPI calls — Google Jobs engine, LinkedIn organic results, and company careers pages — deduplicated by title, with noise filters for LinkedIn aggregate listings. Each job includes a direct `link` to apply where SerpAPI provides one. Also extracts tech keywords from all job descriptions.

**Example:** `GET /jobs/Ather Energy`

```json
{
  "company": "Ather Energy",
  "jobs": [
    {
      "title": "Module Lead - Manufacturing Engineer",
      "location": "Bengaluru, India",
      "location_inferred": false,
      "via": "LinkedIn",
      "description": "...",
      "schedule_type": "Full-time",
      "link": "https://www.linkedin.com/jobs/view/..."
    }
  ],
  "tech_keywords": ["Python", "AWS", "React"],
  "total_jobs": 11
}
```

**Requires:** `SERP_API_KEY`

---

### `GET /github/{company_name}`
GitHub org intelligence via the GitHub REST API. Finds the company's GitHub org, fetches their public repos, infers tech stack from language usage, and measures recent activity.

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

**Requires:** No key required; supply `GITHUB_TOKEN` to raise the rate limit from 60 to 5,000 req/hr.

---

### `GET /analyze/{company_name}`
Fetches news, jobs, and GitHub data in parallel, then calls Groq to synthesize a structured intelligence brief. Every observation in `hiring_trends`, `recent_developments`, `growth_signals`, `risk_signals`, and `candidate_tips` carries a citation (`source` or `url`) so it can be traced back to where it came from.

**Example:** `GET /analyze/Ather Energy`

```json
{
  "company": "Ather Energy",
  "brief": {
    "summary": "...",
    "tech_stack": ["Go", "Rust", "C", "JavaScript"],
    "hiring_trends": [
      { "text": "Hiring for Module Lead - Manufacturing Engineer", "source": "Job postings" }
    ],
    "recent_developments": [
      { "text": "Ather Energy board approves Rs 2,500-crore fundraising plan", "url": "https://..." }
    ],
    "growth_signals": [{ "text": "...", "source": "NewsAPI" }],
    "risk_signals": [{ "text": "...", "source": "NewsAPI" }],
    "candidate_tips": [{ "text": "...", "source": "GitHub" }],
    "competitors": ["Tata Motors", "Hero Electric", "Okaya EV"],
    "intelligence_score": 8
  },
  "raw": {
    "news_count": 10,
    "jobs_count": 11,
    "github_found": true,
    "github_org": "AtherEnergy",
    "top_languages": ["C", "Rust", "R"],
    "news_articles": [ /* full article list, for the "view more" gallery */ ]
  }
}
```

**Requires:** `GROQ_API_KEY` (+ the keys above, since it calls all three scrapers)

---

### `GET /match/{github_username}/{company_name}`
Fetches a developer's public GitHub profile (languages, topics, top starred projects, 90-day activity) and the target company's GitHub + job-posting tech signals, then asks Groq for an honest fit assessment.

**Example:** `GET /match/octocat/Ather Energy`

```json
{
  "github_username": "octocat",
  "company": "Ather Energy",
  "developer": {
    "top_languages": ["TypeScript", "JavaScript", "Python"],
    "top_projects": [{ "name": "Dossier", "description": "...", "language": "TypeScript", "stars": 1 }],
    "recent_activity": 13
  },
  "match": {
    "match_score": 40,
    "matching_skills": ["JavaScript", "HTML"],
    "gap_skills": ["R", "C", "Rust", "Go"],
    "standout_projects": ["Dossier"],
    "learning_path": ["Learn Go", "Explore Rust for systems programming"],
    "verdict": "Some matching skills, but significant upskilling needed for a strong fit.",
    "match_level": "Weak"
  }
}
```

**Requires:** `GROQ_API_KEY`, `GITHUB_TOKEN` recommended

---

### `GET /compare/{company_a}/{company_b}`
Runs `/analyze`'s scraper pipeline for **both** companies concurrently (all 6 underlying calls scheduled at once), then makes a single Groq call to compare them head-to-head.

**Example:** `GET /compare/Ather Energy/Ola Electric`

```json
{
  "company_a": "Ather Energy",
  "company_b": "Ola Electric",
  "comparison": {
    "verdict": "...",
    "winner": "Ather Energy",
    "winner_reason": "...",
    "company_a": {
      "strengths": ["..."], "weaknesses": ["..."],
      "tech_stack": ["..."], "hiring_velocity": "High", "intelligence_score": 8
    },
    "company_b": {
      "strengths": ["..."], "weaknesses": ["..."],
      "tech_stack": ["..."], "hiring_velocity": "Low", "intelligence_score": 4
    },
    "head_to_head": [
      { "category": "Tech Stack", "company_a_edge": "...", "company_b_edge": "...", "winner": "company_a" }
    ],
    "best_for_candidates": "..."
  }
}
```

**Requires:** `GROQ_API_KEY` (+ the keys above)

---

## API Keys

| Key | Source |
|---|---|
| `NEWS_API_KEY` | [newsapi.org](https://newsapi.org) |
| `SERP_API_KEY` | [serpapi.com](https://serpapi.com) |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — powers `/analyze`, `/match`, `/compare` |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) — optional, raises GitHub API rate limit from 60 to 5,000 req/hr |

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero search, mock brief preview, how-it-works, feature grid |
| `/analyze/[company]` | Full intelligence brief dashboard, GitHub profile match (opt-in), competitor "vs" links |
| `/compare` | Pick two companies to compare |
| `/compare/[companyA]/[companyB]` | Head-to-head comparison results |

Theme (light/dark) is togglable from the nav on every page and persists across visits.

---

## GitHub

[github.com/Abhi03057/Dossier](https://github.com/Abhi03057/Dossier)
