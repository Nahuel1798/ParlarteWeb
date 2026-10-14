"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import Card from "@/components/ui/Card";
import {
  crearInscripcion,
  listarCursos,
  listarInscripciones,
  listarUsuariosPorRol,
  type CursoResponse,
  type InscripcionResponse,
  type UsuarioResponse,
} from "../../lib/api";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function iniciales(nombre: string, apellidos: string | null): string {
  return `${nombre} ${apellidos ?? ""}`
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

export default function NuevaInscripcionForm() {
  const router = useRouter();
  const t = useTranslations("admin");

  const [alumnos, setAlumnos] = useState<UsuarioResponse[]>([]);
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [inscripciones, setInscripciones] = useState<InscripcionResponse[]>([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true);
  const [cargandoCursos, setCargandoCursos] = useState(true);

  const [busquedaAlumno, setBusquedaAlumno] = useState("");
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
        if (active) setCursos(data);
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

    listarInscripciones()
      .then((data) => {
        if (active) setInscripciones(data);
      })
      .catch(() => {
        // Si falla, se muestran todos los alumnos sin filtrar disponibilidad.
      });

    return () => {
      active = false;
    };
  }, [t]);

  // Alumnos que todavía no tienen una inscripción en el curso seleccionado.
  const alumnosElegibles = useMemo(() => {
    if (cursoId === null) return alumnos;
    return alumnos.filter(
      (alumno) =>
        !inscripciones.some(
          (inscripcion) =>
            inscripcion.alumnoId === alumno.id &&
            inscripcion.cursoId === cursoId
        )
    );
  }, [alumnos, inscripciones, cursoId]);

  const alumnosDisponibles = useMemo(() => {
    const termino = normalizar(busquedaAlumno);
    if (!termino) return alumnosElegibles;
    return alumnosElegibles.filter((alumno) =>
      normalizar(`${alumno.nombre} ${alumno.apellidos ?? ""}`).includes(termino)
    );
  }, [alumnosElegibles, busquedaAlumno]);

  const handleCursoChange = (nuevoCursoId: number | null) => {
    setCursoId(nuevoCursoId);

    if (
      alumnoId !== null &&
      nuevoCursoId !== null &&
      inscripciones.some(
        (inscripcion) =>
          inscripcion.alumnoId === alumnoId &&
          inscripcion.cursoId === nuevoCursoId
      )
    ) {
      setAlumnoId(null);
    }
  };

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
              <div className="flex items-center gap-2 rounded-lg bg-surface-container px-3 focus-within:bg-surface-container-low focus-within:ring-1 focus-within:ring-primary">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  search
                </span>

                <input
                  value={busquedaAlumno}
                  onChange={(e) => setBusquedaAlumno(e.target.value)}
                  placeholder={t("nuevaInscripcionAlumnoSearch")}
                  className="w-full bg-transparent py-3 text-sm font-medium outline-none"
                />

                {busquedaAlumno && (
                  <button
                    type="button"
                    onClick={() => setBusquedaAlumno("")}
                    className="text-on-surface-variant transition hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      close
                    </span>
                  </button>
                )}
              </div>

              {alumnos.length === 0 ? (
                <span className="text-xs font-medium text-secondary">
                  {t("nuevaInscripcionAlumnoEmpty")}
                </span>
              ) : alumnosDisponibles.length === 0 ? (
                <span className="text-xs font-medium text-secondary">
                  {t("nuevaInscripcionAlumnoNoResults")}
                </span>
              ) : (
                <ul className="max-h-64 overflow-y-auto rounded-lg ring-1 ring-outline-variant/30">
                  {alumnosDisponibles.map((alumno) => {
                    const seleccionado = alumno.id === alumnoId;

                    return (
                      <li
                        key={alumno.id}
                        className="border-b border-surface-container last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => setAlumnoId(alumno.id)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                            seleccionado
                              ? "bg-primary/10"
                              : "hover:bg-surface-container-low"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                            {iniciales(alumno.nombre, alumno.apellidos)}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">
                              {alumno.nombre}
                              {alumno.apellidos ? ` ${alumno.apellidos}` : ""}
                            </span>

                            <span className="block truncate text-xs text-on-surface-variant">
                              {alumno.email}
                            </span>
                          </span>

                          {seleccionado && (
                            <span className="material-symbols-outlined text-[20px] text-primary">
                              check_circle
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
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
                  handleCursoChange(e.target.value ? Number(e.target.value) : null)
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
