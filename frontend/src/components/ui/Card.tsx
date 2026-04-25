export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[
        "rounded-2xl border border-[color:var(--border-1)] bg-[color:var(--surface-1)] p-4 shadow-[var(--shadow)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}