"use client";

import { useTranslations } from "next-intl";
import type { EventoResponse } from "../../lib/api";
import {
  claveDia,
  diasDeRango,
  esHoy,
  numeroDia,
  nombreDiaCorto,
  rangoDe,
  semanasDeMes,
} from "./dateUtils";
import { tonoDe } from "./tonosEvento";

const MAXIMO_VISIBLES = 3;

export default function CalendarioMes({
  ancla,
  eventos,
  locale,
  onAbrirDia,
  onAbrirEvento,
  onCrear,
  puedeGestionar,
}: {
  ancla: Date;
  eventos: EventoResponse[];
  locale: string;
  onAbrirDia: (dia: Date) => void;
  onAbrirEvento: (evento: EventoResponse) => void;
  onCrear: (dia: Date) => void;
  puedeGestionar: boolean;
}) {
  const t = useTranslations("calendario");
  const semanas = semanasDeMes(ancla);
  const { desde, hasta } = rangoDe(ancla, "mes");
  const diasDelMes = new Set(
    diasDeRango(desde, hasta)
      .filter((dia) => dia.getMonth() === ancla.getMonth())
      .map(claveDia)
  );
  const encabezados = semanas[0];

  const eventosPorDia = new Map<string, EventoResponse[]>();
  for (const evento of eventos) {
    const clave = claveDia(new Date(evento.fecha));
    const lista = eventosPorDia.get(clave);
    if (lista) lista.push(evento);
    else eventosPorDia.set(clave, [evento]);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest">
      <div className="grid grid-cols-7 border-b border-outline-variant/40 bg-surface-container-low">
        {encabezados.map((dia) => (
          <div
            key={claveDia(dia)}
            className="px-2 py-2 text-center font-caption text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
          >
            {nombreDiaCorto(dia, locale)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6">
        {semanas.flat().map((dia) => {
          const clave = claveDia(dia);
          const delMes = diasDelMes.has(clave);
          const hoy = esHoy(dia);
          const delDia = eventosPorDia.get(clave) ?? [];
          const visibles = delDia.slice(0, MAXIMO_VISIBLES);
          const restantes = delDia.length - visibles.length;

          return (
            <div
              key={clave}
              className={`group relative min-h-[112px] border-b border-r border-outline-variant/25 p-1.5 transition last:border-r-0 ${
                delMes ? "bg-surface-container-lowest" : "bg-surface-container-low/60"
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => onAbrirDia(dia)}
                  aria-label={t("abrirDia", { dia: numeroDia(dia) })}
                  className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-label-md text-xs font-semibold transition ${
                    hoy
                      ? "bg-primary text-on-primary"
                      : delMes
                        ? "text-on-surface hover:bg-surface-container"
                        : "text-on-surface-variant/60 hover:bg-surface-container"
                  }`}
                >
                  {numeroDia(dia)}
                </button>

                {puedeGestionar && (
                  <button
                    type="button"
                    onClick={() => onCrear(dia)}
                    aria-label={t("crearEnDia", { dia: numeroDia(dia) })}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-on-surface-variant opacity-0 transition hover:bg-primary/10 hover:text-primary focus:opacity-100 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1">
                {visibles.map((evento) => {
                  const tono = tonoDe(evento.tipo);
                  return (
                    <button
                      key={evento.id}
                      type="button"
                      onClick={() => onAbrirEvento(evento)}
                      title={evento.titulo}
                      className={`flex w-full items-center gap-1 truncate rounded border px-1.5 py-0.5 text-left text-[11px] font-semibold transition hover:brightness-95 ${tono.chip}`}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tono.punto}`} />
                      <span className="truncate">{evento.titulo}</span>
                    </button>
                  );
                })}

                {restantes > 0 && (
                  <button
                    type="button"
                    onClick={() => onAbrirDia(dia)}
                    className="px-1.5 text-left text-[11px] font-semibold text-on-surface-variant transition hover:text-primary"
                  >
                    {t("masEventos", { cantidad: restantes })}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
