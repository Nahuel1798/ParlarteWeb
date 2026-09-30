"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  actualizarClase,
  crearClase,
  eliminarClase,
  listarClases,
  obtenerCurso,
  obtenerResumen,
  reordenarClases,
  type ClaseRequest,
  type ClaseResponse,
  type CursoResumenResponse,
  type CursoResponse,
} from "../../lib/api";
import { useSessionUser } from "../../lib/session";
import ClaseMaterial from "./ClaseMaterial";
import ClaseRecursos from "../docente/recursos/ClaseRecursos";
import type { ReactNode } from "react";

const FILTRO_TODOS = "todos";
const FILTRO_SIN_MODULO = "sin";

function claveModulo(modulo: number | null) {
  return modulo === null ? FILTRO_SIN_MODULO : String(modulo);
}

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(precio);
}

function MetaRow({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-on-surface-variant">
      <span className="material-symbols-outlined mt-px text-[18px] text-primary">
        {icon}
      </span>

      <span className="text-sm">{children}</span>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: string;
  label: string;
  value: string | number;
  tone?: "primary" | "secondary" | "tertiary";
}) {
  const tones = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-container-low px-4 py-3">
      <span
        className={`material-symbols-outlined text-[22px] ${tones[tone]}`}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <span className="block font-headline-md text-xl font-bold leading-tight text-primary">
          {value}
        </span>

        <span className="font-caption block text-[11px] uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
      </div>
    </div>
  );
}

function ClaseForm({
  initial,
  opcionesModulo,
  moduloInicial,
  titulo,
  onCancel,
  onSubmit,
}: {
  initial?: ClaseResponse;
  opcionesModulo: number[];
  moduloInicial?: number | null;
  titulo: string;
  onCancel: () => void;
  onSubmit: (datos: ClaseRequest) => void;
}) {
  const t = useTranslations("cursoDetalle");

  const [tituloClase, setTituloClase] = useState(initial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [modulo, setModulo] = useState(() => {
    if (initial) {
      return initial.modulo === null ? FILTRO_SIN_MODULO : String(initial.modulo);
    }

    if (moduloInicial === undefined) return "";

    return claveModulo(moduloInicial);
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          titulo: tituloClase.trim(),
          descripcion: descripcion.trim(),
          modulo: modulo === FILTRO_SIN_MODULO || modulo === "" ? null : Number(modulo),
        });
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-secondary">
          {titulo}
        </span>

        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant transition hover:text-primary"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>

          {t("cancel")}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {t("titleLabel")}
        </label>

        <input
          value={tituloClase}
          onChange={(e) => setTituloClase(e.target.value)}
          placeholder={t("titlePlaceholder")}
          className="rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {t("descriptionLabel")}
        </label>

        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder={t("descriptionPlaceholder")}
          className="resize-none rounded bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
          {t("moduleLabel")}
        </label>

        <div className="flex items-center gap-2 rounded bg-surface-container-lowest px-3 focus-within:ring-1 focus-within:ring-primary">
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
            grid_view
          </span>

          <select
            value={modulo}
            onChange={(e) => setModulo(e.target.value)}
            className="w-full bg-transparent py-2 text-sm font-semibold text-primary outline-none"
          >
            <option value={FILTRO_SIN_MODULO}>{t("withoutModule")}</option>

            {opcionesModulo.map((num) => (
              <option key={num} value={num}>
                {t("module", { num })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-1 rounded bg-primary px-3 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
      >
        <span className="material-symbols-outlined text-[14px]">save</span>

        {t("saveClass")}
      </button>
    </form>
  );
}

export default function CursoDetalle({ cursoId }: { cursoId: number }) {
  const router = useRouter();
  const t = useTranslations("cursoDetalle");
  const user = useSessionUser();

  const [curso, setCurso] = useState<CursoResponse | null>(null);
  const [resumen, setResumen] = useState<CursoResumenResponse | null>(null);
  const [clases, setClases] = useState<ClaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClases, setLoadingClases] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clasesError, setClasesError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroModulo, setFiltroModulo] = useState(FILTRO_TODOS);
  const [abiertas, setAbiertas] = useState<Set<number>>(() => new Set());
  const [editandoRecursos, setEditandoRecursos] = useState<Set<number>>(
    () => new Set()
  );
  const [editandoClase, setEditandoClase] = useState<number | null>(null);
  const [creandoClase, setCreandoClase] = useState(false);
  const [creandoEnModulo, setCreandoEnModulo] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState<number | null>(null);

  const puedeGestionar =
    user?.rol === "ADMINISTRADOR" || user?.rol === "PROFESOR";

  const hayFiltro = busqueda.trim() !== "" || filtroModulo !== FILTRO_TODOS;

  const refrescarResumen = useCallback(() => {
    obtenerResumen(cursoId)
      .then(setResumen)
      .catch(() => setResumen(null));
  }, [cursoId]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    let active = true;

    obtenerCurso(cursoId)
      .then((data) => {
        if (active) setCurso(data);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : t("defaultError"));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    refrescarResumen();

    listarClases(cursoId)
      .then((data) => {
        if (!active) return;

        setClases(data);
        setAbiertas(new Set(data.map((clase) => clase.id)));
      })
      .catch((err) => {
        if (active) {
          setClasesError(
            err instanceof Error ? err.message : t("defaultErrorClasses")
          );
        }
      })
      .finally(() => {
        if (active) setLoadingClases(false);
      });

    return () => {
      active = false;
    };
  }, [cursoId, user, router, t, refrescarResumen]);

  const modulos = useMemo(() => {
    const valores = new Set<number>();

    for (const clase of clases) {
      if (clase.modulo !== null) valores.add(clase.modulo);
    }

    return Array.from(valores).sort((a, b) => a - b);
  }, [clases]);

  const opcionesModulo = useMemo(() => {
    const declarados = curso?.numeroModulos ?? 0;
    const mayor = modulos.length > 0 ? modulos[modulos.length - 1] : 0;

    return Array.from(
      { length: Math.max(declarados, mayor) + 1 },
      (_, i) => i + 1
    );
  }, [curso, modulos]);

  const clasesFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLowerCase();

    return clases.filter((clase) => {
      if (filtroModulo === FILTRO_SIN_MODULO && clase.modulo !== null) {
        return false;
      }

      if (filtroModulo !== FILTRO_TODOS && filtroModulo !== FILTRO_SIN_MODULO) {
        if (clase.modulo !== Number(filtroModulo)) return false;
      }

      if (!consulta) return true;

      return (
        clase.titulo.toLowerCase().includes(consulta) ||
        clase.descripcion.toLowerCase().includes(consulta)
      );
    });
  }, [clases, busqueda, filtroModulo]);

  const grupos = useMemo(() => {
    const map = new Map<number | null, ClaseResponse[]>();

    for (const clase of clasesFiltradas) {
      const key = clase.modulo;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(clase);
    }

    const mostrarModulosVacios = !hayFiltro && opcionesModulo.length > 1;

    if (mostrarModulosVacios) {
      for (const num of opcionesModulo) {
        if (!map.has(num)) map.set(num, []);
      }
    }

    return Array.from(map.entries()).sort((a, b) => {
      const ma = a[0] ?? Number.MAX_SAFE_INTEGER;
      const mb = b[0] ?? Number.MAX_SAFE_INTEGER;
      return ma - mb;
    });
  }, [clasesFiltradas, hayFiltro, opcionesModulo]);

  const totalFiltradas = clasesFiltradas.length;

  const alternar = (
    setter: React.Dispatch<React.SetStateAction<Set<number>>>,
    claseId: number
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(claseId)) {
        next.delete(claseId);
      } else {
        next.add(claseId);
      }
      return next;
    });
  };

  const alternarNuevaClase = () => {
    if (creandoClase) setCreandoEnModulo(null);
    setCreandoClase(!creandoClase);
  };

  const alternarNuevaClaseEnModulo = (clave: string) => {
    setCreandoClase(false);
    setEditandoClase(null);
    setCreandoEnModulo((prev) => (prev === clave ? null : clave));
  };

  const guardarClase = async (datos: ClaseRequest) => {
    setClasesError(null);

    if (!datos.titulo) {
      setClasesError(t("titleRequired"));
      return;
    }

    if (!datos.descripcion) {
      setClasesError(t("descriptionRequired"));
      return;
    }

    try {
      if (editandoClase === null) {
        const nueva = await crearClase(cursoId, datos);
        setClases((prev) => [...prev, nueva]);
        setAbiertas((prev) => new Set(prev).add(nueva.id));
        setCreandoClase(false);
        setCreandoEnModulo(null);
      } else {
        const actualizada = await actualizarClase(
          cursoId,
          editandoClase,
          datos
        );
        setClases((prev) =>
          prev.map((clase) => (clase.id === editandoClase ? actualizada : clase))
        );
        setEditandoClase(null);
      }

      refrescarResumen();
    } catch (err) {
      setClasesError(
        err instanceof Error ? err.message : t("classSaveError")
      );
    }
  };

  const borrarClase = async (clase: ClaseResponse) => {
    if (!window.confirm(t("deleteConfirm", { title: clase.titulo }))) return;

    setClasesError(null);

    try {
      await eliminarClase(cursoId, clase.id);
      setClases((prev) => prev.filter((c) => c.id !== clase.id));
      setAbiertas((prev) => {
        const next = new Set(prev);
        next.delete(clase.id);
        return next;
      });
      refrescarResumen();
    } catch (err) {
      setClasesError(
        err instanceof Error ? err.message : t("classDeleteError")
      );
    }
  };

  const moverClase = async (origenId: number, destinoId: number) => {
    const origen = clases.findIndex((c) => c.id === origenId);
    const destino = clases.findIndex((c) => c.id === destinoId);

    if (origen < 0 || destino < 0 || origen === destino) return;

    const anterior = clases;
    const siguiente = [...clases];
    const [movida] = siguiente.splice(origen, 1);
    siguiente.splice(destino, 0, movida);
    setClases(siguiente.map((clase, i) => ({ ...clase, orden: i + 1 })));

    try {
      await reordenarClases(cursoId, siguiente.map((c) => c.id));
    } catch (err) {
      setClases(anterior);
      setClasesError(
        err instanceof Error ? err.message : t("reorderError")
      );
    }
  };

  const moverPaso = (claseId: number, delta: number) => {
    const idx = clases.findIndex((c) => c.id === claseId);
    const destino = idx + delta;

    if (idx < 0 || destino < 0 || destino >= clases.length) return;

    void moverClase(claseId, clases[destino].id);
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-surface-container-lowest py-24 text-center text-sm text-on-surface-variant">
        {t("loading")}
      </div>
    );
  }

  if (error || !curso) {
    return (
      <div className="rounded-xl bg-surface-container-lowest px-6 py-16 text-center shadow-sm">
        <span className="material-symbols-outlined text-[40px] text-outline-variant">
          error
        </span>

        <p className="mt-3 font-body-md text-base text-on-surface-variant">
          {error ?? t("courseNotFound")}
        </p>

        <Link
          href="/curso"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>

          {t("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 text-on-surface antialiased">
      <section className="overflow-hidden rounded-xl border border-primary/15 bg-surface-container-lowest shadow-sm">
        <div className="relative h-56 md:h-72">
          <div
            className={`h-full w-full bg-cover bg-center ${
              curso.portadaUrl
                ? ""
                : "bg-gradient-to-br from-primary-fixed to-surface-container-high"
            }`}
            style={
              curso.portadaUrl
                ? { backgroundImage: `url('${curso.portadaUrl}')` }
                : undefined
            }
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <Link
              href="/curso"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 transition hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>

              {t("back")}
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded bg-white/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
                {curso.nivel}
              </span>

              <span
                className={`rounded px-2.5 py-1 text-xs font-semibold ${
                  curso.activo
                    ? "bg-primary-fixed/90 text-on-primary-fixed"
                    : "bg-white/20 text-white backdrop-blur-sm"
                }`}
              >
                {curso.activo ? t("active") : t("archived")}
              </span>
            </div>

            <h1 className="mt-3 font-display-lg text-3xl text-white md:text-4xl">
              {curso.nombre}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-12 md:p-8">
          <div className="flex flex-col gap-5 md:col-span-7">
            <p className="text-base leading-relaxed text-on-surface-variant">
              {curso.descripcion}
            </p>

            <div className="flex flex-col gap-2.5 border-t border-outline-variant/20 pt-5">
              <MetaRow icon="schedule">{curso.horario}</MetaRow>

              <MetaRow icon="hourglass_top">
                {t("hours", { count: curso.duracionHoras })}
              </MetaRow>

              <MetaRow icon="co_present">
                {curso.profesor
                  ? `${curso.profesor.nombre}${
                      curso.profesor.apellidos
                        ? ` ${curso.profesor.apellidos}`
                        : ""
                    }`
                  : t("unassigned")}
              </MetaRow>

              <MetaRow icon="payments">
                {formatearPrecio(curso.precio)}
              </MetaRow>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:col-span-5">
            <StatTile
              icon="signal_cellular_alt"
              label={t("statLevel")}
              value={curso.nivel}
              tone="primary"
            />

            <StatTile
              icon="hourglass_bottom"
              label={t("statHours")}
              value={curso.duracionHoras}
              tone="secondary"
            />

            <StatTile
              icon="grid_view"
              label={t("statModules")}
              value={resumen?.modulos ?? curso.numeroModulos ?? 0}
              tone="tertiary"
            />

            <StatTile
              icon="menu_book"
              label={t("statClasses")}
              value={clases.length}
              tone="primary"
            />
          </div>
        </div>
      </section>

      {resumen && (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile
            icon="play_circle"
            label={t("statVideos")}
            value={resumen.videos}
            tone="primary"
          />

          <StatTile
            icon="folder_open"
            label={t("statMateriales")}
            value={resumen.materiales}
            tone="secondary"
          />

          <StatTile
            icon="assignment"
            label={t("statTareas")}
            value={resumen.tareas}
            tone="tertiary"
          />

          <StatTile
            icon="quiz"
            label={t("statTests")}
            value={resumen.tests}
            tone="primary"
          />
        </section>
      )}

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary" />

              <span className="font-caption text-xs font-semibold uppercase tracking-widest text-secondary">
                {t("contentKicker")}
              </span>
            </div>

            <h2 className="font-headline-lg text-2xl font-semibold tracking-tight text-primary md:text-3xl">
              {t("contentTitle")}
            </h2>
          </div>

          {puedeGestionar && (
            <button
              type="button"
              onClick={() => {
                setEditandoClase(null);
                alternarNuevaClase();
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-base">
                {creandoClase ? "close" : "add_circle"}
              </span>

              {creandoClase ? t("cancel") : t("newClass")}
            </button>
          )}
        </div>

        {creandoClase && (
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <ClaseForm
              opcionesModulo={opcionesModulo}
              titulo={t("newClassTitle")}
              onCancel={() => setCreandoClase(false)}
              onSubmit={guardarClase}
            />
          </div>
        )}

        {clasesError && (
          <div
            title={clasesError}
            className="flex items-center gap-2 rounded-lg bg-error-container px-4 py-3 text-sm font-medium text-on-error-container"
          >
            <span className="material-symbols-outlined text-[18px]">error</span>

            {t("defaultErrorClasses")}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg bg-surface-container-low px-3 focus-within:bg-surface-bright focus-within:ring-1 focus-within:ring-primary">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              search
            </span>

            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 focus-within:bg-surface-bright focus-within:ring-1 focus-within:ring-primary">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              filter_alt
            </span>

            <select
              value={filtroModulo}
              onChange={(e) => setFiltroModulo(e.target.value)}
              className="bg-transparent py-2 text-sm font-semibold text-primary outline-none"
            >
              <option value={FILTRO_TODOS}>{t("allModules")}</option>

              <option value={FILTRO_SIN_MODULO}>{t("withoutModule")}</option>

              {modulos.map((num) => (
                <option key={num} value={num}>
                  {t("module", { num })}
                </option>
              ))}
            </select>
          </div>

          {hayFiltro && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setFiltroModulo(FILTRO_TODOS);
              }}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">
                filter_alt_off
              </span>

              {t("clearFilters")}
            </button>
          )}

          <span className="ml-auto text-xs text-on-surface-variant">
            {t("classes", { count: totalFiltradas })}
          </span>
        </div>

        {puedeGestionar && (
          <p className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              drag_indicator
            </span>

            {hayFiltro ? t("reorderHintFiltered") : t("reorderHint")}
          </p>
        )}

        {loadingClases ? (
          <div className="rounded-xl bg-surface-container-lowest py-20 text-center text-sm text-on-surface-variant shadow-sm">
            {t("loadingClasses")}
          </div>
        ) : grupos.length === 0 ? (
          <div className="rounded-xl bg-surface-container-lowest px-6 py-16 text-center shadow-sm">
            <span className="material-symbols-outlined text-[40px] text-outline-variant">
              menu_book
            </span>

            <p className="mt-3 font-body-md text-base text-on-surface-variant">
              {hayFiltro ? t("emptySearch") : t("emptyClasses")}
            </p>
          </div>
        ) : (
          grupos.map(([numModulo, items]) => {
            const clave = claveModulo(numModulo);
            const formularioAbierto = puedeGestionar && creandoEnModulo === clave;

            return (
              <section
                key={clave}
                className="rounded-xl bg-surface-container-lowest p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
                  <h3 className="flex items-center gap-2 font-headline-md text-base font-semibold text-primary">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-fixed text-[11px] font-bold text-on-primary-fixed">
                      {numModulo ?? "—"}
                    </span>

                    {numModulo
                      ? t("module", { num: numModulo })
                      : t("withoutModule")}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-on-surface-variant">
                      {t("classes", { count: items.length })}
                    </span>

                    {puedeGestionar && (
                      <button
                        type="button"
                        onClick={() => alternarNuevaClaseEnModulo(clave)}
                        aria-expanded={formularioAbierto}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-on-primary"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {formularioAbierto ? "close" : "add"}
                        </span>

                        {formularioAbierto ? t("cancel") : t("addClass")}
                      </button>
                    )}
                  </div>
                </div>

                {formularioAbierto && (
                  <div className="mt-4">
                    <ClaseForm
                      opcionesModulo={opcionesModulo}
                      moduloInicial={numModulo}
                      titulo={
                        numModulo === null
                          ? t("newClassWithoutModuleTitle")
                          : t("newClassInModuleTitle", { num: numModulo })
                      }
                      onCancel={() => setCreandoEnModulo(null)}
                      onSubmit={guardarClase}
                    />
                  </div>
                )}

                {items.length === 0 ? (
                  <p className="mt-4 rounded-lg border border-dashed border-outline-variant/40 px-4 py-6 text-center text-xs text-on-surface-variant">
                    {t("emptyModule")}
                  </p>
                ) : (
                  <div className="mt-3 flex flex-col gap-3">
                    {items.map((clase, index) => {
                    const abierto = abiertas.has(clase.id);
                    const enEdicion = editandoRecursos.has(clase.id);

                    return (
                      <div
                        key={clase.id}
                        draggable={puedeGestionar && !hayFiltro && editandoClase !== clase.id}
                        onDragStart={() => setArrastrando(clase.id)}
                        onDragEnd={() => setArrastrando(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (arrastrando !== null) void moverClase(arrastrando, clase.id);
                          setArrastrando(null);
                        }}
                        className={`flex flex-col gap-3 rounded-lg bg-surface-container-low p-4 transition ${
                          arrastrando === clase.id
                            ? "opacity-50"
                            : arrastrando !== null
                              ? "outline outline-2 outline-primary/40"
                              : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-start gap-2">
                            {puedeGestionar && (
                              <span
                                title={t("reorderHint")}
                                className={`mt-0.5 shrink-0 ${
                                  hayFiltro ? "text-outline-variant" : "cursor-grab text-outline-variant"
                                }`}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  drag_indicator
                                </span>
                              </span>
                            )}

                            <div className="min-w-0">
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-on-surface">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-[11px] font-bold text-secondary">
                                  {index + 1}
                                </span>

                                <span className="material-symbols-outlined text-[18px] text-secondary">
                                  record_voice_over
                                </span>

                                {clase.titulo}
                              </span>

                              {clase.descripcion && (
                                <span className="mt-1 block text-xs leading-relaxed text-on-surface-variant">
                                  {clase.descripcion}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center gap-1">
                            {puedeGestionar && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => moverPaso(clase.id, -1)}
                                  disabled={hayFiltro || clases.findIndex((c) => c.id === clase.id) === 0}
                                  aria-label={t("moveUpAria", { title: clase.titulo })}
                                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    arrow_upward
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moverPaso(clase.id, 1)}
                                  disabled={
                                    hayFiltro ||
                                    clases.findIndex((c) => c.id === clase.id) === clases.length - 1
                                  }
                                  aria-label={t("moveDownAria", { title: clase.titulo })}
                                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    arrow_downward
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setCreandoClase(false);
                                    setCreandoEnModulo(null);
                                    setEditandoClase((prev) =>
                                      prev === clase.id ? null : clase.id
                                    );
                                  }}
                                  aria-label={t("editClassAria", { title: clase.titulo })}
                                  className={`rounded p-1.5 transition ${
                                    editandoClase === clase.id
                                      ? "bg-primary/10 text-primary"
                                      : "text-on-surface-variant hover:bg-primary/10 hover:text-primary"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    edit
                                  </span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => borrarClase(clase)}
                                  aria-label={t("deleteClassAria", { title: clase.titulo })}
                                  className="rounded p-1.5 text-on-surface-variant transition hover:bg-error-container hover:text-on-error-container"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    delete
                                  </span>
                                </button>
                              </>
                            )}

                            {puedeGestionar && (
                              <div className="flex items-center gap-1 rounded-full bg-surface-container-highest p-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editandoRecursos.has(clase.id)) {
                                      alternar(setEditandoRecursos, clase.id);
                                    } else {
                                      setAbiertas((prev) => new Set(prev).add(clase.id));
                                    }
                                  }}
                                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                    enEdicion
                                      ? "bg-surface-container-lowest text-primary shadow-sm"
                                      : "text-on-surface-variant hover:text-primary"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    visibility
                                  </span>

                                  {t("modeView")}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!abierto) {
                                      setAbiertas((prev) => new Set(prev).add(clase.id));
                                    }
                                    alternar(setEditandoRecursos, clase.id);
                                  }}
                                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                                    enEdicion
                                      ? "bg-primary text-on-primary shadow-sm"
                                      : "text-on-surface-variant hover:text-primary"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    edit
                                  </span>

                                  {t("modeEdit")}
                                </button>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => alternar(setAbiertas, clase.id)}
                              aria-expanded={abierto}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary-container/40"
                            >
                              {t("material")}

                              <span
                                className={`material-symbols-outlined text-[18px] transition-transform ${
                                  abierto ? "rotate-180" : ""
                                }`}
                              >
                                expand_more
                              </span>
                            </button>
                          </div>
                        </div>

                        {editandoClase === clase.id && (
                          <div className="border-t border-outline-variant/20 pt-3">
                            <ClaseForm
                              initial={clase}
                              opcionesModulo={opcionesModulo}
                              titulo={t("editClassTitle")}
                              onCancel={() => setEditandoClase(null)}
                              onSubmit={guardarClase}
                            />
                          </div>
                        )}

                        {abierto && editandoClase !== clase.id && (
                          <div className="border-t border-outline-variant/20 pt-3">
                            {puedeGestionar && enEdicion ? (
                              <ClaseRecursos cursoId={cursoId} clase={clase} />
                            ) : (
                              <ClaseMaterial cursoId={cursoId} claseId={clase.id} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                    })}
                  </div>
                )}
              </section>
            );
          })
        )}
      </section>
    </div>
  );
}
