"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ScoreBadge from "@/components/ScoreBadge";
import ThemeToggle from "@/components/ThemeToggle";

interface CompanySide {
  strengths: string[];
  weaknesses: string[];
  tech_stack: string[];
  hiring_velocity: "High" | "Medium" | "Low";
  intelligence_score: number;
}

interface HeadToHeadRow {
  category: string;
  company_a_edge: string;
  company_b_edge: string;
  winner: "company_a" | "company_b" | "tie";
}

interface Comparison {
  verdict: string;
  winner: string;
  winner_reason: string;
  company_a: CompanySide;
  company_b: CompanySide;
  head_to_head: HeadToHeadRow[];
  best_for_candidates: string;
  error?: string;
}

interface CompareResult {
  company_a: string;
  company_b: string;
  comparison: Comparison;
}

function velocityTint(level: string) {
  if (level === "High") return { color: "var(--positive)", bg: "var(--positive-tint)" };
  if (level === "Low") return { color: "var(--negative)", bg: "var(--negative-tint)" };
  return { color: "var(--caution)", bg: "var(--caution-tint)" };
}

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--ink-3)",
      }}
    >
      {children}
    </span>
  );
}

function CompanySideCard({ name, side }: { name: string; side: CompanySide }) {
  const v = velocityTint(side.hiring_velocity);
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "12px",
        boxShadow: "var(--shadow-sm)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <h3
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          {name}
        </h3>
        <ScoreBadge score={side.intelligence_score} />
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "9999px",
          background: v.bg,
          color: v.color,
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          width: "fit-content",
        }}
      >
        {side.hiring_velocity} hiring velocity
      </div>

      {side.tech_stack.length > 0 && (
        <div>
          <Overline>Tech stack</Overline>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
            {side.tech_stack.map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: 500,
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  background: "var(--accent-tint)",
                  color: "var(--accent-strong, #4338CA)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <Overline>Strengths</Overline>
        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
          {side.strengths.map((s, i) => (
            <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--positive)", flexShrink: 0, marginTop: "1px" }}>+</span>
              <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.55 }}>
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Overline>Weaknesses</Overline>
        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
          {side.weaknesses.map((w, i) => (
            <li key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <span style={{ color: "var(--negative)", flexShrink: 0, marginTop: "1px" }}>–</span>
              <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.55 }}>
                {w}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const params = useParams();
  const companyA = decodeURIComponent((params?.companyA as string) ?? "");
  const companyB = decodeURIComponent((params?.companyB as string) ?? "");

  const [data, setData] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyA || !companyB) return;
    setLoading(true);
    setError(null);
    setData(null);

    fetch(`https://dossier-backend-6u7y.onrender.com/compare/${encodeURIComponent(companyA)}/${encodeURIComponent(companyB)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((result: CompareResult) => {
        if (result.comparison?.error) {
          setError(result.comparison.error);
        } else {
          setData(result);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message ?? "Something went wrong");
        setLoading(false);
      });
  }, [companyA, companyB]);

  if (loading) {
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
            padding: "32px 36px",
            maxWidth: "440px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "3px solid var(--accent-tint)",
              borderTopColor: "var(--accent)",
              animation: "ds-spin 0.7s linear infinite",
              display: "block",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "22px",
              fontWeight: 500,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Analyzing both companies…
          </h2>
          <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "12px", color: "var(--ink-4)", margin: 0 }}>
            {companyA} vs {companyB} · ~15 seconds
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
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
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "14px",
            boxShadow: "var(--shadow-md)",
            padding: "32px",
            maxWidth: "400px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "14px", color: "var(--negative)", margin: 0 }}>
            {error ?? "Something went wrong"}
          </p>
          <Link href="/compare" style={{ color: "var(--accent)", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "13px", fontWeight: 500 }}>
            Try another comparison
          </Link>
        </div>
      </div>
    );
  }

  const c = data.comparison;

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Topbar */}
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
            justifyContent: "space-between",
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
              fontStyle: "italic",
            }}
          >
            Dossier
          </Link>
          <Link
            href="/compare"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            New comparison
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "48px 24px 80px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* ── Verdict hero ── */}
        <div
          className="ds-fade-in"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            boxShadow: "var(--shadow-lg)",
            padding: "36px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <h1
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              {data.company_a} <em style={{ color: "var(--ink-3)", fontStyle: "italic" }}>vs</em> {data.company_b}
            </h1>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "9999px",
                background: "var(--accent)",
                color: "#fff",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM7 4H4a2 2 0 002 2M17 4h3a2 2 0 01-2 2" />
              </svg>
              Winner: {c.winner}
            </div>
          </div>

          <p
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "17px",
              fontStyle: "italic",
              color: "var(--ink-2)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {c.verdict}
          </p>

          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "13px",
              color: "var(--ink-3)",
              margin: 0,
              borderTop: "1px solid var(--line)",
              paddingTop: "16px",
            }}
          >
            <strong style={{ color: "var(--ink)" }}>Why:</strong> {c.winner_reason}
          </p>
        </div>

        {/* ── Head-to-head table ── */}
        <div className="ds-fade-in" style={{ animationDelay: "80ms" }}>
          <Overline>Head-to-head</Overline>
          <div
            style={{
              marginTop: "12px",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            {/* header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1.2fr",
                background: "var(--paper-sunk)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {["Category", data.company_a, data.company_b].map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 18px",
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--ink-3)",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {c.head_to_head.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr 1.2fr",
                  borderBottom: i < c.head_to_head.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <div
                  style={{
                    padding: "16px 18px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {row.category}
                </div>
                <div
                  style={{
                    padding: "16px 18px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                    background: row.winner === "company_a" ? "var(--positive-tint)" : "transparent",
                  }}
                >
                  {row.company_a_edge}
                </div>
                <div
                  style={{
                    padding: "16px 18px",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                    background: row.winner === "company_b" ? "var(--positive-tint)" : "transparent",
                  }}
                >
                  {row.company_b_edge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Side by side cards ── */}
        <div className="ds-fade-in" style={{ animationDelay: "140ms", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <CompanySideCard name={data.company_a} side={c.company_a} />
          <CompanySideCard name={data.company_b} side={c.company_b} />
        </div>

        {/* ── Best for candidates ── */}
        <div
          className="ds-fade-in"
          style={{
            animationDelay: "200ms",
            background: "var(--accent-wash)",
            border: "1px solid var(--accent-tint)",
            borderRadius: "14px",
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <Overline>Best for candidates</Overline>
          </div>
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "15px",
              color: "var(--ink)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {c.best_for_candidates}
          </p>
        </div>

      </div>
    </div>
  );
}
