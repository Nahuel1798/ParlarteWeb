export default function WelcomeHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 pb-6 pt-6 md:flex-row md:items-end">
      
      <div className="flex flex-col">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-secondary" />

          <span className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
            Accademia di Lingua & Cultura • Anno 2025
          </span>
        </div>

        <h1 className="font-headline-lg text-3xl font-semibold tracking-tight text-primary md:text-5xl">
          Bentornato, Matteo!
        </h1>

        <p className="mt-1 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
          Tu viaje hacia la maestría del italiano continúa hoy con nuevas
          perspectivas.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-container text-lg font-semibold text-on-tertiary-container">
            B1
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant">
              Livello Quadro QCER
            </span>

            <span className="text-xs font-semibold text-primary">
              Intermedio Progressivo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 shadow-sm">
          <span className="material-symbols-outlined text-[24px] text-secondary">
            local_fire_department
          </span>

          <div>
            <span className="block text-[11px] text-on-surface-variant">
              Racha de Estudio
            </span>

            <span className="text-xs font-semibold">
              14 Giorni di Fila
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}