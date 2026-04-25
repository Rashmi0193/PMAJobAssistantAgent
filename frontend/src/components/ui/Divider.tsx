
export function Divider({
  style,
  className
}: {
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <hr
      className={["h-px bg-[color:var(--border-2)] my-3", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...style
      }}
    />
  );
}
