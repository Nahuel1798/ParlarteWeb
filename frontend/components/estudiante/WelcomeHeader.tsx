import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export default function WelcomeHeader() {
  return (
    <PageHeader
      kicker="Accademia di Lingua & Cultura • Anno 2025"
      title="Bentornato, Matteo!"
      description="Tu viaje hacia la maestría del italiano continúa hoy con nuevas perspectivas."
      actions={
        <>
          <Link
            href="/curso"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-base">
              menu_book
            </span>

            Catálogo de Cursos
          </Link>

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

              <span className="text-xs font-semibold">14 Giorni di Fila</span>
            </div>
          </div>
        </>
      }
    />
  );
}