"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Card from "@/components/ui/Card";
import { listarCursos, type CursoResponse } from "../../lib/api";
import { useSessionUser } from "../../lib/session";

export default function AssignedCourses() {
  const t = useTranslations("docente");
  const user = useSessionUser();
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarCursos()
      .then((data) => {
        if (!active) return;

        if (user) {
          setCursos(data.filter((curso) => curso.profesor?.id === user.id));
        } else {
          setCursos([]);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("assignedDefaultError")
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
      kicker={t("assignedKicker")}
      title={t("assignedTitle")}
      subtitle={t("assignedSubtitle")}
    >
      {loading ? (
        <div className="flex items-center justify-center py-8 text-sm text-on-surface-variant">
          {t("assignedLoading")}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {error}
        </div>
      ) : cursos.length === 0 ? (
        <div className="py-8 text-center text-sm text-on-surface-variant">
          {t("assignedEmpty")}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cursos.map((course) => (
            <Link
              key={course.id}
              href={`/curso/${course.id}/clases`}
              className="block transition hover:border-primary/30"
            >
              <div className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-tertiary-fixed px-2 py-1 text-[11px] font-semibold uppercase text-on-tertiary-fixed">
                    {course.nivel}
                  </span>

                  <span className="font-caption text-xs text-on-surface-variant">
                    {t("assignedModuli", {
                      count: course.numeroModulos ?? 0,
                    })}
                  </span>
                </div>

                <h4 className="font-headline-md text-lg font-semibold text-primary">
                  {course.nombre}
                </h4>

                <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
                  <span>{course.horario}</span>

                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <span className="material-symbols-outlined text-[14px]">
                      edit_note
                    </span>

                    {t("assignedManage")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}