"use client";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-[14px] font-semibold " +
    "transition-transform transition-colors duration-150 " +
    "hover:-translate-y-[1px] active:translate-y-[1px] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] " +
    "disabled:opacity-60 disabled:pointer-events-none";

  const byVariant: Record<Variant, string> = {
    primary:
      "bg-gradient-to-br from-[color:var(--brand)] to-[color:var(--brand-2)] text-[color:var(--text)] border border-black/10 shadow-[var(--shadow-soft)]",
    secondary:
      "bg-[color:var(--surface-2)] border border-[color:var(--border-1)] shadow-[var(--shadow-soft)]",
    ghost:
      "bg-transparent border border-[color:var(--border-1)] hover:bg-[color:var(--surface-2)]",
    danger:
      "bg-rose-500/10 border border-rose-500/30 text-[color:var(--text)] hover:bg-rose-500/15"
  };

  return (
    <button
      {...props}
      className={[base, byVariant[variant], className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
