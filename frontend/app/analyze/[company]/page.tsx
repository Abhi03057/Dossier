"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LoadingState from "@/components/LoadingState";
import ScoreBadge from "@/components/ScoreBadge";
import SignalCard from "@/components/SignalCard";
import TechChips from "@/components/TechChips";
import StatCard from "@/components/StatCard";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";

interface Brief {
  summary: string;
  tech_stack: string[];
  hiring_trends: string[];
  recent_developments: string[];
  growth_signals: string[];
  risk_signals: string[];
  competitors: string[];
  candidate_tips: string[];
  intelligence_score: number;
}

interface RawData {
  news_count: number;
  jobs_count: number;
  github_found: boolean;
  github_org: string | null;
  top_languages: string[];
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

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setData(null);
    setJobs([]);

    const encoded = encodeURIComponent(company);

    Promise.all([
      fetch(`http://localhost:8000/analyze/${encoded}`).then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      }),
      fetch(`http://localhost:8000/jobs/${encoded}`)
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
            Click any competitor to generate their brief.
          </p>
          <TechChips
            items={brief.competitors}
            variant="competitor"
            onClickItem={(c) => router.push(`/analyze/${encodeURIComponent(c)}`)}
          />
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
