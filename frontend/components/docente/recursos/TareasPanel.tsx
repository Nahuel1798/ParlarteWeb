"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  actualizarTarea,
  crearTarea,
  eliminarTarea,
  listarTareas,
  type TareaResponse,
} from "../../../lib/api";

export default function TareasPanel({
  cursoId,
  claseId,
}: {
  cursoId: number;
  claseId: number;
}) {
  const t = useTranslations("claseRecursos");

  const [tareas, setTareas] = useState<TareaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    listarTareas(cursoId, claseId)
      .then((data) => {
        if (active) setTareas(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("tareasDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cursoId, claseId, t]);

  const limpiarFormulario = () => {
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setEditandoId(null);
    setFormOpen(false);
  };

  const abrirNuevo = () => {
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setEditandoId(null);
    setFormOpen(true);
  };

  const abrirEdicion = (tarea: TareaResponse) => {
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setFecha(tarea.fechaEntrega.slice(0, 16));
    setEditandoId(tarea.id);
    setFormOpen(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !descripcion.trim() || !fecha) {
      setError(t("requiredFields"));
      return;
    }

    const request = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fechaEntrega: `${fecha}:00`,
    };

    setSaving(true);

    try {
      if (editandoId === null) {
        const tarea = await crearTarea(cursoId, claseId, request);
        setTareas((prev) => [...prev, tarea]);
      } else {
        const tarea = await actualizarTarea(cursoId, claseId, editandoId, request);
        setTareas((prev) => prev.map((ta) => (ta.id === editandoId ? tarea : ta)));
      }

      limpiarFormulario();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("tareaSaveError"));
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (tarea: TareaResponse) => {
    if (!window.confirm(t("deleteConfirm", { title: tarea.titulo }))) return;

    setError(null);

    try {
      await eliminarTarea(cursoId, claseId, tarea.id);
      setTareas((prev) => prev.filter((ta) => ta.id !== tarea.id));

      if (editandoId === tarea.id) {
        limpiarFormulario();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("defaultError"));
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-container-low p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">
            assignment
          </span>

          <h5 className="font-label-md text-on-surface">{t("tareas")}</h5>

          <span className="text-xs text-on-surface-variant">
            ({tareas.length})
          </span>
        </div>

        <button
          type="button"
          onClick={() => (formOpen && editandoId === null ? setFormOpen(false) : abrirNuevo())}
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
        >
          <span className="material-symbols-outlined text-[14px]">
            {formOpen ? "close" : "add"}
          </span>

          {formOpen ? t("cancel") : t("tareasAdd")}
        </button>
      </div>

      {error && (
        <div className="rounded bg-error-container px-3 py-2 text-xs font-medium text-on-error-container">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-3 text-center text-xs text-on-surface-variant">
          {t("loading")}
        </div>
      ) : tareas.length === 0 && !formOpen ? (
        <div className="py-3 text-center text-xs text-on-surface-variant">
          {t("tareasEmpty")}
        </div>
      ) : null}

      {tareas.length > 0 && (
        <div className="flex flex-col gap-2">
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="flex items-center justify-between gap-3 rounded bg-surface-container-lowest px-3 py-2"
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-on-surface">
                  {tarea.titulo}
                </span>

                <span className="block truncate text-xs text-on-surface-variant">
                  {tarea.descripcion}
                </span>

                <span className="text-[11px] text-on-surface-variant">
                  {t("tareaEntrega", {
                    date: new Date(tarea.fechaEntrega).toLocaleString(),
                  })}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => abrirEdicion(tarea)}
                  aria-label={t("editAria", { title: tarea.titulo })}
                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-primary/10 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => borrar(tarea)}
                  aria-label={t("deleteAria", { title: tarea.titulo })}
                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-error-container hover:text-on-error-container"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={guardar}
          className="flex flex-col gap-3 border-t border-outline-variant/20 pt-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
              {editandoId === null ? t("tareasAdd") : t("tareaEdit")}
            </span>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant transition hover:text-primary"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>

              {t("cancel")}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("tareaTituloLabel")}
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={t("tareaTituloPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("tareaDescripcionLabel")}
            </label>

            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder={t("tareaDescripcionPlaceholder")}
              className="resize-none rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("tareaFechaLable")}
            </label>

            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-1 rounded bg-primary px-3 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-on-primary/20 border-t-on-primary" />
            ) : (
              <span className="material-symbols-outlined text-[14px]">save</span>
            )}

            {t("tareaSave")}
          </button>
        </form>
      )}
    </div>
  );
}