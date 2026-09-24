"use client";

import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Card from "@/components/ui/Card";
import {
  crearInscripcion,
  listarCursos,
  listarUsuariosPorRol,
  type CursoResponse,
  type UsuarioResponse,
} from "../../lib/api";

export default function NuevaInscripcionForm() {
  const router = useRouter();
  const t = useTranslations("admin");

  const [alumnos, setAlumnos] = useState<UsuarioResponse[]>([]);
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  const [alumnoId, setAlumnoId] = useState<number | null>(null);
  const [cursoId, setCursoId] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarUsuariosPorRol("ALUMNO")
      .then((data) => {
        if (active) setAlumnos(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("nuevaInscripcionDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) setCargandoAlumnos(false);
      });

    listarCursos()
      .then((data) => {
        if (active) setCursos(data.filter((curso) => curso.activo));
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("nuevaInscripcionDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) setCargandoCursos(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!alumnoId) {
      setError(t("nuevaInscripcionAlumnoRequired"));
      return;
    }

    if (!cursoId) {
      setError(t("nuevaInscripcionCursoRequired"));
      return;
    }

    setSubmitting(true);

    try {
      await crearInscripcion({ alumnoId, cursoId });
      router.push("/admin/inscripciones");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("nuevaInscripcionDefaultError")
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Selección */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          kicker={t("nuevaInscripcionAlumnoKicker")}
          title={t("nuevaInscripcionAlumnoLabel")}
          subtitle={t("nuevaInscripcionAlumnoSubtitle")}
          icon="person"
        >
          {cargandoAlumnos ? (
            <div className="py-8 text-center text-sm text-on-surface-variant">
              {t("nuevaInscripcionLoading")}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <select
                value={alumnoId ?? ""}
                onChange={(e) =>
                  setAlumnoId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full rounded-lg bg-surface-container px-3 py-3 text-sm font-medium outline-none ring-1 ring-outline-variant/40 focus:bg-surface-container-low"
              >
                <option value="">{t("nuevaInscripcionAlumnoPlaceholder")}</option>

                {alumnos.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre}
                    {alumno.apellidos ? ` ${alumno.apellidos}` : ""} (
                    {alumno.email})
                  </option>
                ))}
              </select>

              {alumnos.length === 0 && (
                <span className="text-xs font-medium text-secondary">
                  {t("nuevaInscripcionAlumnoEmpty")}
                </span>
              )}
            </div>
          )}
        </Card>

        <Card
          kicker={t("nuevaInscripcionCursoKicker")}
          title={t("nuevaInscripcionCursoLabel")}
          subtitle={t("nuevaInscripcionCursoSubtitle")}
          icon="menu_book"
        >
          {cargandoCursos ? (
            <div className="py-8 text-center text-sm text-on-surface-variant">
              {t("nuevaInscripcionLoading")}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <select
                value={cursoId ?? ""}
                onChange={(e) =>
                  setCursoId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full rounded-lg bg-surface-container px-3 py-3 text-sm font-medium outline-none ring-1 ring-outline-variant/40 focus:bg-surface-container-low"
              >
                <option value="">{t("nuevaInscripcionCursoPlaceholder")}</option>

                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre} ({curso.nivel})
                  </option>
                ))}
              </select>

              {cursos.length === 0 && (
                <span className="text-xs font-medium text-secondary">
                  {t("nuevaInscripcionCursoEmpty")}
                </span>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Errores */}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/admin/inscripciones"
          className="flex items-center gap-2 rounded-lg bg-surface-container-lowest px-4 py-3 text-xs font-semibold text-on-surface shadow-sm ring-1 ring-outline-variant/40 transition hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t("nuevaInscripcionBack")}
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-on-primary shadow-md transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-primary/20 border-t-on-primary" />
          ) : (
            <span className="material-symbols-outlined text-[18px]">
              how_to_reg
            </span>
          )}

          {submitting ? t("nuevaInscripcionSubmitting") : t("nuevaInscripcionSubmit")}
        </button>
      </div>
    </form>
  );
}