"use client";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        background: "var(--surface-2)",
        border: "1px solid var(--border-1)",
        outline: "none"
      }}
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        background: "var(--surface-2)",
        border: "1px solid var(--border-1)",
        outline: "none",
        resize: "vertical"
      }}
    />
  );
}
