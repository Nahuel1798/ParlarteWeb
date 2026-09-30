"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import {
  eliminarEvento,
  listarCursos,
  listarEventos,
  type CursoResponse,
  type EventoResponse,
} from "../../lib/api";
import { useSessionUser, useMontado } from "../../lib/session";
import {
  aIso,
  avanzar,
  diasDeSemana,
  etiquetaPeriodo,
  rangoDe,
  type ModoCalendario,
} from "./dateUtils";
import CalendarioMes from "./CalendarioMes";
import RejillaHoraria from "./RejillaHoraria";
import ListaEventos from "./ListaEventos";
import DetalleEvento from "./DetalleEvento";
import EventoForm from "./EventoForm";

const MODOS: ModoCalendario[] = ["mes", "semana", "dia"];

export default function CalendarioView() {
  const t = useTranslations("calendario");
  const locale = useLocale();
  const user = useSessionUser();
  const montado = useMontado();

  const esGestor = user?.rol === "ADMINISTRADOR" || user?.rol === "PROFESOR";
  const permiteGeneral = user?.rol === "ADMINISTRADOR";

  const [modo, setModo] = useState<ModoCalendario>("mes");
  const [ancla, setAncla] = useState(() => new Date());

  const [eventos, setEventos] = useState<EventoResponse[]>([]);
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [claveCargada, setClaveCargada] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rango = useMemo(() => rangoDe(ancla, modo), [ancla, modo]);
  const clave = `${modo}:${aIso(rango.desde)}:${aIso(rango.hasta)}`;
  const cargando = claveCargada !== clave;

  const [seleccionado, setSeleccionado] = useState<EventoResponse | null>(null);
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<EventoResponse | null>(null);
  const [fechaInicial, setFechaInicial] = useState<Date | null>(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let active = true;
    const { desde, hasta } = rangoDe(ancla, modo);

    listarEventos(aIso(desde), aIso(hasta))
      .then((data) => {
        if (active) {
          setEventos(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : t("errorCargar"));
      })
      .finally(() => {
        if (active) setClaveCargada(clave);
      });

    return () => {
      active = false;
    };
  }, [ancla, modo, clave, recarga, t]);

  useEffect(() => {
    if (!montado || !esGestor) return;

    let active = true;
    listarCursos()
      .then((data) => {
        if (!active) return;
        setCursos(
          user?.rol === "ADMINISTRADOR"
            ? data
            : data.filter((curso) => curso.profesor?.id === user?.id)
        );
      })
      .catch(() => {
        if (active) setCursos([]);
      });

    return () => {
      active = false;
    };
  }, [montado, esGestor, user]);

  const dias = useMemo(() => {
    if (modo === "dia") return [ancla];
    if (modo === "semana") return diasDeSemana(ancla);
    return [];
  }, [ancla, modo]);

  const recargar = useCallback(() => setRecarga((valor) => valor + 1), []);

  const puedeGestionarEvento = (evento: EventoResponse) => {
    if (user?.rol === "ADMINISTRADOR") return true;
    if (user?.rol !== "PROFESOR" || evento.cursoId == null) return false;
    return cursos.some((curso) => curso.id === evento.cursoId);
  };

  const abrirNuevo = (fecha: Date) => {
    setEditando(null);
    setFechaInicial(fecha);
    setSeleccionado(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (evento: EventoResponse) => {
    setEditando(evento);
    setFechaInicial(null);
    setSeleccionado(null);
    setFormAbierto(true);
  };

  const borrar = async (evento: EventoResponse) => {
    if (!window.confirm(t("confirmarEliminar", { titulo: evento.titulo }))) return;

    try {
      await eliminarEvento(evento.id);
      setSeleccionado(null);
      recargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorEliminar"));
    }
  };

  const cambiarModo = (nuevo: ModoCalendario) => {
    setModo(nuevo);
    setSeleccionado(null);
  };

  const irHoy = () => {
    setAncla(new Date());
    setSeleccionado(null);
  };

  const acciones = (
    <>
      <div className="flex items-center gap-1 rounded-lg bg-surface-container-low p-1">
        {MODOS.map((valor) => (
          <button
            key={valor}
            type="button"
            onClick={() => cambiarModo(valor)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              modo === valor
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {t(`vista${valor.charAt(0).toUpperCase()}${valor.slice(1)}`)}
          </button>
        ))}
      </div>

      {esGestor && (
        <button
          type="button"
          onClick={() => abrirNuevo(new Date())}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-base">add</span>
          {t("nuevoEvento")}
        </button>
      )}
    </>
  );

  if (!montado) {
    return <SkeletonCalendario />;
  }

  return (
    <>
      <PageHeader
        kicker={t("kicker")}
        title={t("title")}
        description={t("description")}
        actions={acciones}
      />

      <Card divider={false} className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAncla((valor) => avanzar(valor, modo, -1))}
              aria-label={t("anterior")}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            <button
              type="button"
              onClick={irHoy}
              className="rounded-lg bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-surface-container"
            >
              {t("hoy")}
            </button>

            <button
              type="button"
              onClick={() => setAncla((valor) => avanzar(valor, modo, 1))}
              aria-label={t("siguiente")}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          <h2 className="font-headline-md text-lg font-semibold capitalize text-primary">
            {etiquetaPeriodo(ancla, modo, locale)}
          </h2>

          <span className="text-xs font-semibold text-on-surface-variant">
            {t("cantidadEventos", { cantidad: eventos.length })}
          </span>
        </div>
      </Card>

      {error && (
        <div className="mb-6 rounded-lg bg-secondary/10 px-4 py-3 text-sm text-secondary">
          {error}
        </div>
      )}

      {cargando ? (
        <SkeletonCalendario />
      ) : modo === "mes" ? (
        <CalendarioMes
          ancla={ancla}
          eventos={eventos}
          locale={locale}
          puedeGestionar={esGestor}
          onAbrirDia={(dia) => {
            setAncla(dia);
            setModo("dia");
          }}
          onAbrirEvento={setSeleccionado}
          onCrear={(dia) =>
            abrirNuevo(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 9, 0))
          }
        />
      ) : (
        <RejillaHoraria
          dias={dias}
          eventos={eventos}
          locale={locale}
          puedeGestionar={esGestor}
          onAbrirDia={(dia) => {
            setAncla(dia);
            setModo("dia");
          }}
          onAbrirEvento={setSeleccionado}
          onCrear={(dia, hora) =>
            abrirNuevo(new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hora, 0))
          }
        />
      )}

      <Card title={t("listado")} icon="event_note" className="mt-6">
        <ListaEventos
          eventos={eventos}
          locale={locale}
          onAbrirEvento={setSeleccionado}
        />
      </Card>

      {seleccionado && (
        <DetalleEvento
          evento={seleccionado}
          locale={locale}
          puedeGestionar={puedeGestionarEvento(seleccionado)}
          onEditar={() => abrirEdicion(seleccionado)}
          onEliminar={() => borrar(seleccionado)}
          onCerrar={() => setSeleccionado(null)}
        />
      )}

      {formAbierto && (
        <EventoForm
          evento={editando}
          fechaInicial={fechaInicial}
          cursos={cursos}
          permiteGeneral={permiteGeneral}
          onGuardar={() => {
            setFormAbierto(false);
            setEditando(null);
            recargar();
          }}
          onCancelar={() => {
            setFormAbierto(false);
            setEditando(null);
          }}
        />
      )}
    </>
  );
}

function SkeletonCalendario() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest">
      <div className="grid grid-cols-7 border-b border-outline-variant/40 bg-surface-container-low">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-8" />
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {Array.from({ length: 42 }, (_, i) => (
          <div
            key={i}
            className="min-h-[112px] border-b border-r border-outline-variant/25 p-2"
          >
            <div className="h-3 w-6 rounded bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  );
}
