"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  listarEventos,
  type EventoResponse,
} from "../../lib/api";
import { useCursosAlumno } from "../../lib/alumno";
import {
  aIso,
  etiquetaDiaLargo,
  finDelDia,
  formatearHora,
  sumarDias,
} from "@/components/calendario/dateUtils";
import { tonoDe } from "@/components/calendario/tonosEvento";

export default function NextLesson() {
  const t = useTranslations("estudiante");
  const tc = useTranslations("calendario");
  const locale = useLocale();
  const { cursos } = useCursosAlumno();

  const [evento, setEvento] = useState<EventoResponse | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let active = true;
    const ahora = new Date();

    listarEventos(aIso(ahora), aIso(finDelDia(sumarDias(ahora, 30))))
      .then((data) => {
        if (!active) return;

        const proximos = [...data].sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        setEvento(proximos[0] ?? null);
      })
      .catch(() => {
        if (active) setEvento(null);
      })
      .finally(() => {
        if (active) setCargando(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (cargando) {
    return (
      <section className="h-72 animate-pulse rounded-xl bg-surface-container-lowest shadow-md" />
    );
  }

  if (!evento) {
    return (
      <section className="flex min-h-[180px] items-center justify-center rounded-xl bg-surface-container-lowest p-6 text-center shadow-md">
        <div>
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">
            event_busy
          </span>

          <p className="mt-2 text-sm text-on-surface-variant">
            {t("nextLessonEmpty")}
          </p>
        </div>
      </section>
    );
  }

  const tono = tonoDe(evento.tipo);
  const portada = evento.cursoId
    ? cursos.find((curso) => curso.id === evento.cursoId)?.portadaUrl
    : undefined;

  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-md md:flex-row">
      <div className="relative h-64 md:h-auto md:w-5/12">
        <div
          className={`h-full min-h-[220px] w-full bg-cover bg-center ${
            portada ? "" : "bg-gradient-to-br from-primary to-primary-container"
          }`}
          style={portada ? { backgroundImage: `url('${portada}')` } : undefined}
        />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          {tc(`tipo.${evento.tipo}`)}
        </div>
      </div>

      <div className="flex flex-col justify-between p-6 md:w-7/12">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>

              {etiquetaDiaLargo(new Date(evento.fecha), locale)} ·{" "}
              {formatearHora(evento.fecha, locale)}
            </span>
          </div>

          <h2 className="font-headline-md text-2xl font-semibold leading-snug text-primary">
            {evento.titulo}
          </h2>

          {evento.descripcion && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
              {evento.descripcion}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${tono.chip}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {tono.icono}
              </span>
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold">
                {evento.cursoNombre ?? tc("eventoGeneral")}
              </span>

              {evento.claseTitulo && (
                <span className="truncate text-[11px] text-on-surface-variant">
                  {evento.claseTitulo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/estudiante/calendario"
            className="flex items-center gap-2 rounded bg-primary px-5 py-3 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">
              calendar_month
            </span>

            {t("nextLessonJoin")}
          </Link>

          {evento.cursoId && (
            <Link
              href={`/curso/${evento.cursoId}/clases`}
              className="flex items-center gap-2 rounded bg-surface-container-high px-4 py-3 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">
                menu_book
              </span>

              {t("nextLessonMaterials")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
