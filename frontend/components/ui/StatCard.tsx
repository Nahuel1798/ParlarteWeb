import type { ReactNode } from "react";
import Progress from "./Progress";

export type StatTone = "primary" | "secondary" | "tertiary";

interface StatCardProps {
  title: string;
  value: string;
  suffix?: string;
  change?: string;
  description?: string;
  trendIcon?: "trending_up" | "trending_down" | "trending_flat";
  icon: string;
  tone?: StatTone;
  progress?: number;
  footer?: ReactNode;
  className?: string;
}

const toneText: Record<StatTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export default function StatCard({
  title,
  value,
  suffix,
  change,
  description,
  trendIcon = "trending_up",
  icon,
  tone = "primary",
  progress,
  footer,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="font-caption text-xs font-semibold uppercase tracking-wider text-secondary">
            {title}
          </span>

          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-high ${toneText[tone]}`}
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="font-headline-md text-3xl font-bold leading-none text-on-surface">
            {value}
          </span>

          {suffix && <span className="text-sm text-on-surface-variant">{suffix}</span>}

          {change && (
            <span className={`text-xs font-semibold ${toneText[tone]}`}>
              {change}
            </span>
          )}
        </div>

        {description && (
          <div className="mt-2 flex items-center gap-1 text-xs text-on-surface-variant">
            <span className={`material-symbols-outlined text-sm ${toneText[tone]}`}>
              {trendIcon}
            </span>

            {description}
          </div>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="mt-4">
          <Progress value={progress} tone={tone} />
        </div>
      )}

      {footer && (
        <div className="mt-5 border-t border-outline-variant/20 pt-3">
          {footer}
        </div>
      )}
    </div>
  );
}