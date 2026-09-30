"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  listarMateriales,
  listarTareas,
  listarTests,
  listarVideos,
  type MaterialResponse,
  type TareaResponse,
  type TestResponse,
  type VideoResponse,
} from "../../lib/api";
import type { ReactNode } from "react";

function iconForTipo(tipo: string) {
  const normalizado = tipo.toLowerCase();

  if (normalizado.includes("pdf") || normalizado.includes("doc")) return "picture_as_pdf";
  if (normalizado.includes("audio")) return "audio_file";
  if (normalizado.includes("video")) return "movie";
  if (normalizado.includes("img") || normalizado.includes("foto")) return "image";
  if (normalizado.includes("link")) return "link";

  return "description";
}

function formatDuracion(segundos: number) {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;

  return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

function Grupo({
  icon,
  titulo,
  total,
  vacio,
  children,
}: {
  icon: string;
  titulo: string;
  total: number;
  vacio: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg bg-surface-container-low p-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-primary">
          {icon}
        </span>

        <h6 className="font-label-md text-on-surface">{titulo}</h6>

        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
          {total}
        </span>
      </div>

      {total === 0 ? (
        <p className="mt-3 text-xs text-on-surface-variant">{vacio}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">{children}</div>
      )}
    </section>
  );
}

export default function ClaseMaterial({
  cursoId,
  claseId,
}: {
  cursoId: number;
  claseId: number;
}) {
  const t = useTranslations("claseRecursos");

  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [materiales, setMateriales] = useState<MaterialResponse[]>([]);
  const [tareas, setTareas] = useState<TareaResponse[]>([]);
  const [tests, setTests] = useState<TestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      listarVideos(cursoId, claseId),
      listarMateriales(cursoId, claseId),
      listarTareas(cursoId, claseId),
      listarTests(cursoId, claseId),
    ])
      .then(([videosData, materialesData, tareasData, testsData]) => {
        if (!active) return;

        setVideos(videosData);
        setMateriales(materialesData);
        setTareas(tareasData);
        setTests(testsData);
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

  if (loading) {
    return (
      <div className="rounded-lg bg-surface-container-low p-4 text-center text-xs text-on-surface-variant">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-error-container px-4 py-3 text-xs font-medium text-on-error-container">
        {error}
      </div>
    );
  }

  const sinNada =
    videos.length === 0 &&
    materiales.length === 0 &&
    tareas.length === 0 &&
    tests.length === 0;

  if (sinNada) {
    return (
      <div className="rounded-lg bg-surface-container-low px-4 py-8 text-center">
        <span className="material-symbols-outlined text-[32px] text-outline-variant">
          inventory_2
        </span>

        <p className="mt-2 text-xs text-on-surface-variant">
          {t("materialesEmpty")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {videos.length > 0 && (
        <Grupo
          icon="play_circle"
          titulo={t("videos")}
          total={videos.length}
          vacio={t("videosEmpty")}
        >
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded bg-surface-container-lowest px-3 py-2 transition hover:bg-surface-bright"
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-on-surface">
                  {video.titulo}
                </span>

                <span className="block truncate text-xs text-on-surface-variant">
                  {video.url}
                </span>
              </div>

              <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>

                {formatDuracion(video.duracionSegundos ?? 0)}
              </span>
            </a>
          ))}
        </Grupo>
      )}

      {materiales.length > 0 && (
        <Grupo
          icon="folder_open"
          titulo={t("materiales")}
          total={materiales.length}
          vacio={t("materialesEmpty")}
        >
          {materiales.map((material) => (
            <a
              key={material.id}
              href={material.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded bg-surface-container-lowest px-3 py-2 transition hover:bg-surface-bright"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="material-symbols-outlined shrink-0 text-[18px] text-tertiary">
                  {iconForTipo(material.tipo)}
                </span>

                <div className="min-w-0">
                  <span className="block truncate text-sm font-medium text-on-surface">
                    {material.titulo}
                  </span>

                  <span className="block truncate text-xs text-on-surface-variant">
                    {material.url}
                  </span>
                </div>
              </div>

              <span className="shrink-0 rounded bg-tertiary-fixed px-1.5 py-0.5 text-[10px] font-semibold uppercase text-on-tertiary-fixed">
                {material.tipo}
              </span>
            </a>
          ))}
        </Grupo>
      )}

      {tareas.length > 0 && (
        <Grupo
          icon="assignment"
          titulo={t("tareas")}
          total={tareas.length}
          vacio={t("tareasEmpty")}
        >
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="rounded bg-surface-container-lowest px-3 py-2"
            >
              <span className="block text-sm font-medium text-on-surface">
                {tarea.titulo}
              </span>

              <span className="mt-0.5 block text-xs leading-relaxed text-on-surface-variant">
                {tarea.descripcion}
              </span>

              <span className="mt-1.5 flex w-max items-center gap-1 rounded-full bg-tertiary/10 px-2 py-0.5 text-[11px] font-semibold text-tertiary">
                <span className="material-symbols-outlined text-[14px]">
                  event
                </span>

                {t("tareaEntrega", {
                  date: new Date(tarea.fechaEntrega).toLocaleString(),
                })}
              </span>
            </div>
          ))}
        </Grupo>
      )}

      {tests.length > 0 && (
        <Grupo
          icon="quiz"
          titulo={t("tests")}
          total={tests.length}
          vacio={t("testsEmpty")}
        >
          {tests.map((test) => (
            <div
              key={test.id}
              className="rounded bg-surface-container-lowest px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-on-surface">
                  {test.titulo}
                </span>

                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {t("testAprobacion", {
                    porcentaje: test.porcentajeAprobacion,
                  })}
                </span>
              </div>

              {test.preguntas.length === 0 ? (
                <span className="mt-1 block text-xs text-on-surface-variant">
                  {t("testSinPreguntas")}
                </span>
              ) : (
                <ol className="mt-2 flex flex-col gap-2">
                  {test.preguntas.map((pregunta, index) => (
                    <li
                      key={pregunta.id}
                      className="rounded bg-surface-container-low px-3 py-2"
                    >
                      <span className="block text-xs font-semibold text-on-surface">
                        {t("questionNumber", { num: index + 1 })}.{" "}
                        {pregunta.enunciado}
                      </span>

                      <ul className="mt-1.5 flex flex-col gap-1">
                        {pregunta.respuestas.map((respuesta) => (
                          <li
                            key={respuesta.id}
                            className="flex items-start gap-1.5 text-[11px] text-on-surface-variant"
                          >
                            <span className="material-symbols-outlined mt-px text-[14px] text-outline">
                              radio_button_unchecked
                            </span>

                            {respuesta.texto}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </Grupo>
      )}
    </div>
  );
}
