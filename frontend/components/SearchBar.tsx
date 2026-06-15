"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialValue?: string;
  size?: "default" | "sm";
  placeholder?: string;
}

export default function SearchBar({
  initialValue = "",
  size = "default",
  placeholder = "Company name — try Stripe, Zepto, Grab…",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) router.push(`/analyze/${encodeURIComponent(trimmed)}`);
  }

  const isSm = size === "sm";

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        background: "var(--surface)",
        border: "1.5px solid var(--line)",
        borderRadius: isSm ? "10px" : "14px",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
        width: "100%",
      }}
      onFocus={(e) => {
        (e.currentTarget as HTMLFormElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLFormElement).style.boxShadow =
          "0 0 0 3px var(--accent-tint), var(--shadow-md)";
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          (e.currentTarget as HTMLFormElement).style.borderColor = "var(--line)";
          (e.currentTarget as HTMLFormElement).style.boxShadow = "var(--shadow-md)";
        }
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: isSm ? "12px" : "18px",
          color: "var(--ink-3)",
          flexShrink: 0,
        }}
      >
        <svg
          width={isSm ? 15 : 17}
          height={isSm ? 15 : 17}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search company"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          padding: isSm ? "10px 10px" : "15px 12px",
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: isSm ? "14px" : "15px",
          color: "var(--ink)",
          minWidth: 0,
        }}
      />

      <button
        type="submit"
        disabled={!query.trim()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: isSm ? "7px 13px" : "11px 18px",
          margin: isSm ? "4px" : "5px",
          background: query.trim() ? "var(--accent)" : "var(--line)",
          color: query.trim() ? "#ffffff" : "var(--ink-3)",
          border: "none",
          borderRadius: isSm ? "7px" : "9px",
          fontSize: isSm ? "13px" : "14px",
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontWeight: 500,
          cursor: query.trim() ? "pointer" : "default",
          transition: "background 160ms ease, color 160ms ease",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          if (query.trim())
            (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-strong)";
        }}
        onMouseLeave={(e) => {
          if (query.trim())
            (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
        }}
      >
        {isSm ? (
          "Go"
        ) : (
          <>
            Generate brief
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
