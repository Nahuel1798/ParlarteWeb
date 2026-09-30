"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  actualizarEvento,
  crearEvento,
  listarClases,
  type ClaseResponse,
  type CursoResponse,
  type EventoRequest,
  type EventoResponse,
} from "../../lib/api";
import { aInputDateTime, aIso, desdeInputDateTime } from "./dateUtils";
import { DURACIONES, TIPOS_EVENTO, tonoDe } from "./tonosEvento";

export default function EventoForm({
  evento,
  fechaInicial,
  cursos,
  permiteGeneral,
  onGuardar,
  onCancelar,
}: {
  evento: EventoResponse | null;
  fechaInicial: Date | null;
  cursos: CursoResponse[];
  permiteGeneral: boolean;
  onGuardar: () => void;
  onCancelar: () => void;
}) {
  const t = useTranslations("calendario");

  const [titulo, setTitulo] = useState(evento?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(evento?.descripcion ?? "");
  const [fecha, setFecha] = useState(
    aInputDateTime(evento ? new Date(evento.fecha) : fechaInicial ?? new Date())
  );
  const [duracion, setDuracion] = useState(evento?.duracionMinutos ?? 60);
  const [tipo, setTipo] = useState(evento?.tipo ?? "CLASE");
  const [cursoId, setCursoId] = useState<number | "">(
    evento?.cursoId ?? (permiteGeneral ? "" : cursos[0]?.id ?? "")
  );
  const [claseId, setClaseId] = useState<number | "">(evento?.claseId ?? "");

  const [datosClases, setDatosClases] = useState<{
    cursoId: number;
    clases: ClaseResponse[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cursoId === "") return;

    let active = true;
    listarClases(cursoId)
      .then((data) => {
        if (active) setDatosClases({ cursoId, clases: data });
      })
      .catch(() => {
        if (active) setDatosClases({ cursoId, clases: [] });
      });

    return () => {
      active = false;
    };
  }, [cursoId]);

  const clases = datosClases?.cursoId === cursoId ? datosClases.clases : [];

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fechaElegida = desdeInputDateTime(fecha);
    if (!titulo.trim()) {
      setError(t("errorTituloRequerido"));
      return;
    }
    if (!fechaElegida) {
      setError(t("errorFechaRequerida"));
      return;
    }

    const request: EventoRequest = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha: aIso(fechaElegida),
      duracionMinutos: duracion,
      tipo,
      cursoId: cursoId === "" ? null : cursoId,
      claseId: claseId === "" ? null : claseId,
    };

    setGuardando(true);
    try {
      if (evento) {
        await actualizarEvento(evento.id, request);
      } else {
        await crearEvento(request);
      }
      onGuardar();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGuardar"));
    } finally {
      setGuardando(false);
    }
  };

  const claseCambioDeCurso = () => setClaseId("");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-on-surface/40 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={evento ? t("editarEvento") : t("nuevoEvento")}
        className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-outline-variant/20 pb-4">
          <div>
            <span className="font-caption text-xs font-semibold uppercase tracking-widest text-secondary">
              {evento ? t("editarEvento") : t("nuevoEvento")}
            </span>
            <h2 className="font-headline-md text-xl font-semibold text-primary">
              {evento ? evento.titulo : t("nuevoEventoDetalle")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            aria-label={t("cerrar")}
            className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-secondary/10 px-4 py-3 text-sm text-secondary">
            {error}
          </div>
        )}

        <form onSubmit={guardar} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-on-surface-variant">
              {t("campoTitulo")}
            </span>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={100}
              className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface-variant">
                {t("campoTipo")}
              </span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
              >
                {TIPOS_EVENTO.map((valor) => (
                  <option key={valor} value={valor}>
                    {t(`tipo.${valor}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface-variant">
                {t("campoDuracion")}
              </span>
              <select
                value={duracion}
                onChange={(e) => setDuracion(Number(e.target.value))}
                className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
              >
                {DURACIONES.map((valor) => (
                  <option key={valor} value={valor}>
                    {t("minutos", { cantidad: valor })}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-on-surface-variant">
              {t("campoFecha")}
            </span>
            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface-variant">
                {t("campoCurso")}
              </span>
              <select
                value={cursoId}
                onChange={(e) => {
                  setCursoId(e.target.value === "" ? "" : Number(e.target.value));
                  claseCambioDeCurso();
                }}
                className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
              >
                {permiteGeneral && <option value="">{t("sinCurso")}</option>}
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
              {!permiteGeneral && (
                <span className="text-[11px] text-on-surface-variant">
                  {t("avisoCursoObligatorio")}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface-variant">
                {t("campoClase")}
              </span>
              <select
                value={claseId}
                onChange={(e) => setClaseId(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={cursoId === ""}
                className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary disabled:opacity-50"
              >
                <option value="">{t("sinClase")}</option>
                {clases.map((clase) => (
                  <option key={clase.id} value={clase.id}>
                    {clase.titulo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-on-surface-variant">
              {t("campoDescripcion")}
            </span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
              rows={3}
              className="resize-none rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface outline-none transition focus:border-primary"
            />
          </label>

          <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${tonoDe(tipo).chip}`}>
            <span className="material-symbols-outlined text-[16px]">
              {tonoDe(tipo).icono}
            </span>
            {t(`tipo.${tipo}`)}
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-lg bg-surface-container px-4 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-high"
            >
              {t("cancelar")}
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container disabled:opacity-60"
            >
              {guardando ? t("guardando") : t("guardar")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
