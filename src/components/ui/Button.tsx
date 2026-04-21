"use client";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const stylesByVariant: Record<Variant, React.CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, var(--brand), var(--brand-2))",
      border: "1px solid rgba(0,0,0,0.08)"
    },
    secondary: {
      background: "var(--surface-2)",
      border: "1px solid var(--border-1)"
    },
    ghost: {
      background: "transparent",
      border: "1px solid var(--border-1)"
    },
    danger: {
      background: "rgba(225,29,72,0.12)",
      border: "1px solid rgba(225,29,72,0.28)"
    }
  };

  return (
    <button
      {...props}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        color: "var(--text)",
        boxShadow: "var(--shadow-soft)",
        transition: "transform 120ms ease, background 120ms ease, border 120ms ease",
        ...stylesByVariant[variant],
        ...(props.disabled
          ? { opacity: 0.6, cursor: "not-allowed", boxShadow: "none" }
          : {})
      }}
      onMouseDown={(e) => {
        props.onMouseDown?.(e);
        if (!props.disabled) e.currentTarget.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        props.onMouseUp?.(e);
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {children}
    </button>
  );
}
