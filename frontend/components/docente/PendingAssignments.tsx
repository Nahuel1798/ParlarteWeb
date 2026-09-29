"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Card from "@/components/ui/Card";
import {
  listarCursos,
  listarInscripciones,
  type CursoResponse,
  type InscripcionResponse,
} from "../../lib/api";
import { useSessionUser } from "../../lib/session";

interface PendingItem {
  id: number;
  iniciales: string;
  alumnoNombre: string;
  nivel: string;
  cursoNombre: string;
  fechaInscripcion: string;
}

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).slice(0, 2);
  return partes
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

export default function PendingAssignments() {
  const t = useTranslations("docente");
  const locale = useLocale();
  const user = useSessionUser();

  const [items, setItems] = useState<PendingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([listarCursos(), listarInscripciones()])
      .then(([cursos, inscripciones]) => {
        if (!active) return;

        const asignados = user
          ? cursos.filter((curso) => curso.profesor?.id === user.id)
          : [];

        const cursoPorId = new Map<number, CursoResponse>(
          asignados.map((curso) => [curso.id, curso])
        );

        const pendientes = inscripciones
          .filter(
            (inscripcion) =>
              inscripcion.activa && cursoPorId.has(inscripcion.cursoId)
          )
          .map((inscripcion: InscripcionResponse) => {
            const curso = cursoPorId.get(inscripcion.cursoId)!;
            return {
              id: inscripcion.id,
              iniciales: iniciales(inscripcion.alumnoNombre),
              alumnoNombre: inscripcion.alumnoNombre,
              nivel: curso.nivel,
              cursoNombre: curso.nombre,
              fechaInscripcion: inscripcion.fechaInscripcion,
            };
          });

        setTotal(pendientes.length);
        setItems(pendientes.slice(0, 3));
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("pendingDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, t]);

  return (
    <Card
      kicker={t("pendingKicker")}
      title={t("pendingTitle")}
      subtitle={t("pendingSubtitle")}
      action={
        <button
          type="button"
          className="flex items-center gap-1 font-label-md text-secondary transition hover:underline"
        >
          {t("pendingAction")} ({total})
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8 text-sm text-on-surface-variant">
          {t("pendingLoading")}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-sm text-on-surface-variant">
          {t("pendingEmpty")}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-low p-4 transition-all hover:bg-surface-container md:flex-row md:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container font-label-md text-sm text-on-primary">
                  {assignment.iniciales}
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-label-md text-on-surface">
                      {assignment.alumnoNombre}
                    </span>

                    <span className="rounded bg-tertiary-fixed px-2 py-1 text-[11px] font-semibold text-on-tertiary-fixed">
                      {assignment.nivel}
                    </span>
                  </div>

                  <span className="mt-1 text-sm font-medium text-on-surface">
                    {assignment.cursoNombre}
                  </span>

                  <span className="font-caption text-xs text-on-surface-variant">
                    {t("pendingEnrolled", {
                      date: new Date(
                        assignment.fechaInscripcion
                      ).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                      }),
                    })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 rounded bg-primary px-4 py-2 font-label-md text-on-primary transition hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[16px]">
                  edit_note
                </span>

                {t("pendingCorrect")}
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}