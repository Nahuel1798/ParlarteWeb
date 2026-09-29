"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  crearTest,
  eliminarTest,
  listarTests,
  type TestResponse,
} from "../../../lib/api";

interface RespuestaDraft {
  texto: string;
  correcta: boolean;
}

interface PreguntaDraft {
  enunciado: string;
  respuestas: RespuestaDraft[];
}

function preguntaVacia(): PreguntaDraft {
  return {
    enunciado: "",
    respuestas: [
      { texto: "", correcta: true },
      { texto: "", correcta: false },
    ],
  };
}

export default function TestsPanel({
  cursoId,
  claseId,
}: {
  cursoId: number;
  claseId: number;
}) {
  const t = useTranslations("claseRecursos");

  const [tests, setTests] = useState<TestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [porcentaje, setPorcentaje] = useState("");
  const [preguntas, setPreguntas] = useState<PreguntaDraft[]>(() => [
    preguntaVacia(),
  ]);
  const [saving, setSaving] = useState(false);
  const [testsExpandidos, setTestsExpandidos] = useState<Set<number>>(
    () => new Set()
  );

  const toggleTest = (testId: number) => {
    setTestsExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) {
        next.delete(testId);
      } else {
        next.add(testId);
      }
      return next;
    });
  };

  useEffect(() => {
    let active = true;

    listarTests(cursoId, claseId)
      .then((data) => {
        if (active) setTests(data);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : t("testsDefaultError"));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cursoId, claseId, t]);

  const actualizarPregunta = (index: number, enunciado: string) => {
    setPreguntas((prev) =>
      prev.map((p, i) => (i === index ? { ...p, enunciado } : p))
    );
  };

  const agregarPregunta = () => {
    setPreguntas((prev) => [...prev, preguntaVacia()]);
  };

  const eliminarPregunta = (index: number) => {
    setPreguntas((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarRespuesta = (
    preguntaIndex: number,
    respuestaIndex: number,
    texto: string
  ) => {
    setPreguntas((prev) =>
      prev.map((p, pi) =>
        pi === preguntaIndex
          ? {
              ...p,
              respuestas: p.respuestas.map((r, ri) =>
                ri === respuestaIndex ? { ...r, texto } : r
              ),
            }
          : p
      )
    );
  };

  const marcarCorrecta = (
    preguntaIndex: number,
    respuestaIndex: number
  ) => {
    setPreguntas((prev) =>
      prev.map((p, pi) =>
        pi === preguntaIndex
          ? {
              ...p,
              respuestas: p.respuestas.map((r, ri) => ({
                ...r,
                correcta: ri === respuestaIndex ? !r.correcta : false,
              })),
            }
          : p
      )
    );
  };

  const agregarRespuesta = (preguntaIndex: number) => {
    setPreguntas((prev) =>
      prev.map((p, pi) =>
        pi === preguntaIndex
          ? { ...p, respuestas: [...p.respuestas, { texto: "", correcta: false }] }
          : p
      )
    );
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim()) {
      setError(t("testTituloRequired"));
      return;
    }

    const preguntasValidas = preguntas
      .map((p) => ({
        ...p,
        respuestas: p.respuestas.filter((r) => r.texto.trim()),
      }))
      .filter((p) => p.enunciado.trim() && p.respuestas.length > 0);

    if (preguntasValidas.length === 0) {
      setError(t("testPreguntasRequired"));
      return;
    }

    setSaving(true);

    try {
      const test = await crearTest(cursoId, claseId, {
        titulo: titulo.trim(),
        porcentajeAprobacion: porcentaje.trim() || "60",
        preguntas: preguntasValidas.map((p) => ({
          enunciado: p.enunciado.trim(),
          respuestas: p.respuestas.map((r) => ({
            texto: r.texto.trim(),
            correcta: r.correcta,
          })),
        })),
      });
      setTests((prev) => [...prev, test]);
      setTitulo("");
      setPorcentaje("");
      setPreguntas([preguntaVacia()]);
      setFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("testCreateError"));
    } finally {
      setSaving(false);
    }
  };

  const borrar = async (test: TestResponse) => {
    if (!window.confirm(t("deleteConfirm", { title: test.titulo }))) return;

    setError(null);

    try {
      await eliminarTest(cursoId, claseId, test.id);
      setTests((prev) => prev.filter((te) => te.id !== test.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("defaultError"));
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-container-low p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">
            quiz
          </span>

          <h5 className="font-label-md text-on-surface">{t("tests")}</h5>

          <span className="text-xs text-on-surface-variant">
            ({tests.length})
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

          {formOpen ? t("cancel") : t("testsAdd")}
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
      ) : tests.length === 0 && !formOpen ? (
        <div className="py-3 text-center text-xs text-on-surface-variant">
          {t("testsEmpty")}
        </div>
      ) : null}

      {tests.length > 0 && (
        <div className="flex flex-col gap-2">
          {tests.map((test) => (
            <div
              key={test.id}
              className="rounded bg-surface-container-lowest px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleTest(test.id)}
                  aria-expanded={testsExpandidos.has(test.id)}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium text-on-surface">
                      {test.titulo}
                    </span>

                    <span className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="rounded bg-tertiary-fixed px-1.5 py-0.5 text-[10px] font-semibold uppercase text-on-tertiary-fixed">
                        {t("testAprobacion", {
                          porcentaje: test.porcentajeAprobacion,
                        })}
                      </span>

                      <span>
                        {t("testPreguntasCount", {
                          count: test.preguntas.length,
                        })}
                      </span>
                    </span>
                  </div>

                  <span
                    className={`material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant transition-transform ${
                      testsExpandidos.has(test.id) ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => borrar(test)}
                  aria-label={t("deleteAria", { title: test.titulo })}
                  className="shrink-0 rounded p-1.5 text-on-surface-variant transition hover:bg-error-container hover:text-on-error-container"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    delete
                  </span>
                </button>
              </div>

              {testsExpandidos.has(test.id) && (
                <div className="mt-3 flex flex-col gap-3">
                  {test.preguntas.length === 0 && (
                    <span className="text-xs text-on-surface-variant">
                      {t("testSinPreguntas")}
                    </span>
                  )}

                  {test.preguntas.map((pregunta, pi) => (
                    <div
                      key={pregunta.id}
                      className="flex flex-col gap-1 rounded bg-surface-container-low p-3"
                    >
                      <span className="text-xs font-semibold text-on-surface">
                        {t("questionNumber", { num: pi + 1 })}.{" "}
                        {pregunta.enunciado}
                      </span>

                      <ul className="flex flex-col gap-1">
                        {pregunta.respuestas.map((respuesta) => (
                          <li
                            key={respuesta.id}
                            className="flex items-center gap-2 text-xs text-on-surface-variant"
                          >
                            <span
                              className={`material-symbols-outlined text-[14px] ${
                                respuesta.correcta ? "text-primary" : ""
                              }`}
                            >
                              {respuesta.correcta
                                ? "check_circle"
                                : "radio_button_unchecked"}
                            </span>

                            <span
                              className={
                                respuesta.correcta
                                  ? "font-medium text-primary"
                                  : ""
                              }
                            >
                              {respuesta.texto}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <form onSubmit={guardar} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("testTituloLabel")}
            </label>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={t("testTituloPlaceholder")}
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("testPorcentajeLabel")}
            </label>

            <input
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              placeholder="60"
              className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-3">
            {preguntas.map((pregunta, pi) => (
              <div
                key={pi}
                className="flex flex-col gap-2 rounded bg-surface-container-lowest p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-on-surface">
                    {t("questionNumber", { num: pi + 1 })}
                  </span>

                  {preguntas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarPregunta(pi)}
                      className="rounded p-1 text-on-surface-variant transition hover:bg-error-container hover:text-on-error-container"
                      aria-label={t("deleteQuestion")}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        delete
                      </span>
                    </button>
                  )}
                </div>

                <input
                  value={pregunta.enunciado}
                  onChange={(e) =>
                    actualizarPregunta(pi, e.target.value)
                  }
                  placeholder={t("testPreguntaPlaceholder")}
                  className="rounded bg-surface-container-low px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />

                <div className="flex flex-col gap-1.5">
                  {pregunta.respuestas.map((respuesta, ri) => (
                    <div key={ri} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => marcarCorrecta(pi, ri)}
                        title={t("testRespuestaCorrecta")}
                        className={`shrink-0 rounded p-1 transition ${
                          respuesta.correcta
                            ? "text-primary"
                            : "text-outline-variant hover:text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {respuesta.correcta
                            ? "check_circle"
                            : "radio_button_unchecked"}
                        </span>
                      </button>

                      <input
                        value={respuesta.texto}
                        onChange={(e) =>
                          actualizarRespuesta(pi, ri, e.target.value)
                        }
                        placeholder={t("testRespuestaPlaceholder")}
                        className="w-full rounded bg-surface-container-low px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => agregarRespuesta(pi)}
                  className="flex items-center gap-1 self-start text-xs font-semibold text-secondary transition hover:underline"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    add
                  </span>

                  {t("testRespuestaAdd")}
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={agregarPregunta}
            className="flex items-center gap-1 self-start text-xs font-semibold text-secondary transition hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>

            {t("testPreguntaAdd")}
          </button>

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

            {t("testSave")}
          </button>
        </form>
      )}
    </div>
  );
}