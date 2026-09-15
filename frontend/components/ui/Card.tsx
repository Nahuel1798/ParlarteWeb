import type { ReactNode } from "react";

interface CardProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  divider?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Card({
  kicker,
  title,
  subtitle,
  icon,
  action,
  divider = true,
  className = "",
  children,
}: CardProps) {
  const hasHeader = Boolean(kicker || title || subtitle || icon || action);

  return (
    <section
      className={`rounded-xl bg-surface-container-lowest p-6 shadow-sm ${className}`}
    >
      {hasHeader && (
        <div
          className={`flex items-start justify-between gap-4 ${
            divider ? "border-b border-outline-variant/20 pb-5" : "pb-5"
          } mb-5`}
        >
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="material-symbols-outlined mt-0.5 text-[22px] text-primary">
                {icon}
              </span>
            )}

            <div className="min-w-0">
              {kicker && (
                <span className="font-caption text-xs font-semibold uppercase tracking-widest text-secondary">
                  {kicker}
                </span>
              )}

              {title && (
                <h2 className="font-headline-md text-xl font-semibold leading-snug text-primary">
                  {title}
                </h2>
              )}

              {subtitle && (
                <p className="mt-0.5 text-xs text-on-surface-variant">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </section>
  );
}