"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import StatCard from "@/components/ui/StatCard";
import { listarCursos, listarInscripciones } from "../../lib/api";
import { useSessionUser } from "../../lib/session";

export default function StatsCards() {
  const t = useTranslations("docente");
  const user = useSessionUser();

  const [cursosCount, setCursosCount] = useState<number | null>(null);
  const [alumnosCount, setAlumnosCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([listarCursos(), listarInscripciones()])
      .then(([cursos, inscripciones]) => {
        if (!active) return;

        const asignados = user
          ? cursos.filter((curso) => curso.profesor?.id === user.id)
          : [];

        const cursoIds = new Set(asignados.map((curso) => curso.id));
        const alumnos = new Set(
          inscripciones
            .filter(
              (inscripcion) =>
                inscripcion.activa && cursoIds.has(inscripcion.cursoId)
            )
            .map((inscripcion) => inscripcion.alumnoId)
        );

        setCursosCount(asignados.length);
        setAlumnosCount(alumnos.size);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("statsDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) {
          setCursosCount((prev) => prev ?? 0);
          setAlumnosCount((prev) => prev ?? 0);
        }
      });

    return () => {
      active = false;
    };
  }, [user, t]);

  const enCarga = cursosCount === null;
  const alumnos = alumnosCount ?? 0;

  return (
    <div className="mb-8">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
          <span className="material-symbols-outlined text-[18px]">
            error
          </span>

          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title={t("statsProgram")}
        value={enCarga ? "—" : String(cursosCount)}
        icon="co_present"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-on-surface">
              <span className="font-semibold">
                {t("statsProgramCursos", { count: cursosCount ?? 0 })}
              </span>
            </span>

            {!error && (
              <span className="text-xs font-semibold text-primary">
                {t("statsProgramCapacity")}
              </span>
            )}
          </div>
        }
      />

      <StatCard
        title={t("statsRevisions")}
        value={enCarga ? "—" : String(alumnos)}
        icon="rate_review"
        tone="secondary"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-on-surface">
              <span className="font-semibold">
                {t("statsAlumnosActivos", { count: alumnos })}
              </span>
            </span>

            {!error && (
              <span className="text-xs font-semibold text-primary">
                {t("statsRevisionsHomework")}
              </span>
            )}
          </div>
        }
      />

      <StatCard
        title={t("statsRating")}
        value="4.9"
        suffix="/ 5.0"
        icon="stars"
        tone="tertiary"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex text-tertiary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className="material-symbols-outlined text-[16px]"
                  >
                    star
                  </span>
                ))}
              </div>

              <span className="text-xs text-on-surface-variant">
                {t("statsRatingReviews", { count: alumnos })}
              </span>
            </div>

            <span className="text-xs font-semibold text-primary">
              {t("statsRatingSemester")}
            </span>
          </div>
        }
      />
      </div>
    </div>
  );
}