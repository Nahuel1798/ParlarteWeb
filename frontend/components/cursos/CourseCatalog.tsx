"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import PageHeader from "@/components/ui/PageHeader";
import ToneBadge from "@/components/ui/ToneBadge";
import { listarCursos, type CursoResponse } from "../../lib/api";
import { useSessionUser } from "../../lib/session";

function nivelTone(nivel: string) {
  if (nivel === "A1" || nivel === "A2") return "warning" as const;
  return "success" as const;
}

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(precio);
}

function MetaRow({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-on-surface-variant">
      <span className="material-symbols-outlined text-[18px] text-primary">
        {icon}
      </span>

      <span className="text-sm">{children}</span>
    </div>
  );
}

export default function CourseCatalog() {
  const user = useSessionUser();
  const canCreate = user?.rol === "ADMINISTRADOR";

  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarCursos()
      .then((data) => {
        if (active) setCursos(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al cargar los cursos"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full bg-surface py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6">
        <PageHeader
          kicker="Catalogo Corsi"
          title="Todos Nuestros Cursos"
          description="Explorá la oferta formativa completa de la Scuola, alineada con el MCER desde A1 hasta C2."
          actions={
            canCreate ? (
              <Link
                href="/curso/nuevo"
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-base">
                  add_circle
                </span>

                Crear Curso
              </Link>
            ) : undefined
          }
        />

        {loading ? (
          <div className="flex items-center justify-center rounded-xl bg-surface-container-lowest py-20 text-sm text-on-surface-variant">
            Cargando cursos…
          </div>
        ) : error ? (
          <div className="rounded-xl bg-secondary/10 px-6 py-10 text-sm text-secondary">
            {error}
          </div>
        ) : cursos.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest px-6 py-16 text-center">
            <p className="font-body-md text-base text-on-surface-variant">
              Todavía no hay cursos registrados.
            </p>

            {canCreate && (
              <Link
                href="/curso/nuevo"
                className="mx-auto mt-5 flex w-max items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-base">
                  add_circle
                </span>

                Crear el primer curso
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cursos.map((curso) => (
              <article
                key={curso.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-primary/15 bg-surface-container-lowest shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_rgba(21,66,18,0.08)]"
              >
                <div className="relative h-44 overflow-hidden">
                  <div
                    className={`h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${
                      curso.portadaUrl
                        ? ""
                        : "bg-gradient-to-br from-primary-fixed to-surface-container-high"
                    }`}
                    style={
                      curso.portadaUrl
                        ? { backgroundImage: `url('${curso.portadaUrl}')` }
                        : undefined
                    }
                  />

                  <div className="absolute right-4 top-4">
                    <ToneBadge tone={nivelTone(curso.nivel)}>
                      {curso.nivel}
                    </ToneBadge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-headline-md text-2xl text-primary">
                      {curso.nombre}
                    </h3>

                    <ToneBadge tone={curso.activo ? "success" : "neutral"}>
                      {curso.activo ? "Activo" : "Archivado"}
                    </ToneBadge>
                  </div>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
                    {curso.descripcion}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-outline-variant/30 pt-4">
                    <MetaRow icon="schedule">
                      {curso.horario}
                    </MetaRow>

                    <MetaRow icon="hourglass_top">
                      {curso.duracionHoras} horas
                    </MetaRow>

                    <MetaRow icon="co_present">
                      {curso.profesor
                        ? `${curso.profesor.nombre}${
                            curso.profesor.apellidos
                              ? ` ${curso.profesor.apellidos}`
                              : ""
                          }`
                        : "Sin asignar"}
                    </MetaRow>

                    <div className="flex items-center justify-between pt-1">
                      <MetaRow icon="payments">
                        {formatearPrecio(curso.precio)}
                      </MetaRow>

                      <span className="font-caption text-[11px] uppercase tracking-wider text-on-surface-variant">
                        Inscripción abierta
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}