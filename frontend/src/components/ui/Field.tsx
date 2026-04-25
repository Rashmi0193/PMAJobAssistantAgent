import { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  id,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={id}
        className="text-[13px] text-[color:var(--muted)]"
      >
        {label}
      </label>

      {children}

      {hint && (
        <p className="text-[12px] text-[color:var(--faint)]">
          {hint}
        </p>
      )}
    </div>
  );
}