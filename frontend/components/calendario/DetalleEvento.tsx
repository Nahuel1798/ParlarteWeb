"use client";

import { useTranslations } from "next-intl";
import type { EventoResponse } from "../../lib/api";
import { etiquetaDiaLargo, formatearHora } from "./dateUtils";
import { tonoDe } from "./tonosEvento";

export default function DetalleEvento({
  evento,
  locale,
  puedeGestionar,
  onEditar,
  onEliminar,
  onCerrar,
}: {
  evento: EventoResponse;
  locale: string;
  puedeGestionar: boolean;
  onEditar: () => void;
  onEliminar: () => void;
  onCerrar: () => void;
}) {
  const t = useTranslations("calendario");
  const tono = tonoDe(evento.tipo);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-on-surface/40 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={evento.titulo}
        className="w-full max-w-md overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl"
      >
        <div className={`flex items-start justify-between gap-4 px-6 pb-4 pt-6 ${tono.chip}`}>
          <div className="flex min-w-0 items-start gap-3">
            <span className="material-symbols-outlined mt-0.5 text-[22px]">
              {tono.icono}
            </span>
            <div className="min-w-0">
              <span className="font-caption text-[11px] font-semibold uppercase tracking-widest">
                {t(`tipo.${evento.tipo}`)}
              </span>
              <h2 className="font-headline-md text-xl font-semibold leading-snug">
                {evento.titulo}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label={t("cerrar")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-on-surface/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-primary">
              schedule
            </span>
            <div>
              <span className="block text-sm font-semibold text-on-surface">
                {etiquetaDiaLargo(new Date(evento.fecha), locale)}
              </span>
              <span className="block text-sm text-on-surface-variant">
                {formatearHora(evento.fecha, locale)} ·{" "}
                {t("minutos", { cantidad: evento.duracionMinutos })}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-primary">
              menu_book
            </span>
            <div>
              <span className="block text-sm font-semibold text-on-surface">
                {evento.cursoNombre ?? t("eventoGeneral")}
              </span>
              {evento.claseTitulo && (
                <span className="block text-sm text-on-surface-variant">
                  {evento.claseTitulo}
                </span>
              )}
            </div>
          </div>

          {evento.descripcion && (
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-primary">
                notes
              </span>
              <p className="whitespace-pre-line text-sm text-on-surface-variant">
                {evento.descripcion}
              </p>
            </div>
          )}
        </div>

        {puedeGestionar && (
          <div className="flex justify-end gap-3 border-t border-outline-variant/20 px-6 py-4">
            <button
              type="button"
              onClick={onEliminar}
              className="flex items-center gap-1 rounded-lg bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary transition hover:bg-secondary/20"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              {t("eliminar")}
            </button>
            <button
              type="button"
              onClick={onEditar}
              className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              {t("editar")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
