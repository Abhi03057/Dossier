import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";

const QUICK_PICKS = ["Ather Energy", "Zepto", "Swiggy", "Razorpay", "Groww"];

const HOW_STEPS = [
  {
    num: "01",
    title: "Type a company name",
    desc: "Enter any company — startup, enterprise, or unicorn. No account needed.",
  },
  {
    num: "02",
    title: "We pull live data",
    desc: "News, job listings, GitHub activity, and tech signals gathered in seconds.",
  },
  {
    num: "03",
    title: "AI synthesizes a brief",
    desc: "Groq LLM fuses every signal into an actionable intelligence report.",
  },
];

const FEATURES = [
  {
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2zM9 15h6M9 11h6M9 7h3",
    title: "News Coverage",
    desc: "Recent headlines from NewsAPI, filtered for relevance and recency.",
  },
  {
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6l2 2-2 2M8 6l-2 2 2 2",
    title: "Tech Stack",
    desc: "Inferred from job postings, GitHub repos, and engineering blog signals.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
    title: "Hiring Trends",
    desc: "Open roles scraped from Google Jobs, LinkedIn, and company careers pages.",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "GitHub Activity",
    desc: "Repository count, top languages, and recent engineering velocity.",
  },
  {
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    title: "Growth & Risk Signals",
    desc: "AI-extracted momentum indicators and watchlist flags from all sources.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Candidate Tips",
    desc: "Practical interview prep advice tailored to what the company is hiring for.",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-geist-sans), sans-serif" }}>

      {/* ── Nav ── */}
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
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "22px",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
              fontStyle: "italic",
            }}
          >
            Dossier
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              Competitive Intel · v1.0
            </span>
            <ThemeToggle />
            <a
              href="https://github.com/Abhi03057/competitive-intel-tool"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ink-2)",
                textDecoration: "none",
                padding: "6px 12px",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                background: "var(--surface)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "80px 24px 72px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Left col */}
        <div className="ds-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              background: "var(--accent-tint)",
              borderRadius: "9999px",
              width: "fit-content",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
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
              Intelligence Platform
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Know your
            <br />
            competition{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              deeply.
            </em>
          </h1>

          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "16px",
              color: "var(--ink-2)",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: "400px",
            }}
          >
            Instant AI-generated briefs on any company — news, hiring signals,
            tech stack, GitHub activity, and candidate tips, all in one report.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <SearchBar />
            <a
              href="/compare"
              className="hover-nav-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--ink-3)",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
              </svg>
              Compare two companies instead
            </a>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingLeft: "2px" }}>
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "11px",
                  color: "var(--ink-4)",
                  alignSelf: "center",
                }}
              >
                Try:
              </span>
              {QUICK_PICKS.map((name) => (
                <a
                  key={name}
                  href={`/analyze/${encodeURIComponent(name)}`}
                  className="hover-pill"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--ink-3)",
                    textDecoration: "none",
                    padding: "4px 10px",
                    border: "1px solid var(--line)",
                    borderRadius: "9999px",
                    background: "transparent",
                  }}
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right col: mock brief preview */}
        <div
          className="ds-fade-in"
          style={{
            animationDelay: "120ms",
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            boxShadow: "var(--shadow-lg)",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Browser chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {["#F47067", "#F9C270", "#57C754"].map((c) => (
              <span key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, flexShrink: 0 }} />
            ))}
            <span
              style={{
                flex: 1,
                height: "22px",
                background: "var(--paper-sunk, #F1EFEA)",
                borderRadius: "6px",
                marginLeft: "8px",
              }}
            />
          </div>

          {/* Company header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-3)",
                  marginBottom: "4px",
                }}
              >
                Intelligence brief
              </div>
              <div
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontSize: "26px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                }}
              >
                Zepto
              </div>
            </div>
            {/* Mini score badge */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                border: "4px solid var(--positive)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-newsreader), serif", fontSize: "20px", fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>8</span>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "8px", color: "var(--ink-3)" }}>/10</span>
            </div>
          </div>

          {/* Tech chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["React Native", "Go", "Kafka", "PostgreSQL"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "11px",
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

          {/* Mini signals */}
          {[
            { label: "Growth", text: "₹4,200 Cr raised, expanding dark store network", color: "var(--positive)", bg: "var(--positive-tint)" },
            { label: "Hiring", text: "40+ engineering roles open in Bengaluru & Mumbai", color: "var(--accent)", bg: "var(--accent-tint)" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                gap: "10px",
                padding: "12px 14px",
                background: s.bg,
                borderRadius: "8px",
              }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "10px", fontWeight: 600, color: s.color, textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0, paddingTop: "1px" }}>{s.label}</span>
              <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "12px", color: "var(--ink-2)", lineHeight: 1.5 }}>{s.text}</span>
            </div>
          ))}

          {/* Decorative blur */}
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              right: "-30px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "var(--accent-tint)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          background: "var(--paper)",
          borderTop: "1px solid var(--line)",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "12px",
              }}
            >
              How it works
            </p>
            <h2
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              From name to brief in seconds
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {HOW_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="ds-fade-in"
                style={{
                  animationDelay: `${i * 80}ms`,
                  padding: "28px",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontSize: "38px",
                    fontWeight: 600,
                    color: "var(--accent)",
                    opacity: 0.2,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "14px",
                    color: "var(--ink-2)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's inside ── */}
      <section style={{ padding: "64px 24px", background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "12px",
              }}
            >
              What&apos;s inside every brief
            </p>
            <h2
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Six lenses on every company
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="ds-fade-in"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "var(--accent-tint)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={feat.icon} />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "13px",
                    color: "var(--ink-2)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "72px 24px",
          background: "var(--paper)",
          borderTop: "1px solid var(--line)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
          <h2
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              color: "var(--ink)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Ready to know your competition?
          </h2>
          <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
            No sign-up. No setup. Just type a name.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1080px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-newsreader), Georgia, serif",
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--ink-3)",
            fontStyle: "italic",
          }}
        >
          Dossier
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "11px",
            color: "var(--ink-4)",
            letterSpacing: "0.06em",
          }}
        >
          Built with FastAPI · Next.js · Groq
        </span>
      </footer>
    </div>
  );
}
