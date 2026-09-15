import type { ReactNode } from "react";

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  kicker,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-secondary" />

          <span className="font-caption text-xs font-semibold uppercase tracking-widest text-secondary">
            {kicker}
          </span>
        </div>

        <h1 className="font-headline-lg text-3xl font-semibold tracking-tight text-primary md:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-base text-on-surface-variant">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </div>
  );
}