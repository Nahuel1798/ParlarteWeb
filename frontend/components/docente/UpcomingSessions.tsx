"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";
import { listarCursos, listarInscripciones, type CursoResponse } from "../../lib/api";
import { useSessionUser } from "../../lib/session";

interface Session {
  curso: CursoResponse;
  inscritos: number;
  inicio: string;
  fin: string;
}

function extraerHorarios(horario: string): { inicio: string; fin: string } {
  const matches = horario.match(/\d{1,2}:\d{2}/g);
  return {
    inicio: matches?.[0] ?? horario,
    fin: matches?.[1] ?? "",
  };
}

export default function UpcomingSessions() {
  const t = useTranslations("docente");
  const user = useSessionUser();

  const [sessions, setSessions] = useState<Session[]>([]);
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

        setSessions(
          asignados.map((curso) => {
            const { inicio, fin } = extraerHorarios(curso.horario);
            return {
              curso,
              inscritos: inscripciones.filter(
                (inscripcion) =>
                  inscripcion.activa && inscripcion.cursoId === curso.id
              ).length,
              inicio,
              fin,
            };
          })
        );
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("sessionsDefaultError")
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
      kicker={t("sessionsKicker")}
      title={t("sessionsTitle")}
      action={
        <div className="flex items-center gap-1 rounded-xl bg-surface-container px-3 py-1">
          <span className="material-symbols-outlined text-[18px] text-primary">
            videocam
          </span>

          <span className="font-caption text-xs text-on-surface-variant">
            {t("sessionsPlatform")}
          </span>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-8 text-sm text-on-surface-variant">
          {t("sessionsLoading")}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {error}
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-8 text-center text-sm text-on-surface-variant">
          {t("sessionsEmpty")}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div
              key={session.curso.id}
              className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-low p-4 transition-all hover:bg-surface-container md:flex-row md:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="flex min-w-[90px] flex-col items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-on-primary">
                  <span className="font-label-md text-xs uppercase">
                    {t("sessionsStart")}
                  </span>

                  <span className="font-headline-md my-1 text-2xl font-bold leading-none">
                    {session.inicio}
                  </span>

                  {session.fin && (
                    <span className="font-caption text-[10px] opacity-80">
                      {t("sessionsEnd")} {session.fin}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-tertiary-fixed text-[11px] font-semibold uppercase tracking-wide text-on-tertiary-fixed px-2 py-1">
                      {t("sessionsLevel", { nivel: session.curso.nivel })}
                    </span>

                    <span className="font-caption text-xs font-semibold text-secondary">
                      {t("sessionsModulesCount", {
                        count: session.curso.numeroModulos ?? 0,
                      })}
                    </span>
                  </div>

                  <h3 className="font-headline-md text-xl font-semibold text-primary">
                    {session.curso.nombre}
                  </h3>

                  <p className="text-sm text-on-surface-variant">
                    {session.curso.descripcion}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-on-surface-variant">
                    <span className="flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        groups
                      </span>

                      {t("sessionsStudentsCount", {
                        count: session.inscritos,
                      })}
                    </span>

                    <span className="flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        schedule
                      </span>

                      {t("sessionsHoursCount", {
                        count: session.curso.duracionHoras,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-row gap-2 md:w-auto md:flex-col">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1 rounded bg-primary px-4 py-2 font-label-md text-on-primary transition hover:bg-primary-container md:flex-none"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    meeting_room
                  </span>

                  {t("sessionsOpenRoom")}
                </button>

                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-1 rounded bg-surface-container-high px-4 py-2 font-label-md text-on-surface transition hover:bg-surface-variant md:flex-none"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    checklist
                  </span>

                  {t("sessionsAttendance")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}