import type { ReactNode } from "react";

type BadgeTone = "success" | "warning" | "error" | "neutral";

interface ToneBadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}

const tones: Record<BadgeTone, string> = {
  success: "bg-primary/10 text-primary",
  warning: "bg-tertiary/10 text-tertiary",
  error: "bg-secondary/10 text-secondary",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export default function ToneBadge({
  tone = "neutral",
  className = "",
  children,
}: ToneBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}