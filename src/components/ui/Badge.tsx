"use client";

export function Badge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "warn" | "danger";
}) {
  const colorByTone: Record<string, { bg: string; border: string }> = {
    neutral: { bg: "var(--surface-2)", border: "var(--border-1)" },
    ok: { bg: "rgba(46,196,182,0.14)", border: "rgba(46,196,182,0.28)" },
    warn: { bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.28)" },
    danger: { bg: "rgba(225,29,72,0.14)", border: "rgba(225,29,72,0.28)" }
  };
  const c = colorByTone[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 8px",
        borderRadius: 999,
        background: c.bg,
        border: `1px solid ${c.border}`,
        fontSize: 12,
        color: "var(--text)"
      }}
    >
      {children}
    </span>
  );
}
