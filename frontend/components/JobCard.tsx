interface Job {
  title: string;
  location: string | null;
  location_inferred?: boolean;
  via: string;
  description: string;
  schedule_type: string | null;
  link?: string | null;
}

export default function JobCard({ job }: { job: Job }) {
  const hasLink = !!job.link;

  const card = (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-sm)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
        transition: "box-shadow 160ms ease, border-color 160ms ease",
        cursor: hasLink ? "pointer" : "default",
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <h3
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {job.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          {job.schedule_type && (
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "10px",
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: "9999px",
                background: "var(--accent-tint)",
                color: "var(--accent-strong)",
                whiteSpace: "nowrap",
              }}
            >
              {job.schedule_type}
            </span>
          )}
          {hasLink && (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7, flexShrink: 0 }}
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "11px",
          color: "var(--ink-3)",
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>
          {job.location ?? "India"}
          {job.location_inferred && (
            <span style={{ color: "var(--ink-4)", marginLeft: "2px" }}>*</span>
          )}
        </span>
        <span style={{ color: "var(--line-strong)" }}>·</span>
        <span>{job.via}</span>
      </div>

      {/* Description */}
      {job.description && (
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "12px",
            color: "var(--ink-3)",
            lineHeight: 1.6,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {job.description}
        </p>
      )}

      {/* Apply CTA */}
      {hasLink && (
        <div
          style={{
            marginTop: "auto",
            paddingTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--accent)",
          }}
        >
          View & apply
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      )}
    </div>
  );

  if (hasLink) {
    return (
      <a
        href={job.link!}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget.firstElementChild as HTMLElement;
          if (el) {
            el.style.boxShadow = "var(--shadow-md)";
            el.style.borderColor = "var(--accent)";
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget.firstElementChild as HTMLElement;
          if (el) {
            el.style.boxShadow = "var(--shadow-sm)";
            el.style.borderColor = "var(--line)";
          }
        }}
      >
        {card}
      </a>
    );
  }

  return card;
}
