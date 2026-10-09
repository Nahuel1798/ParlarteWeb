"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/ui/PageHeader";
import { useCursosAlumno } from "../../lib/alumno";

export default function WelcomeHeader() {
  const t = useTranslations("estudiante");
  const { cursos, cargando, user } = useCursosAlumno();

  const nivel = cursos[0]?.nivel ?? "—";

  return (
    <PageHeader
      kicker={t("welcomeKicker")}
      title={t("welcomeTitle", { name: user?.nombre ?? "" })}
      description={t("welcomeDescription")}
      actions={
        <>
          <Link
            href="/curso"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-base">
              menu_book
            </span>

            {t("welcomeCatalog")}
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-container text-lg font-semibold text-on-tertiary-container">
              {cargando ? "…" : nivel}
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant">
                {t("welcomeLevelLabel")}
              </span>

              <span className="text-xs font-semibold text-primary">
                {cargando ? t("welcomeLoading") : nivel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 shadow-sm">
            <span className="material-symbols-outlined text-[24px] text-secondary">
              school
            </span>

            <div>
              <span className="block text-[11px] text-on-surface-variant">
                {t("welcomeCoursesLabel")}
              </span>

              <span className="text-xs font-semibold">
                {cargando
                  ? t("welcomeLoading")
                  : t("welcomeCoursesValue", { count: cursos.length })}
              </span>
            </div>
          </div>
        </>
      }
    />
  );
}
