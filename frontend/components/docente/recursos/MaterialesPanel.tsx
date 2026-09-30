"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  actualizarMaterial,
  crearMaterial,
  eliminarMaterial,
  listarMateriales,
  subirRecurso,
  type MaterialResponse,
} from "../../../lib/api";

export default function MaterialesPanel({
  cursoId,
  claseId,
}: {
  cursoId: number;
  claseId: number;
}) {
  const t = useTranslations("claseRecursos");

  const [materiales, setMateriales] = useState<MaterialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [url, setUrl] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputArchivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    listarMateriales(cursoId, claseId)
      .then((data) => {
        if (active) setMateriales(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("materialesDefaultError")
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

  const subirArchivo = async (file: File) => {
    setSubiendo(true);
    setError(null);

    try {
      const urlSubida = await subirRecurso(file);
      setUrl(urlSubida);
      if (!titulo.trim()) {
        setTitulo(file.name.replace(/\.[^.]+$/, ""));
      }
      if (!tipo.trim()) {
        const ext = file.name.split(".").pop()?.toUpperCase() ?? "";
        setTipo(ext || "ARCHIVO");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadError"));
    } finally {
      setSubiendo(false);
      if (inputArchivo.current) {
        inputArchivo.current.value = "";
      }
    }
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setTipo("");
    setUrl("");
    setEditandoId(null);
    setFormOpen(false);
  };

  const abrirNuevo = () => {
    setTitulo("");
    setTipo("");
    setUrl("");
    setEditandoId(null);
    setFormOpen(true);
  };

  const abrirEdicion = (material: MaterialResponse) => {
    setTitulo(material.titulo);
    setTipo(material.tipo);
    setUrl(material.url);
    setEditandoId(material.id);
    setFormOpen(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !url.trim()) {
      setError(t("requiredFields"));
      return;
    }

    const request = {
      titulo: titulo.trim(),
      tipo: tipo.trim() || "ARCHIVO",
      url: url.trim(),
    };

    setSaving(true);

    try {
      if (editandoId === null) {
        const material = await crearMaterial(cursoId, claseId, request);
        setMateriales((prev) => [...prev, material]);
      } else {
        const material = await actualizarMaterial(cursoId, claseId, editandoId, request);
        setMateriales((prev) => prev.map((m) => (m.id === editandoId ? material : m)));
      }

      limpiarFormulario();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("materialSaveError"));
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (material: MaterialResponse) => {
    if (!window.confirm(t("deleteConfirm", { title: material.titulo }))) return;

    setError(null);

    try {
      await eliminarMaterial(cursoId, claseId, material.id);
      setMateriales((prev) => prev.filter((m) => m.id !== material.id));

      if (editandoId === material.id) {
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
            folder_open
          </span>

          <h5 className="font-label-md text-on-surface">{t("materiales")}</h5>

          <span className="text-xs text-on-surface-variant">
            ({materiales.length})
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

          {formOpen ? t("cancel") : t("materialesAdd")}
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
      ) : materiales.length === 0 && !formOpen ? (
        <div className="py-3 text-center text-xs text-on-surface-variant">
          {t("materialesEmpty")}
        </div>
      ) : null}

      {materiales.length > 0 && (
        <div className="flex flex-col gap-2">
          {materiales.map((material) => (
            <div
              key={material.id}
              className="flex items-center justify-between gap-3 rounded bg-surface-container-lowest px-3 py-2"
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-on-surface">
                  {material.titulo}
                </span>

                <span className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="rounded bg-tertiary-fixed px-1.5 py-0.5 text-[10px] font-semibold uppercase text-on-tertiary-fixed">
                    {material.tipo}
                  </span>

                  <a
                    href={material.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    {material.url}
                  </a>
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => abrirEdicion(material)}
                  aria-label={t("editAria", { title: material.titulo })}
                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-primary/10 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => borrar(material)}
                  aria-label={t("deleteAria", { title: material.titulo })}
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
              {editandoId === null ? t("materialesAdd") : t("materialEdit")}
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
              {t("materialTituloLabel")}
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={t("materialTituloPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("materialTipoLabel")}
            </label>

            <input
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder={t("materialTipoPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("materialArchivoLabel")}
            </label>

            <input
              ref={inputArchivo}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void subirArchivo(file);
              }}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary file:mr-2 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("materialUrlLabel")}
            </label>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("materialUrlPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {subiendo && (
            <span className="text-xs text-on-surface-variant">
              {t("uploading")}…
            </span>
          )}

          <button
            type="submit"
            disabled={saving || subiendo}
            className="flex items-center justify-center gap-1 rounded bg-primary px-3 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-on-primary/20 border-t-on-primary" />
            ) : (
              <span className="material-symbols-outlined text-[14px]">save</span>
            )}

            {t("materialSave")}
          </button>
        </form>
      )}
    </div>
  );
}