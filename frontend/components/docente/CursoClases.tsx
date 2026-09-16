"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  crearClase,
  eliminarClase,
  listarCursos,
  listarClases,
  type ClaseResponse,
  type CursoResponse,
} from "../../lib/api";
import { useSessionUser } from "../../lib/session";

export default function CursoClases({ cursoId }: { cursoId: number }) {
  const router = useRouter();
  const user = useSessionUser();

  const [curso, setCurso] = useState<CursoResponse | null>(null);
  const [clases, setClases] = useState<ClaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [modulo, setModulo] = useState(1);
  const [creando, setCreando] = useState(false);

  const puedeGestionar =
    user && (user.rol === "ADMINISTRADOR" || user.rol === "PROFESOR");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.rol !== "ADMINISTRADOR" && user.rol !== "PROFESOR") {
      router.replace("/curso");
      return;
    }

    let active = true;

    Promise.all([listarCursos(), listarClases(cursoId)])
      .then(([cursos, clasesData]) => {
        if (!active) return;

        const encontrado = cursos.find((c) => c.id === cursoId);
        if (!encontrado) {
          setError("Curso no encontrado");
          return;
        }

        setCurso(encontrado);
        setClases(clasesData);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al cargar las clases"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cursoId, user, router]);

  const grupos = useMemo(() => {
    const map = new Map<number | null, ClaseResponse[]>();

    for (const clase of clases) {
      const key = clase.modulo;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(clase);
    }

    return Array.from(map.entries()).sort((a, b) => {
      const ma = a[0] ?? Number.MAX_SAFE_INTEGER;
      const mb = b[0] ?? Number.MAX_SAFE_INTEGER;
      return ma - mb;
    });
  }, [clases]);

  const agregarClase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim()) {
      setError("El título de la clase es obligatorio");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción de la clase es obligatoria");
      return;
    }

    setCreando(true);

    try {
      const nueva = await crearClase(cursoId, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        modulo,
      });

      setClases((prev) => [...prev, nueva]);
      setTitulo("");
      setDescripcion("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la clase"
      );
    } finally {
      setCreando(false);
    }
  };

  const borrarClase = async (clase: ClaseResponse) => {
    if (!window.confirm(`¿Eliminar la clase "${clase.titulo}"?`)) return;

    setError(null);

    try {
      await eliminarClase(cursoId, clase.id);
      setClases((prev) => prev.filter((c) => c.id !== clase.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar la clase"
      );
    }
  };

  if (!puedeGestionar) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20 text-on-surface antialiased">
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/docente"
              className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant transition hover:text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Volver al panel docente
            </Link>

            <h1 className="mt-3 font-headline-md text-2xl font-semibold text-primary sm:text-3xl">
              {loading ? "Caricamento…" : curso?.nombre}
            </h1>

            {curso && (
              <p className="mt-1 text-sm text-on-surface-variant">
                {curso.nivel} · {curso.duracionHoras} horas ·{" "}
                {curso.numeroModulos ?? 0} módulos planificados
              </p>
            )}
          </div>

          <span className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary">
              menu_book
            </span>
            {clases.length} {clases.length === 1 ? "classe" : "classi"}
          </span>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
            <span className="material-symbols-outlined text-[18px]">
              error
            </span>

            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center rounded-xl bg-surface-container-lowest py-20 text-sm text-on-surface-variant">
            Caricando le classi…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Formulario */}
            <form
              onSubmit={agregarClase}
              className="h-fit rounded-xl bg-surface-container-lowest p-6 shadow-sm lg:col-span-4"
            >
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-4">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  add_circle
                </span>

                <h2 className="font-headline-md text-lg font-semibold text-primary">
                  Aggiungi Classe
                </h2>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Titolo *
                  </label>

                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Es. Lezione 1.1: Introduzione"
                    className="rounded-lg bg-surface-container-low px-3 py-3 text-sm outline-none focus:bg-surface-bright focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Descrizione *
                  </label>

                  <textarea
                    rows={3}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Obiettivi e attività della lezione"
                    className="resize-none rounded-lg bg-surface-container-low px-3 py-3 text-sm outline-none focus:bg-surface-bright focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                    Módulo n°
                  </label>

                  <div className="flex items-center rounded-lg bg-surface-container-low px-3 focus-within:bg-surface-bright focus-within:ring-1 focus-within:ring-primary">
                    <input
                      type="number"
                      min={1}
                      value={modulo}
                      onChange={(e) => setModulo(Number(e.target.value))}
                      className="w-full bg-transparent py-3 text-sm font-semibold text-primary outline-none"
                    />

                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      grid_view
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creando}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creando ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-primary/20 border-t-on-primary" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                  )}

                  Aggiungi Classe
                </button>
              </div>
            </form>

            {/* Listado agrupado por módulo */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              {clases.length === 0 ? (
                <div className="rounded-xl bg-surface-container-lowest px-6 py-16 text-center shadow-sm">
                  <span className="material-symbols-outlined text-[40px] text-outline-variant">
                    menu_book
                  </span>

                  <p className="mt-3 font-body-md text-base text-on-surface-variant">
                    Todavía no hay clases en este curso. Agregá la primera desde
                    el formulario.
                  </p>
                </div>
              ) : (
                grupos.map(([numModulo, items]) => (
                  <section
                    key={numModulo ?? "sin-modulo"}
                    className="rounded-xl bg-surface-container-lowest p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                      <h2 className="flex items-center gap-2 font-headline-md text-base font-semibold text-primary">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-fixed text-[11px] font-bold text-on-primary-fixed">
                          {numModulo ?? "—"}
                        </span>

                        {numModulo ? `Módulo ${numModulo}` : "Sin módulo"}
                      </h2>

                      <span className="text-xs text-on-surface-variant">
                        {items.length} {items.length === 1 ? "classe" : "classi"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-3">
                      {items.map((clase) => (
                        <div
                          key={clase.id}
                          className="flex items-start justify-between gap-3 rounded-lg bg-surface-container-low p-4"
                        >
                          <div className="min-w-0">
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
                              <span className="material-symbols-outlined text-[18px] text-secondary">
                                record_voice_over
                              </span>

                              {clase.titulo}
                            </span>

                            <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">
                              {clase.descripcion}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => borrarClase(clase)}
                            className="shrink-0 rounded-lg p-2 text-on-surface-variant transition hover:bg-error-container hover:text-on-error-container"
                            aria-label={`Eliminar ${clase.titulo}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}