"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  obtenerResumen,
  type CursoResumenResponse,
} from "../../lib/api";
import { useCursosAlumno } from "../../lib/alumno";

interface Recurso {
  icon: string;
  labelKey: string;
  valor: number;
}

export default function ActiveCourses() {
  const t = useTranslations("estudiante");
  const { cursos, cargando, error } = useCursosAlumno();

  const [resumenes, setResumenes] = useState<
    Record<number, CursoResumenResponse>
  >({});

  useEffect(() => {
    if (cursos.length === 0) return;

    let active = true;

    Promise.all(
      cursos.map((curso) =>
        obtenerResumen(curso.id)
          .then((resumen) => [curso.id, resumen] as const)
          .catch(() => null)
      )
    ).then((pares) => {
      if (!active) return;

      const mapa: Record<number, CursoResumenResponse> = {};
      pares.forEach((par) => {
        if (par) mapa[par[0]] = par[1];
      });

      setResumenes(mapa);
    });

    return () => {
      active = false;
    };
  }, [cursos]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-primary">
            school
          </span>

          <h2 className="font-headline-md text-xl font-semibold tracking-tight text-primary">
            {t("activeTitle")}
          </h2>
        </div>

        <Link
          href="/curso"
          className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
        >
          {t("activeAction")}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>

      {cargando ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {t("activeError")}
        </div>
      ) : cursos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest px-4 py-10 text-center shadow-sm">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">
            school
          </span>

          <p className="text-sm text-on-surface-variant">{t("activeEmpty")}</p>

          <Link
            href="/curso"
            className="rounded bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
          >
            {t("activeEmptyAction")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cursos.map((curso) => {
            const resumen = resumenes[curso.id];

            const recursos: Recurso[] = resumen
              ? [
                  {
                    icon: "menu_book",
                    labelKey: "activeClasses",
                    valor: resumen.clases,
                  },
                  {
                    icon: "smart_display",
                    labelKey: "activeVideos",
                    valor: resumen.videos,
                  },
                  {
                    icon: "folder_open",
                    labelKey: "activeMaterials",
                    valor: resumen.materiales,
                  },
                  {
                    icon: "assignment",
                    labelKey: "activeTasks",
                    valor: resumen.tareas,
                  },
                  {
                    icon: "quiz",
                    labelKey: "activeTests",
                    valor: resumen.tests,
                  },
                ]
              : [];

            return (
              <div
                key={curso.id}
                className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {t("activeLevel", { level: curso.nivel })}
                    </span>

                    <span className="text-xs font-semibold text-on-surface-variant">
                      {t("activeModuli", {
                        count: curso.numeroModulos ?? 0,
                      })}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-lg font-semibold text-on-surface">
                    {curso.nombre}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-on-surface-variant">
                    {curso.descripcion}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      schedule
                    </span>

                    {curso.horario} ·{" "}
                    {t("activeHours", { count: curso.duracionHoras })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {recursos.map((recurso) => (
                      <span
                        key={recurso.labelKey}
                        className="flex items-center gap-1 rounded bg-surface-container px-2 py-1 text-[11px] text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-[14px] text-secondary">
                          {recurso.icon}
                        </span>

                        {t(recurso.labelKey, { count: recurso.valor })}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-outline-variant/30 pt-3">
                  <span className="flex min-w-0 items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      person
                    </span>

                    <span className="truncate">
                      {curso.profesor?.nombre ?? t("activeUnassigned")}
                    </span>
                  </span>

                  <Link
                    href={`/curso/${curso.id}/clases`}
                    className="flex shrink-0 items-center gap-1 rounded bg-surface-container-high px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-variant"
                  >
                    {t("activeView")}

                    <span className="material-symbols-outlined text-[14px]">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
