"use client";

export function Card({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[
        "rounded-[var(--radius)] border border-[color:var(--border-1)] bg-[color:var(--surface-1)] shadow-[var(--shadow)]",
        props.className
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        padding: 16,
        ...props.style
      }}
    >
      {children}
    </div>
  );
}
