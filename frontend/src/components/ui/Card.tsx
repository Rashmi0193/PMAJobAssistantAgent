"use client";

export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        padding: 16,
        ...props.style
      }}
    >
      {children}
    </div>
  );
}
