"use client";

interface TechChipsProps {
  items: string[];
  variant?: "tech" | "competitor";
  onClickItem?: (item: string) => void;
}

export default function TechChips({ items, variant = "tech", onClickItem }: TechChipsProps) {
  const isTech = variant === "tech";
  const isClickable = !!onClickItem;

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "5px 12px",
    borderRadius: "9999px",
    fontSize: "13px",
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontWeight: 500,
    cursor: isClickable ? "pointer" : "default",
    border: "1px solid transparent",
    transition: "all 140ms ease",
    textDecoration: "none",
    lineHeight: 1.3,
    background: isTech ? "var(--accent-tint)" : "var(--paper-sunk, #F1EFEA)",
    color: isTech ? "var(--accent-strong, #4338CA)" : "var(--ink-2)",
    borderColor: isTech ? "var(--accent-tint)" : "var(--line)",
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {items.map((item) =>
        isClickable ? (
          <button
            key={item}
            onClick={() => onClickItem!(item)}
            style={baseStyle}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "var(--accent-tint)";
              el.style.color = "var(--accent-strong, #4338CA)";
              el.style.borderColor = "var(--accent-tint)";
              el.style.transform = "translateY(-1px)";
              el.style.boxShadow = "var(--shadow-sm)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "var(--paper-sunk, #F1EFEA)";
              el.style.color = "var(--ink-2)";
              el.style.borderColor = "var(--line)";
              el.style.transform = "";
              el.style.boxShadow = "";
            }}
          >
            {item}
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.6 }}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span key={item} style={baseStyle}>
            {item}
          </span>
        )
      )}
    </div>
  );
}
