"use client";

export function Badge({
  children,
  tone = "neutral",
  className = ""
}: {
  children: React.ReactNode;
  tone?: "neutral" | "ok" | "warn" | "danger";
  className?: string;
}) {
  const toneClasses = {
    neutral:
      "bg-[color:var(--surface-2)] border-[color:var(--border-1)] text-slate-700 dark:text-slate-200",
    ok:
      "bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30",
    warn:
      "bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    danger:
      "bg-rose-100 border-rose-200 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs border ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}