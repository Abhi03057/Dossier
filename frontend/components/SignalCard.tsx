type Tone = "positive" | "negative" | "caution" | "accent" | "neutral" | "candidate";

interface SignalCardProps {
  title: string;
  items: string[];
  variant?: Tone;
}

const toneConfig: Record<Tone, { iconBg: string; iconColor: string; icon: string }> = {
  positive: {
    iconBg: "var(--positive-tint)",
    iconColor: "var(--positive)",
    icon: "M7 11l5 5 5-5M12 4v12",
  },
  negative: {
    iconBg: "var(--negative-tint)",
    iconColor: "var(--negative)",
    icon: "M12 8v4M12 16h.01",
  },
  caution: {
    iconBg: "var(--caution-tint)",
    iconColor: "var(--caution)",
    icon: "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
  },
  accent: {
    iconBg: "var(--accent-tint)",
    iconColor: "var(--accent)",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  neutral: {
    iconBg: "var(--paper-sunk, #F1EFEA)",
    iconColor: "var(--ink-3)",
    icon: "M9 12h6M12 9v6",
  },
  candidate: {
    iconBg: "var(--positive-tint)",
    iconColor: "var(--positive)",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  },
};

export default function SignalCard({ title, items, variant = "neutral" }: SignalCardProps) {
  const cfg = toneConfig[variant];
  return (
    <div
      style={{
        background: "var(--surface, #fff)",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-sm)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: cfg.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={cfg.iconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={cfg.icon} />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: cfg.iconColor,
          }}
        >
          {title}
        </span>
      </div>

      {/* Items */}
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: cfg.iconColor,
                opacity: 0.5,
                marginTop: "7px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "14px",
                color: "var(--ink-2)",
                lineHeight: 1.6,
              }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
