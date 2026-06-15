interface StatCardProps {
  label: string;
  value: string | number | boolean | null | undefined;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  const display =
    value === null || value === undefined
      ? "—"
      : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value);

  return (
    <div
      style={{
        background: "var(--surface, #fff)",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-sm)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-newsreader), Georgia, serif",
          fontSize: "28px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          lineHeight: 1,
        }}
      >
        {display}
      </span>
      {hint && (
        <span
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "12px",
            color: "var(--ink-3)",
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}
