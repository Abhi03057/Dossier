interface ScoreBadgeProps {
  score: number;
  size?: "default" | "lg";
}

function verdict(score: number) {
  if (score >= 9) return "Exceptional";
  if (score >= 8) return "Strong";
  if (score >= 6) return "Moderate";
  if (score >= 4) return "Watch";
  return "Weak";
}

function scoreColor(score: number) {
  if (score >= 7) return "var(--positive)";
  if (score >= 5) return "var(--caution)";
  return "var(--negative)";
}

export default function ScoreBadge({ score, size = "default" }: ScoreBadgeProps) {
  const isLg = size === "lg";
  const dim = isLg ? 108 : 76;
  const cx = dim / 2;
  const cy = dim / 2;
  const r = isLg ? 43 : 30;
  const strokeW = isLg ? 6 : 5;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - Math.min(score / 10, 1));
  const color = scoreColor(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth={strokeW} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
        />
        <text
          x={cx}
          y={cy + (isLg ? 8 : 6)}
          textAnchor="middle"
          fill="var(--ink)"
          fontFamily="var(--font-newsreader), Georgia, serif"
          fontSize={isLg ? 30 : 22}
          fontWeight="600"
          letterSpacing="-0.02em"
        >
          {score}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
        <span
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: isLg ? "13px" : "11px",
            fontWeight: 600,
            color,
            lineHeight: 1.2,
          }}
        >
          {verdict(score)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: isLg ? "10px" : "9px",
            color: "var(--ink-3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Intel score
        </span>
      </div>
    </div>
  );
}
