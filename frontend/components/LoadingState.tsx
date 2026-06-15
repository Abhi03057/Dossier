"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Scraping recent news coverage",
  "Reading open job postings",
  "Analyzing GitHub & engineering activity",
  "Synthesizing the intelligence brief",
];

export default function LoadingState({ company }: { company: string }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

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
          background: "var(--surface, #fff)",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          boxShadow: "var(--shadow-md)",
          padding: "32px 36px",
          maxWidth: "500px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Building brief
          </span>
          <h2
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "26px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Analyzing {company}…
          </h2>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "4px",
            borderRadius: "9999px",
            background: "var(--paper-sunk, #F1EFEA)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "40%",
              borderRadius: "9999px",
              background: "var(--accent)",
              animation: "ds-load-slide 1.5s cubic-bezier(0.4,0,0.6,1) infinite",
            }}
          />
        </div>

        {/* Steps */}
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
          {STEPS.map((step, i) => {
            const state: "done" | "active" | "todo" =
              i < activeStep ? "done" : i === activeStep ? "active" : "todo";
            return (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "14px",
                  color:
                    state === "done"
                      ? "var(--ink-3)"
                      : state === "active"
                      ? "var(--ink)"
                      : "var(--ink-4)",
                  fontWeight: state === "active" ? 500 : 400,
                  transition: "color 200ms ease",
                }}
              >
                {/* Status icon */}
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {state === "done" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--positive)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12.5 10 17.5 19.5 7" />
                    </svg>
                  )}
                  {state === "active" && (
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: "2px solid var(--accent-tint)",
                        borderTopColor: "var(--accent)",
                        animation: "ds-spin 0.7s linear infinite",
                        display: "block",
                      }}
                    />
                  )}
                  {state === "todo" && (
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "var(--line-strong)",
                        display: "block",
                      }}
                    />
                  )}
                </span>
                {step}
              </li>
            );
          })}
        </ul>

        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.04em",
          }}
        >
          This takes 5–10 seconds
        </p>
      </div>
    </div>
  );
}
