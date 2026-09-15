"use client";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between bg-surface/80 px-4 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:left-72 md:px-6">
      
      <div className="flex items-center gap-2">
        <span className="font-headline-md text-xl font-medium tracking-tight">
          Campus Virtual
        </span>

        <span className="h-4 w-px bg-outline-variant" />

        <span className="hidden text-xs text-on-surface-variant md:block">
          Anno Accademico 2024–2025
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-6">

        <div className="hidden items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 md:flex">
          <span className="text-xs text-on-surface-variant">
            Contesto:
          </span>

          <div className="flex items-center gap-1 text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-[16px]">
              school
            </span>

            <span>Sede Centrale Firenze</span>
          </div>
        </div>

        <div className="flex items-center gap-1">

          <button className="relative rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface">
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
          </button>

          <button className="rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-[22px]">
              search
            </span>
          </button>

          <button className="rounded-full p-3 text-on-surface-variant transition-all hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-[22px]">
              help
            </span>
          </button>

        </div>

        <div className="h-6 w-px bg-outline-variant" />

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <span className="material-symbols-outlined text-[18px] text-on-primary">
            person
          </span>
        </div>

      </div>
    </header>
  );
}