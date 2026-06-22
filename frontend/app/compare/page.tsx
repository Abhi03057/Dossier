"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function ComparePage() {
  const [companyA, setCompanyA] = useState("");
  const [companyB, setCompanyB] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const a = companyA.trim();
    const b = companyB.trim();
    if (!a || !b) return;
    router.push(`/compare/${encodeURIComponent(a)}/${encodeURIComponent(b)}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      {/* Nav */}
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
            height: "58px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "22px",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              fontStyle: "italic",
              textDecoration: "none",
            }}
          >
            Dossier
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "100px 24px 40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 12px",
            background: "var(--accent-tint)",
            borderRadius: "9999px",
            marginBottom: "24px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-strong, #4338CA)",
            }}
          >
            Head-to-head
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            color: "var(--ink)",
            lineHeight: 1.1,
            margin: "0 0 14px",
          }}
        >
          Which company should you bet on?
        </h1>
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "15px",
            color: "var(--ink-2)",
            lineHeight: 1.6,
            margin: "0 0 40px",
          }}
        >
          Pick two companies and get an AI-synthesized verdict on tech stack, hiring momentum, and who&apos;s the better bet — for investors or candidates.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={companyA}
              onChange={(e) => setCompanyA(e.target.value)}
              placeholder="Company A — e.g. Ather Energy"
              style={{
                padding: "14px 16px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                color: "var(--ink)",
                background: "var(--surface)",
                border: "1.5px solid var(--line)",
                borderRadius: "12px",
                outline: "none",
                boxShadow: "var(--shadow-sm)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontSize: "16px",
                color: "var(--ink-3)",
              }}
            >
              vs
            </span>
            <input
              type="text"
              value={companyB}
              onChange={(e) => setCompanyB(e.target.value)}
              placeholder="Company B — e.g. Ola Electric"
              style={{
                padding: "14px 16px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                color: "var(--ink)",
                background: "var(--surface)",
                border: "1.5px solid var(--line)",
                borderRadius: "12px",
                outline: "none",
                boxShadow: "var(--shadow-sm)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!companyA.trim() || !companyB.trim()}
            style={{
              padding: "13px 24px",
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: companyA.trim() && companyB.trim() ? "#fff" : "var(--ink-3)",
              background: companyA.trim() && companyB.trim() ? "var(--accent)" : "var(--line)",
              border: "none",
              borderRadius: "10px",
              cursor: companyA.trim() && companyB.trim() ? "pointer" : "default",
            }}
          >
            Compare
          </button>
        </form>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "28px",
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "13px",
            color: "var(--ink-3)",
            textDecoration: "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to single-company search
        </Link>
      </div>
    </div>
  );
}
