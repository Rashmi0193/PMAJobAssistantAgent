"use client";

export function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
      {children}
      {hint ? (
        <span style={{ fontSize: 12, color: "var(--faint)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

