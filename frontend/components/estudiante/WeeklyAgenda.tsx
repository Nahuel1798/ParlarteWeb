"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Card from "@/components/ui/Card";
import { listarEventos, type EventoResponse } from "../../lib/api";
import {
  aIso,
  formatearHora,
  inicioDelDia,
  nombreDiaCorto,
  numeroDia,
  sumarDias,
  finDelDia,
} from "@/components/calendario/dateUtils";
import { tonoDe } from "@/components/calendario/tonosEvento";

const LIMITE = 5;

export default function WeeklyAgenda() {
  const t = useTranslations("estudiante");
  const tc = useTranslations("calendario");
  const locale = useLocale();

  const [eventos, setEventos] = useState<EventoResponse[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const hoy = new Date();
    let active = true;

    listarEventos(aIso(inicioDelDia(hoy)), aIso(finDelDia(sumarDias(hoy, 6))))
      .then((data) => {
        if (active) setEventos(data.slice(0, LIMITE));
      })
      .catch(() => {
        if (active) setEventos([]);
      })
      .finally(() => {
        if (active) setCargando(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const mesActual = cargando
    ? ""
    : new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date());

  return (
    <Card
      title={t("agendaTitle")}
      icon="event_upcoming"
      action={
        <span className="text-xs font-semibold capitalize text-secondary">
          {mesActual}
        </span>
      }
    >
      {cargando ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: LIMITE }, (_, i) => (
            <div
              key={i}
              className="h-[72px] animate-pulse rounded-lg bg-surface-container-low"
            />
          ))}
        </div>
      ) : eventos.length === 0 ? (
        <div className="py-8 text-center text-sm text-on-surface-variant">
          {t("agendaVacia")}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {eventos.map((evento, indice) => {
            const tono = tonoDe(evento.tipo);
            const fecha = new Date(evento.fecha);
            return (
              <div
                key={evento.id}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  indice === 0
                    ? "bg-surface-container-low"
                    : "transition-colors hover:bg-surface-container-low"
                }`}
              >
                <div
                  className={`flex h-12 w-10 flex-col items-center justify-center rounded font-semibold ${
                    indice === 0
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface"
                  }`}
                >
                  <span className="text-[10px] uppercase">
                    {nombreDiaCorto(fecha, locale)}
                  </span>
                  <span className="font-headline-md text-sm">{numeroDia(fecha)}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="truncate text-xs font-semibold">
                      {evento.titulo}
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold text-secondary">
                      {formatearHora(evento.fecha, locale)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${tono.barra}`} />
                    <span className="truncate text-[11px] text-on-surface-variant">
                      {evento.cursoNombre ?? tc("eventoGeneral")}
                      {evento.claseTitulo ? ` · ${evento.claseTitulo}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/estudiante/calendario"
        className="mt-4 flex w-full items-center justify-center gap-1 rounded bg-surface-container py-2 text-xs font-semibold text-primary transition hover:bg-surface-container-high"
      >
        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
        {t("agendaVerCalendario")}
      </Link>
    </Card>
  );
}
