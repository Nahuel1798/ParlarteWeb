import type { DashboardConfig } from "./config";

interface DashboardHeaderProps {
  config: DashboardConfig;
  onMenuClick?: () => void;
}

export default function DashboardHeader({
  config,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header
      className={`fixed right-0 top-0 z-40 flex h-20 items-center justify-between bg-surface/80 px-4 shadow-sm backdrop-blur-xl md:px-6 ${config.headerOffset}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Apri menu"
          className="rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface lg:hidden"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <span className="font-headline-md text-xl font-medium tracking-tight text-on-surface">
          Campus Virtual
        </span>

        <span className="h-4 w-px bg-outline-variant" />

        <span className="hidden text-xs text-on-surface-variant sm:block">
          Anno Accademico 2025–2026
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Contexto */}
        <div className="hidden items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 md:flex">

          <div className="flex items-center gap-1 text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-[16px]">
              school
            </span>

            <span>Parlarte</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="relative rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
          </button>

          <button
            type="button"
            className="rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
          </button>

          <button
            type="button"
            className="rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              help
            </span>
          </button>
        </div>

        <div className="h-6 w-px bg-outline-variant" />

        <button
          type="button"
          aria-label="Perfil de usuario"
          className="flex items-center gap-2 rounded-xl px-2 py-1 transition-all hover:bg-surface-container-high"
        >
          <div className="hidden flex-col items-end sm:flex">
            <span className="max-w-[140px] truncate text-xs font-semibold text-on-surface">
              {config.userName}
            </span>

            <span className="text-[11px] text-on-surface-variant">
              {config.roleLabel}
            </span>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary">
            {config.userName.charAt(0).toUpperCase() || "?"}
          </div>
        </button>
      </div>
    </header>
  );
}