"use client";

import { useTranslations } from "next-intl";
import type { EventoResponse } from "../../lib/api";
import { claveDia, etiquetaDiaLargo, formatearHora } from "./dateUtils";
import { tonoDe } from "./tonosEvento";

export default function ListaEventos({
  eventos,
  locale,
  onAbrirEvento,
}: {
  eventos: EventoResponse[];
  locale: string;
  onAbrirEvento: (evento: EventoResponse) => void;
}) {
  const t = useTranslations("calendario");

  if (eventos.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-on-surface-variant">
        {t("sinEventos")}
      </div>
    );
  }

  const grupos = new Map<string, EventoResponse[]>();
  for (const evento of eventos) {
    const clave = claveDia(new Date(evento.fecha));
    const lista = grupos.get(clave);
    if (lista) lista.push(evento);
    else grupos.set(clave, [evento]);
  }

  return (
    <div className="flex flex-col gap-5">
      {[...grupos.entries()].map(([clave, delDia]) => (
        <div key={clave} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-caption text-xs font-semibold uppercase tracking-widest text-secondary">
              {etiquetaDiaLargo(new Date(delDia[0].fecha), locale)}
            </span>
            <span className="h-px flex-1 bg-outline-variant/30" />
          </div>

          {delDia.map((evento) => {
            const tono = tonoDe(evento.tipo);
            return (
              <button
                key={evento.id}
                type="button"
                onClick={() => onAbrirEvento(evento)}
                className="flex items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-3 py-2 text-left transition hover:border-primary/40 hover:bg-surface-container-low"
              >
                <span className={`h-9 w-1.5 shrink-0 rounded-full ${tono.barra}`} />

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-on-surface">
                    {evento.titulo}
                  </span>
                  <span className="truncate text-xs text-on-surface-variant">
                    {evento.cursoNombre ?? t("eventoGeneral")}
                    {evento.claseTitulo ? ` · ${evento.claseTitulo}` : ""}
                  </span>
                </span>

                <span className="shrink-0 text-right">
                  <span className="block text-xs font-semibold text-on-surface">
                    {formatearHora(evento.fecha, locale)}
                  </span>
                  <span className="block text-[11px] text-on-surface-variant">
                    {t("minutos", { cantidad: evento.duracionMinutos })}
                  </span>
                </span>

                <span className={`hidden shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline ${tono.chip}`}>
                  {t(`tipo.${evento.tipo}`)}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
