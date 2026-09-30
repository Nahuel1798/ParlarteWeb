"use client";

import { useTranslations } from "next-intl";
import type { EventoResponse } from "../../lib/api";
import {
  bloquesDeEventos,
  esHoy,
  etiquetaDiaCorto,
  formatearHora,
  nombreDiaCorto,
  type BloqueEvento,
} from "./dateUtils";
import { tonoDe } from "./tonosEvento";

const HORA_INICIO = 6;
const HORA_FIN = 23;
const PX_POR_HORA = 48;
const HORAS = Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => HORA_INICIO + i);

interface BloquePosicionado {
  bloque: BloqueEvento<EventoResponse>;
  columna: number;
  columnas: number;
  arriba: number;
  alto: number;
}

function posicionar(bloques: BloqueEvento<EventoResponse>[]): BloquePosicionado[] {
  const resultado: BloquePosicionado[] = [];
  let cluster: BloqueEvento<EventoResponse>[] = [];
  let finCluster = -1;

  const volcar = () => {
    if (cluster.length === 0) return;

    const columnas: BloqueEvento<EventoResponse>[][] = [];
    const asignadas = cluster.map((bloque) => {
      let indice = columnas.findIndex((columna) =>
        columna.every((otro) => otro.fin <= bloque.inicio)
      );
      if (indice === -1) {
        columnas.push([]);
        indice = columnas.length - 1;
      }
      columnas[indice].push(bloque);
      return { bloque, columna: indice };
    });

    for (const { bloque, columna } of asignadas) {
      const inicio = Math.max(bloque.inicio, HORA_INICIO * 60);
      const fin = Math.min(bloque.fin, HORA_FIN * 60);
      resultado.push({
        bloque,
        columna,
        columnas: columnas.length,
        arriba: ((inicio - HORA_INICIO * 60) / 60) * PX_POR_HORA,
        alto: Math.max(((fin - inicio) / 60) * PX_POR_HORA - 2, 20),
      });
    }

    cluster = [];
    finCluster = -1;
  };

  for (const bloque of bloques) {
    if (cluster.length > 0 && bloque.inicio >= finCluster) {
      volcar();
    }
    cluster.push(bloque);
    finCluster = Math.max(finCluster, bloque.fin);
  }
  volcar();

  return resultado;
}

export default function RejillaHoraria({
  dias,
  eventos,
  locale,
  onAbrirDia,
  onAbrirEvento,
  onCrear,
  puedeGestionar,
}: {
  dias: Date[];
  eventos: EventoResponse[];
  locale: string;
  onAbrirDia: (dia: Date) => void;
  onAbrirEvento: (evento: EventoResponse) => void;
  onCrear: (dia: Date, hora: number) => void;
  puedeGestionar: boolean;
}) {
  const t = useTranslations("calendario");
  const alto = HORAS.length * PX_POR_HORA;

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest">
      <div className="min-w-[720px]">
        <div className="flex border-b border-outline-variant/40 bg-surface-container-low">
          <div className="w-16 shrink-0" />
          {dias.map((dia) => (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => onAbrirDia(dia)}
              className={`flex-1 px-2 py-2 text-center transition hover:bg-surface-container ${
                esHoy(dia) ? "text-primary" : "text-on-surface"
              }`}
            >
              <span className="block font-caption text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                {nombreDiaCorto(dia, locale)}
              </span>
              <span
                className={`mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 font-label-md text-sm font-semibold ${
                  esHoy(dia) ? "bg-primary text-on-primary" : ""
                }`}
              >
                {etiquetaDiaCorto(dia, locale)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex">
          <div className="w-16 shrink-0 border-r border-outline-variant/30">
            {HORAS.map((hora) => (
              <div
                key={hora}
                className="relative text-right font-caption text-[11px] text-on-surface-variant"
                style={{ height: PX_POR_HORA }}
              >
                <span className="absolute right-2 -top-2 bg-surface-container-lowest px-1">
                  {String(hora).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {dias.map((dia) => {
            const posicionados = posicionar(
              bloquesDeEventos(eventos, dia)
            );

            return (
              <div
                key={dia.toISOString()}
                className="relative flex-1 border-r border-outline-variant/20 last:border-r-0"
                style={{ height: alto }}
              >
                {HORAS.map((hora) => (
                  <div
                    key={hora}
                    className="group relative border-b border-outline-variant/15"
                    style={{ height: PX_POR_HORA }}
                  >
                    {puedeGestionar && (
                      <button
                        type="button"
                        onClick={() => onCrear(dia, hora)}
                        aria-label={t("crearEnHora", { hora: `${String(hora).padStart(2, "0")}:00` })}
                        className="absolute inset-0 flex items-start justify-center pt-0.5 text-on-surface-variant/0 transition hover:bg-primary/5 hover:text-primary focus:text-primary"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    )}
                  </div>
                ))}

                {posicionados.map(({ bloque, columna, columnas, arriba, alto }) => {
                  const { evento } = bloque;
                  const tono = tonoDe(evento.tipo);
                  const margen = 2;

                  return (
                    <button
                      key={evento.id}
                      type="button"
                      onClick={() => onAbrirEvento(evento)}
                      title={`${evento.titulo} · ${formatearHora(evento.fecha, locale)}`}
                      className={`absolute overflow-hidden rounded-md border-l-4 px-1.5 py-1 text-left shadow-sm transition hover:brightness-95 ${tono.chip}`}
                      style={{
                        top: arriba + 1,
                        height: alto,
                        left: `calc(${(columna / columnas) * 100}% + ${margen}px)`,
                        width: `calc(${(1 / columnas) * 100}% - ${margen * 2}px)`,
                      }}
                    >
                      <span className="block truncate text-[11px] font-bold leading-tight">
                        {evento.titulo}
                      </span>
                      <span className="block truncate text-[10px] leading-tight opacity-80">
                        {formatearHora(evento.fecha, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
