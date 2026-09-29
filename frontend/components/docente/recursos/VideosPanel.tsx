"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  crearVideo,
  eliminarVideo,
  listarVideos,
  type VideoResponse,
} from "../../../lib/api";

export default function VideosPanel({
  cursoId,
  claseId,
}: {
  cursoId: number;
  claseId: number;
}) {
  const t = useTranslations("claseRecursos");

  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [duracion, setDuracion] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    listarVideos(cursoId, claseId)
      .then((data) => {
        if (active) setVideos(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("videosDefaultError")
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

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim() || !url.trim()) {
      setError(t("requiredFields"));
      return;
    }

    setSaving(true);

    try {
      const video = await crearVideo(cursoId, claseId, {
        titulo: titulo.trim(),
        url: url.trim(),
        duracionSegundos: duracion ? Number(duracion) : null,
      });
      setVideos((prev) => [...prev, video]);
      setTitulo("");
      setUrl("");
      setDuracion("");
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("videoCreateError"));
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (video: VideoResponse) => {
    if (!window.confirm(t("deleteConfirm", { title: video.titulo }))) return;

    setError(null);

    try {
      await eliminarVideo(cursoId, claseId, video.id);
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("defaultError"));
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-container-low p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">
            play_circle
          </span>

          <h5 className="font-label-md text-on-surface">{t("videos")}</h5>

          <span className="text-xs text-on-surface-variant">
            ({videos.length})
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen((prev) => !prev)}
          className="flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
        >
          <span className="material-symbols-outlined text-[14px]">
            {formOpen ? "close" : "add"}
          </span>

          {formOpen ? t("cancel") : t("videosAdd")}
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
      ) : videos.length === 0 && !formOpen ? (
        <div className="py-3 text-center text-xs text-on-surface-variant">
          {t("videosEmpty")}
        </div>
      ) : null}

      {videos.length > 0 && (
        <div className="flex flex-col gap-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between gap-3 rounded bg-surface-container-lowest px-3 py-2"
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-on-surface">
                  {video.titulo}
                </span>

                <span className="flex items-center gap-2 text-xs text-on-surface-variant">
                  {video.duracionSegundos
                    ? t("videoSeconds", { count: video.duracionSegundos })
                    : null}

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-primary hover:underline"
                  >
                    {video.url}
                  </a>
                </span>
              </div>

              <button
                type="button"
                onClick={() => borrar(video)}
                aria-label={t("deleteAria", { title: video.titulo })}
                className="shrink-0 rounded p-1.5 text-on-surface-variant transition hover:bg-error-container hover:text-on-error-container"
              >
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <form onSubmit={guardar} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("videoTituloLabel")}
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={t("videoTituloPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("videoUrlLabel")}
            </label>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("videoUrlPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("videoDuracionLabel")}
            </label>

            <input
              type="number"
              min={0}
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              placeholder="90"
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

            {t("videoSave")}
          </button>
        </form>
      )}
    </div>
  );
}