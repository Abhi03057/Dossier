interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: string | null;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "10px",
          boxShadow: "var(--shadow-sm)",
          padding: "16px 18px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          transition: "box-shadow 160ms ease, border-color 160ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--line)";
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.45,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.title}
        </h3>

        {article.description && (
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "12px",
              color: "var(--ink-3)",
              lineHeight: 1.55,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.description}
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "10px",
            color: "var(--ink-4)",
            letterSpacing: "0.03em",
          }}
        >
          <span>{article.source || "Unknown source"}</span>
          {article.publishedAt && (
            <>
              <span style={{ color: "var(--line-strong)" }}>·</span>
              <span>{formatDate(article.publishedAt)}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
