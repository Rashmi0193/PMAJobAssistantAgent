"use client";

export function Divider({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        height: 1,
        background: "var(--border-2)",
        margin: "12px 0",
        ...style
      }}
    />
  );
}
