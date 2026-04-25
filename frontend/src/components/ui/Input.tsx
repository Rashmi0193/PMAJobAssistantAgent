export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-[color:var(--border-1)] bg-[color:var(--surface-2)] px-3 py-2.5 outline-none",
        "focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20",
        "placeholder:text-[color:var(--faint)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full resize-y rounded-xl border border-[color:var(--border-1)] bg-[color:var(--surface-2)] px-3 py-2.5 outline-none",
        "focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20",
        "placeholder:text-[color:var(--faint)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}