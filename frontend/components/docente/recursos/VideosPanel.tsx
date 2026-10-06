"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  actualizarVideo,
  crearVideo,
  eliminarVideo,
  listarVideos,
  subirVideo,
  type VideoResponse,
} from "../../../lib/api";
import {
  MAX_SIZE_VIDEO_BYTES,
  esArchivoMp4,
  esUrlVideoDirecto,
  normalizarDuracion,
  obtenerDuracionArchivo,
  obtenerDuracionUrl,
} from "../../../lib/video";

type ModoFuente = "archivo" | "url";

const MODOS: ModoFuente[] = ["archivo", "url"];

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
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [modo, setModo] = useState<ModoFuente>("archivo");
  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [duracion, setDuracion] = useState("");
  const [duracionAuto, setDuracionAuto] = useState(false);
  const [leyendoDuracion, setLeyendoDuracion] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputArchivo = useRef<HTMLInputElement>(null);
  const timerDuracion = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duracionEditada = useRef(false);

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
      if (timerDuracion.current) clearTimeout(timerDuracion.current);
    };
  }, [cursoId, claseId, t]);

  /**
   * Rellena la duración solo si el docente no la escribió a mano. Así una
   * detección posterior refresca el valor, pero nunca pisa una carga manual.
   */
  const aplicarDuracionAuto = (segundos: number) => {
    if (duracionEditada.current) return;

    setDuracion(String(segundos));
    setDuracionAuto(true);
  };

  /**
   * Al escribir una URL se intenta leer su duración. Con una URL externa el
   * navegador la bloquea casi siempre, así que el resultado es opcional.
   */
  const programarLecturaDuracion = (valor: string) => {
    if (timerDuracion.current) clearTimeout(timerDuracion.current);

    const limpio = valor.trim();

    if (limpio === "" || !esUrlVideoDirecto(limpio)) {
      setLeyendoDuracion(false);
      return;
    }

    setLeyendoDuracion(true);

    timerDuracion.current = setTimeout(async () => {
      const segundos = await obtenerDuracionUrl(limpio);

      setLeyendoDuracion(false);

      if (segundos !== null) aplicarDuracionAuto(segundos);
    }, 700);
  };

  const subirArchivo = async (file: File) => {
    setError(null);

    if (!esArchivoMp4(file)) {
      setError(t("videoTipoError"));
      return;
    }

    if (file.size > MAX_SIZE_VIDEO_BYTES) {
      setError(t("videoTamanoError"));
      return;
    }

    setSubiendo(true);
    setLeyendoDuracion(true);

    try {
      // Se lee del archivo local: funciona siempre, sin depender de CORS.
      const segundos = await obtenerDuracionArchivo(file);
      const urlSubida = await subirVideo(file);

      setUrl(urlSubida);

      if (!titulo.trim()) {
        setTitulo(file.name.replace(/\.[^.]+$/, ""));
      }

      // El archivo nuevo deja obsoleta la duración anterior, se haya escrito
      // a mano o venga de la base.
      duracionEditada.current = false;

      if (segundos !== null) aplicarDuracionAuto(segundos);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadError"));
    } finally {
      setSubiendo(false);
      setLeyendoDuracion(false);

      if (inputArchivo.current) {
        inputArchivo.current.value = "";
      }
    }
  };

  const limpiarFormulario = () => {
    if (timerDuracion.current) clearTimeout(timerDuracion.current);

    duracionEditada.current = false;

    setTitulo("");
    setUrl("");
    setDuracion("");
    setDuracionAuto(false);
    setLeyendoDuracion(false);
    setModo("archivo");
    setEditandoId(null);
    setFormOpen(false);
  };

  const abrirNuevo = () => {
    if (timerDuracion.current) clearTimeout(timerDuracion.current);

    duracionEditada.current = false;

    setTitulo("");
    setUrl("");
    setDuracion("");
    setDuracionAuto(false);
    setLeyendoDuracion(false);
    setModo("archivo");
    setEditandoId(null);
    setFormOpen(true);
  };

  const abrirEdicion = (video: VideoResponse) => {
    if (timerDuracion.current) clearTimeout(timerDuracion.current);

    // La duración guardada viene de la base, no de una detección en vivo.
    duracionEditada.current = true;

    setTitulo(video.titulo);
    setUrl(video.url);
    setDuracion(
      video.duracionSegundos === null ? "" : String(video.duracionSegundos)
    );
    setDuracionAuto(false);
    setLeyendoDuracion(false);
    // Al editar la URL ya está guardada: no se vuelve a leer sola.
    setModo(esUrlVideoDirecto(video.url) ? "archivo" : "url");
    setEditandoId(video.id);
    setFormOpen(true);
  };

  const cambiarModo = (valor: ModoFuente) => {
    if (timerDuracion.current) clearTimeout(timerDuracion.current);

    setModo(valor);
    setLeyendoDuracion(false);
    setError(null);

    // El archivo subido ya dejó una URL puesta: al cambiar de pestaña se
    // limpia para no confundir el origen del video.
    if (valor === "archivo" && url !== "") {
      setUrl("");
    }
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
      url: url.trim(),
      duracionSegundos: normalizarDuracion(duracion),
    };

    setSaving(true);

    try {
      if (editandoId === null) {
        const video = await crearVideo(cursoId, claseId, request);
        setVideos((prev) => [...prev, video]);
      } else {
        const video = await actualizarVideo(cursoId, claseId, editandoId, request);
        setVideos((prev) => prev.map((v) => (v.id === editandoId ? video : v)));
      }

      limpiarFormulario();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("videoSaveError"));
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

      if (editandoId === video.id) {
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
            play_circle
          </span>

          <h5 className="font-label-md text-on-surface">{t("videos")}</h5>

          <span className="text-xs text-on-surface-variant">
            ({videos.length})
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
                  {video.duracionSegundos ? (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">
                        schedule
                      </span>

                      {t("videoSeconds", { count: video.duracionSegundos })}
                    </span>
                  ) : null}

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

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => abrirEdicion(video)}
                  aria-label={t("editAria", { title: video.titulo })}
                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-primary/10 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => borrar(video)}
                  aria-label={t("deleteAria", { title: video.titulo })}
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
              {editandoId === null ? t("videosAdd") : t("videoEdit")}
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
              {t("videoTituloLabel")}
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={t("videoTituloPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {editandoId === null && (
            <div className="flex flex-col gap-1">
              <div
                role="tablist"
                aria-label={t("videoFuenteLabel")}
                className="flex rounded bg-surface-container-highest p-0.5"
              >
                {MODOS.map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    role="tab"
                    aria-selected={modo === valor}
                    onClick={() => cambiarModo(valor)}
                    className={`flex-1 rounded px-2 py-1 text-[11px] font-semibold transition ${
                      modo === valor
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {valor === "archivo" ? t("videoModoArchivo") : t("videoModoUrl")}
                  </button>
                ))}
              </div>

              {modo === "archivo" ? (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    {t("videoArchivoLabel")}
                  </label>

                  <input
                    ref={inputArchivo}
                    type="file"
                    accept="video/mp4,.mp4"
                    disabled={subiendo}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void subirArchivo(file);
                    }}
                    className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary file:mr-2 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white"
                  />

                  <span className="text-[11px] leading-relaxed text-on-surface-variant">
                    {t("videoArchivoHint")}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    {t("videoUrlLabel")}
                  </label>

                  <input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      programarLecturaDuracion(e.target.value);
                    }}
                    placeholder={t("videoUrlPlaceholder")}
                    className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />

                  <span className="text-[11px] leading-relaxed text-on-surface-variant">
                    {t("videoUrlHint")}
                  </span>
                </div>
              )}
            </div>
          )}

          {editandoId !== null && (
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

              <label className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                {t("videoReemplazarLabel")}
              </label>

              <input
                ref={inputArchivo}
                type="file"
                accept="video/mp4,.mp4"
                disabled={subiendo}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void subirArchivo(file);
                }}
                className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary file:mr-2 file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-semibold file:text-white"
              />
            </div>
          )}

          {subiendo && (
            <span className="text-xs text-on-surface-variant">
              {t("uploading")}…
            </span>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                {t("videoDuracionLabel")}
              </label>

              {duracionAuto ? (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {t("videoDuracionAuto")}
                </span>
              ) : null}
            </div>

            <input
              type="number"
              min={0}
              value={duracion}
              disabled={leyendoDuracion}
              onChange={(e) => {
                setDuracion(e.target.value);
                setDuracionAuto(false);
                duracionEditada.current = true;
              }}
              placeholder="90"
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />

            <span className="text-[11px] leading-relaxed text-on-surface-variant">
              {leyendoDuracion ? t("videoDuracionLeyendo") : t("videoDuracionHint")}
            </span>
          </div>

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

            {t("videoSave")}
          </button>
        </form>
      )}
    </div>
  );
}