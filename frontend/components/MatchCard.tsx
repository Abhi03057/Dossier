interface MatchData {
  match_score: number;
  matching_skills: string[];
  gap_skills: string[];
  standout_projects: string[];
  learning_path: string[];
  verdict: string;
  match_level: "Strong" | "Moderate" | "Weak";
}

function scoreColor(score: number) {
  if (score > 70) return "var(--positive)";
  if (score >= 40) return "var(--caution)";
  return "var(--negative)";
}

function levelTint(level: string) {
  if (level === "Strong") return { color: "var(--positive)", bg: "var(--positive-tint)" };
  if (level === "Weak") return { color: "var(--negative)", bg: "var(--negative-tint)" };
  return { color: "var(--caution)", bg: "var(--caution-tint)" };
}

function MiniList({
  title,
  items,
  iconColor,
  iconBg,
  numbered = false,
}: {
  title: string;
  items: string[];
  iconColor: string;
  iconBg: string;
  numbered?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-sm)",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: iconColor,
        }}
      >
        {title}
      </span>

      {items.length === 0 ? (
        <span
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "13px",
            color: "var(--ink-4)",
          }}
        >
          Nothing to show
        </span>
      ) : numbered ? (
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: iconBg,
                  color: iconColor,
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "10px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "13px",
                  color: "var(--ink-2)",
                  lineHeight: 1.55,
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {items.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: "9999px",
                background: iconBg,
                color: iconColor,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatchCard({ match }: { match: MatchData }) {
  const color = scoreColor(match.match_score);
  const level = levelTint(match.match_level);

  return (
    <div className="ds-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Score header */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
          boxShadow: "var(--shadow-md)",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "44px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color,
              lineHeight: 1,
            }}
          >
            {match.match_score}
            <span style={{ fontSize: "20px", color: "var(--ink-3)" }}>%</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              background: level.bg,
              color: level.color,
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            {match.match_level} Match
          </div>

          {/* Score bar */}
          <div
            style={{
              height: "6px",
              borderRadius: "9999px",
              background: "var(--paper-sunk)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, match.match_score))}%`,
                background: color,
                borderRadius: "9999px",
                transition: "width 600ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Verdict */}
      <blockquote
        style={{
          margin: 0,
          padding: "20px 24px",
          background: "var(--accent-wash)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 10px 10px 0",
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontSize: "17px",
          fontStyle: "italic",
          color: "var(--ink)",
          lineHeight: 1.6,
        }}
      >
        &ldquo;{match.verdict}&rdquo;
      </blockquote>

      {/* 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <MiniList
          title="Matching skills"
          items={match.matching_skills}
          iconColor="var(--positive)"
          iconBg="var(--positive-tint)"
        />
        <MiniList
          title="Skill gaps"
          items={match.gap_skills}
          iconColor="var(--negative)"
          iconBg="var(--negative-tint)"
        />
        <MiniList
          title="Relevant projects"
          items={match.standout_projects}
          iconColor="var(--accent)"
          iconBg="var(--accent-tint)"
        />
        <MiniList
          title="Learning path"
          items={match.learning_path}
          iconColor="var(--accent)"
          iconBg="var(--accent-tint)"
          numbered
        />
      </div>
    </div>
  );
}
