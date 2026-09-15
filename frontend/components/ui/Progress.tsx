interface ProgressProps {
  value: number;
  tone?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md";
  className?: string;
}

const fillClass = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

export default function Progress({
  value,
  tone = "primary",
  size = "md",
  className = "",
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-surface-container-highest ${
        size === "sm" ? "h-1.5" : "h-2"
      } ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all ${fillClass[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}