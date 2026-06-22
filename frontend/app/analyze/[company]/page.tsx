"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LoadingState from "@/components/LoadingState";
import ScoreBadge from "@/components/ScoreBadge";
import SignalCard, { SignalItem } from "@/components/SignalCard";
import TechChips from "@/components/TechChips";
import StatCard from "@/components/StatCard";
import JobCard from "@/components/JobCard";
import NewsArticleCard from "@/components/NewsArticleCard";
import MatchCard from "@/components/MatchCard";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";

interface Brief {
  summary: string;
  tech_stack: string[];
  hiring_trends: SignalItem[];
  recent_developments: SignalItem[];
  growth_signals: SignalItem[];
  risk_signals: SignalItem[];
  competitors: string[];
  candidate_tips: SignalItem[];
  intelligence_score: number;
}

interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: string | null;
}

interface RawData {
  news_count: number;
  jobs_count: number;
  github_found: boolean;
  github_org: string | null;
  top_languages: string[];
  news_articles: NewsArticle[];
}

interface AnalysisResult {
  company: string;
  brief: Brief;
  raw: RawData;
}

interface Job {
  title: string;
  location: string | null;
  location_inferred?: boolean;
  via: string;
  description: string;
  schedule_type: string | null;
  link?: string | null;
}

interface MatchResult {
  github_username: string;
  company: string;
  error?: string;
  developer?: {
    top_languages: string[];
    top_projects: { name: string; description: string | null; language: string | null; stars: number }[];
    recent_activity: number;
  };
  match?: {
    match_score: number;
    matching_skills: string[];
    gap_skills: string[];
    standout_projects: string[];
    learning_path: string[];
    verdict: string;
    match_level: "Strong" | "Moderate" | "Weak";
  };
}

function Overline({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "20px" }}>
      <span
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {num}
      </span>
      <h2
        style={{
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontSize: "26px",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          margin: 0,
          lineHeight: 1.15,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="ds-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        paddingTop: "48px",
        borderTop: "1px solid var(--line)",
      }}
    >
      {children}
    </section>
  );
}

export default function AnalyzePage() {
  const params = useParams();
  const router = useRouter();
  const rawCompany = params?.company as string;
  const company = decodeURIComponent(rawCompany ?? "");

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllNews, setShowAllNews] = useState(false);

  const [githubUsername, setGithubUsername] = useState("");
  const [matchData, setMatchData] = useState<MatchResult | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleMatch = () => {
    // Allow pasting a full profile URL ("https://github.com/user/") —
    // extract just the username so it doesn't break the route's path params.
    const username = githubUsername
      .trim()
      .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "")
      .replace(/\/+$/, "");
    if (!username) return;

    setMatchLoading(true);
    setMatchError(null);
    setMatchData(null);

    fetch(`https://dossier-backend-6u7y.onrender.com/match/${encodeURIComponent(username)}/${encodeURIComponent(company)}`)
      .then((res) => {
        if (res.status === 404) throw new Error(`GitHub user "${username}" not found`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((result: MatchResult) => {
        if (result.error) {
          setMatchError(result.error);
        } else {
          setMatchData(result);
        }
        setMatchLoading(false);
      })
      .catch((err) => {
        setMatchError(err.message ?? "Something went wrong");
        setMatchLoading(false);
      });
  };

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setData(null);
    setJobs([]);

    const encoded = encodeURIComponent(company);

    Promise.all([
      fetch(`https://dossier-backend-6u7y.onrender.com/analyze/${encoded}`).then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      }),
      fetch(`https://dossier-backend-6u7y.onrender.com/jobs/${encoded}`)
        .then((res) => res.json())
        .catch(() => ({ jobs: [] })),
    ])
      .then(([analyzeData, jobsData]) => {
        setData(analyzeData);
        setJobs(jobsData.jobs ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (company) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  if (loading) return <LoadingState company={company} />;

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--paper)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          className="ds-fade-in"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "14px",
            boxShadow: "var(--shadow-md)",
            padding: "40px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "var(--negative-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "22px",
                fontWeight: 500,
                color: "var(--ink)",
                margin: "0 0 8px",
              }}
            >
              Something went wrong
            </h3>
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                color: "var(--ink-2)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {error}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button
              onClick={fetchData}
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                padding: "10px 20px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                padding: "10px 20px",
                background: "var(--surface)",
                color: "var(--ink-2)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              New search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { brief, raw } = data;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>

      {/* ── Topbar ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--nav-bg)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--nav-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "0 24px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--ink)",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              fontStyle: "italic",
              flexShrink: 0,
            }}
          >
            Dossier
          </Link>
          <span style={{ color: "var(--line)", flexShrink: 0 }}>/</span>
          <div style={{ flex: 1, maxWidth: "360px" }}>
            <SearchBar size="sm" initialValue={company} placeholder="Search another company…" />
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── Content ── */}
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "56px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >

        {/* ── Brief Header ── */}
        <div
          className="ds-fade-in"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "32px",
            paddingBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "10px",
              }}
            >
              Intelligence brief
            </div>
            <h1
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "clamp(2.4rem, 5vw, 3.2rem)",
                fontWeight: 500,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                lineHeight: 1.05,
                margin: "0 0 16px",
              }}
            >
              {data.company}
            </h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                alignItems: "center",
              }}
            >
              {[
                `${raw.news_count} articles`,
                `${raw.jobs_count} job postings`,
                raw.github_found ? `GitHub: ${raw.github_org}` : "No GitHub org",
                raw.top_languages.slice(0, 3).join(", "),
              ].map((m, i, arr) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: "12px",
                      color: "var(--ink-3)",
                    }}
                  >
                    {m}
                  </span>
                  {i < arr.length - 1 && (
                    <span style={{ color: "var(--line-strong)", fontSize: "12px" }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <ScoreBadge score={brief.intelligence_score} size="lg" />
        </div>

        {/* ── Summary ── */}
        <Section delay={60}>
          <Overline num="Overview">Executive summary</Overline>
          <p
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "var(--ink-2)",
              lineHeight: 1.75,
              margin: 0,
              maxWidth: "760px",
              fontStyle: "italic",
            }}
          >
            {brief.summary}
          </p>
        </Section>

        {/* ── Stats strip ── */}
        <Section delay={120}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            <StatCard label="News Articles" value={raw.news_count} hint="Last 30 days" />
            <StatCard label="Open Roles" value={raw.jobs_count} hint="Scraped live" />
            <StatCard label="GitHub Org" value={raw.github_org ?? "Not found"} />
            <StatCard
              label="Top Languages"
              value={raw.top_languages.slice(0, 2).join(", ") || "—"}
            />
          </div>
        </Section>

        {/* ── Tech Stack ── */}
        <Section delay={180}>
          <Overline num="Section 01">Tech stack</Overline>
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "14px",
              color: "var(--ink-3)",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Inferred from job postings, public repos, and engineering signals.
          </p>
          <TechChips items={brief.tech_stack} variant="tech" />
        </Section>

        {/* ── Growth / Risk Signals ── */}
        <Section delay={240}>
          <Overline num="Section 02">Signals</Overline>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
          >
            <SignalCard title="Growth signals" items={brief.growth_signals} variant="positive" />
            <SignalCard title="Risk signals" items={brief.risk_signals} variant="negative" />
          </div>
        </Section>

        {/* ── Recent Developments ── */}
        <Section delay={300}>
          <Overline num="Section 03">Recent developments</Overline>
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "14px",
              color: "var(--ink-3)",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            What moved in roughly the last 90 days.
          </p>
          <SignalCard title="Recent developments" items={brief.recent_developments} variant="accent" />

          {raw.news_articles?.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <p
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: "12px",
                }}
              >
                All coverage · {raw.news_articles.length} articles
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                }}
              >
                {(showAllNews ? raw.news_articles : raw.news_articles.slice(0, 6)).map(
                  (article, i) => (
                    <NewsArticleCard key={`${article.url}-${i}`} article={article} />
                  )
                )}
              </div>
              {raw.news_articles.length > 6 && (
                <button
                  onClick={() => setShowAllNews((v) => !v)}
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--accent)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showAllNews
                    ? "Show fewer articles"
                    : `View ${raw.news_articles.length - 6} more articles`}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: showAllNews ? "rotate(180deg)" : "none",
                      transition: "transform 160ms ease",
                    }}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </Section>

        {/* ── Hiring Trends ── */}
        <Section delay={360}>
          <Overline num="Section 04">Hiring</Overline>
          <SignalCard title="Hiring trends" items={brief.hiring_trends} variant="neutral" />

          {jobs.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              {jobs.map((job, i) => (
                <JobCard key={`${job.title}-${i}`} job={job} />
              ))}
            </div>
          )}
        </Section>

        {/* ── Competitors ── */}
        <Section delay={420}>
          <Overline num="Section 05">Competitors</Overline>
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "14px",
              color: "var(--ink-3)",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Click a competitor for their brief, or &ldquo;vs&rdquo; to compare head-to-head.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {brief.competitors.map((c) => (
              <div
                key={c}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "9999px",
                  border: "1px solid var(--line)",
                  background: "var(--paper-sunk, #F1EFEA)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => router.push(`/analyze/${encodeURIComponent(c)}`)}
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--ink-2)",
                    background: "transparent",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  {c}
                </button>
                <button
                  onClick={() => router.push(`/compare/${encodeURIComponent(data.company)}/${encodeURIComponent(c)}`)}
                  title={`Compare ${data.company} vs ${c}`}
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--accent)",
                    background: "var(--accent-tint)",
                    border: "none",
                    borderLeft: "1px solid var(--line)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  vs
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Candidate Tips ── */}
        {brief.candidate_tips?.length > 0 && (
          <Section delay={480}>
            <Overline num="For candidates">Prep tips</Overline>
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                color: "var(--ink-3)",
                marginBottom: "16px",
                marginTop: 0,
              }}
            >
              Practical advice for interviews and applications at {data.company}.
            </p>
            <SignalCard title="Candidate tips" items={brief.candidate_tips} variant="candidate" />
          </Section>
        )}

        {/* ── GitHub Profile Match ── */}
        <Section delay={520}>
          <Overline num="Just for you">GitHub profile match</Overline>
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "14px",
              color: "var(--ink-3)",
              marginBottom: "20px",
              marginTop: 0,
            }}
          >
            See how your GitHub activity stacks up against {data.company}&apos;s tech stack and hiring signals.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              maxWidth: "480px",
              marginBottom: "24px",
            }}
          >
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleMatch();
              }}
              placeholder="Your GitHub username, e.g. octocat"
              style={{
                flex: 1,
                padding: "11px 14px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                color: "var(--ink)",
                background: "var(--surface)",
                border: "1.5px solid var(--line)",
                borderRadius: "9px",
                outline: "none",
              }}
            />
            <button
              onClick={handleMatch}
              disabled={!githubUsername.trim() || matchLoading}
              style={{
                padding: "11px 20px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: githubUsername.trim() ? "#fff" : "var(--ink-3)",
                background: githubUsername.trim() ? "var(--accent)" : "var(--line)",
                border: "none",
                borderRadius: "9px",
                cursor: githubUsername.trim() && !matchLoading ? "pointer" : "default",
                whiteSpace: "nowrap",
              }}
            >
              {matchLoading ? "Analyzing…" : "Analyze My Fit"}
            </button>
          </div>

          {matchLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "13px",
                color: "var(--ink-3)",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  border: "2px solid var(--accent-tint)",
                  borderTopColor: "var(--accent)",
                  animation: "ds-spin 0.7s linear infinite",
                  display: "inline-block",
                }}
              />
              Comparing your GitHub profile against {data.company}…
            </div>
          )}

          {matchError && (
            <div
              style={{
                padding: "14px 16px",
                background: "var(--negative-tint)",
                border: "1px solid var(--negative)",
                borderRadius: "9px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "13px",
                color: "var(--negative)",
              }}
            >
              {matchError}
            </div>
          )}

          {matchData?.match && <MatchCard match={matchData.match} />}
        </Section>

        {/* ── Footer ── */}
        <div
          className="ds-fade-in"
          style={{
            animationDelay: "540ms",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "48px",
            marginTop: "8px",
            borderTop: "1px solid var(--line)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "11px",
              color: "var(--ink-4)",
              letterSpacing: "0.06em",
            }}
          >
            Generated by Dossier ·{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--accent)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            New search
          </Link>
        </div>
      </div>
    </div>
  );
}
