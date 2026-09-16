"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  crearCurso,
  listarUsuariosPorRol,
  type UsuarioResponse,
} from "../../lib/api";

const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function NuevoCursoForm() {
  const router = useRouter();

  const [nivel, setNivel] = useState("C1");
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState(60);
  const [descripcion, setDescripcion] = useState("");
  const [horario, setHorario] = useState("");
  const [numeroModulos, setNumeroModulos] = useState(0);
  const [precio, setPrecio] = useState(480);
  const [portadaUrl, setPortadaUrl] = useState("");
  const [profesorId, setProfesorId] = useState<number | null>(null);

  const [docentes, setDocentes] = useState<UsuarioResponse[]>([]);
  const [cargandoDocentes, setCargandoDocentes] = useState(true);
  const [submitting, setSubmitting] = useState<
    "bozza" | "publicar" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarUsuariosPorRol("PROFESOR")
      .then((data) => {
        if (active) setDocentes(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al obtener los docentes"
          );
        }
      })
      .finally(() => {
        if (active) setCargandoDocentes(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const guardar = async (activo: boolean) => {
    setError(null);

    if (!nombre.trim()) {
      setError("El nombre del curso es obligatorio");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción del curso es obligatoria");
      return;
    }

    if (!horario.trim()) {
      setError("El horario de lección es obligatorio");
      return;
    }

    if (!profesorId) {
      setError("Selecciona un docente titular");
      return;
    }

    setSubmitting(activo ? "publicar" : "bozza");

    try {
      await crearCurso({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        nivel,
        duracionHoras: duracion,
        horario: horario.trim(),
        precio,
        portadaUrl: portadaUrl.trim(),
        activo,
        numeroModulos,
        profesor: { id: profesorId },
      });

      router.push("/curso");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el curso"
      );
      setSubmitting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#1c1c18] antialiased">

      <div className="w-full">

        {/* CONTENT */}
        <main className="min-h-screen w-full bg-[#fcf9f2] px-4 pt-8 sm:px-6">

          <div className="flex w-full flex-col pb-20">

            {/* Breadcrumb */}
            <div className="mb-10 flex flex-col gap-4">

              <div className="flex items-center gap-1 text-xs font-semibold text-[#42493e]">

                <Link href="/admin" className="cursor-pointer hover:text-[#154212]">
                  Amministrazione
                </Link>

                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>

                <span className="cursor-pointer hover:text-[#154212]">
                  Corsi Accademici
                </span>

                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>

                <span className="text-[#154212]">
                  Nuovo Corso
                </span>

              </div>

              {/* Title */}
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                <div>

                  <h1 className="font-['Playfair_Display'] text-3xl font-semibold tracking-tight sm:text-4xl">
                    Creazione Nuovo Corso Accademico
                  </h1>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#42493e]">
                    Configura l&apos;identità pedagogica e la programmazione
                    oraria per la nuova offerta formativa della Scuola
                    d&apos;Italiano.
                  </p>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded-lg bg-white px-4 py-3 text-xs font-semibold text-[#154212] shadow-sm ring-1 ring-[#e5e2db] transition hover:bg-[#f6f3ec]"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>

                    Volver a Administración
                  </Link>

                  <span className="hidden h-6 w-px bg-[#c2c9bb] sm:block" />

                  <button
                    onClick={() => guardar(false)}
                    disabled={submitting !== null}
                    className="flex items-center gap-1 rounded-lg bg-[#ebe8e1] px-4 py-3 text-xs font-semibold text-[#154212] shadow-sm transition hover:bg-[#e5e2db] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting === "bozza" ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#154212]/20 border-t-[#154212]" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">
                        save
                      </span>
                    )}

                    Salva come Bozza
                  </button>

                  <button
                    onClick={() => guardar(true)}
                    disabled={submitting !== null}
                    className="flex items-center gap-1 rounded-lg bg-[#154212] px-4 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#2d5a27] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting === "publicar" ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">
                        send
                      </span>
                    )}

                    Pubblica Corso
                  </button>

                </div>

              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-[#ffdbd2] px-4 py-3 text-sm font-medium text-[#3c0800]">
                  <span className="material-symbols-outlined text-[18px]">
                    error
                  </span>

                  {error}
                </div>
              )}

            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">

              {/* LEFT */}
              <div className="flex flex-col gap-6 xl:col-span-7">

                {/* INFORMACIONES GENERALES */}
                <section className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm">

                  <SectionTitle
                    number="1"
                    title="Informazioni Generali del Corso"
                    subtitle="Didattica Fondamentale"
                  />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        Nome del Corso / Nombre *
                      </label>

                      <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="rounded-lg bg-[#f6f3ec] px-3 py-3 text-sm font-medium outline-none shadow-inner focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        Durata in Ore *
                      </label>

                      <div className="flex items-center rounded-lg bg-[#f6f3ec] px-3 shadow-inner">
                        <input
                          type="number"
                          min={1}
                          value={duracion}
                          onChange={(e) =>
                            setDuracion(Number(e.target.value))
                          }
                          className="w-full bg-transparent py-3 text-sm font-semibold text-[#154212] outline-none"
                        />

                        <span className="text-xs text-[#42493e]">
                          Ore
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* CANIDAD DE MODULOS */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div className="flex flex-col gap-1">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        Numero Moduli / Cantidad de módulos
                      </label>

                      <div className="flex items-center rounded-lg bg-[#f6f3ec] px-3 shadow-inner">
                        <input
                          type="number"
                          min={0}
                          value={numeroModulos}
                          onChange={(e) =>
                            setNumeroModulos(
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-full bg-transparent py-3 text-sm font-semibold text-[#154212] outline-none"
                        />

                        <span className="material-symbols-outlined text-[16px] text-[#42493e]">
                          grid_view
                        </span>
                      </div>

                      <span className="text-[11px] text-[#42493e]">
                        Obiettivo informativo: el profesor agrega las clases
                        después en cada módulo.
                      </span>

                    </div>

                  </div>

                  {/* NIVEL */}
                  <div className="flex flex-col gap-2">

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        Livello QCER / Nivel *
                      </label>

                      <span className="text-xs font-semibold text-[#9d422b]">
                        {nivel} - Livello Avanzato
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">

                      {niveles.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setNivel(item)}
                          className={`rounded-lg py-3 text-xs font-semibold transition ${
                            nivel === item
                              ? "bg-[#154212] text-white shadow-sm"
                              : "bg-[#f6f3ec] text-[#42493e] hover:bg-[#ebe8e1]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}

                    </div>
                  </div>

                  {/* HORARIO */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div className="flex flex-col gap-2">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        Orario di Lezione *
                      </label>

                      <input
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        className="rounded-lg bg-[#f6f3ec] px-3 py-3 text-sm outline-none shadow-inner focus:bg-white"
                      />

                    </div>

                  </div>

                  {/* DESCRIPCION */}
                  <div className="flex flex-col gap-1">

                    <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                      Descrizione del Corso *
                    </label>

                    <textarea
                      rows={4}
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="resize-none rounded-lg bg-[#f6f3ec] p-3 text-sm outline-none shadow-inner focus:bg-white"
                    />

                  </div>

                </section>

              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-6 xl:col-span-5">

                {/* DOCENTE */}
                <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#9d422b]">
                      psychology_alt
                    </span>

                    <h3 className="font-['Playfair_Display'] text-lg font-semibold">
                      Docente Titolare
                    </h3>
                  </div>

                  {cargandoDocentes ? (
                    <div className="flex items-center justify-center rounded-xl bg-[#f6f3ec] py-8 text-sm text-[#42493e]">
                      Caricamento docenti…
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        Seleziona Docente Titolare *
                      </label>

                      <select
                        value={profesorId ?? ""}
                        onChange={(e) =>
                          setProfesorId(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        className="rounded-lg bg-[#f6f3ec] px-3 py-3 text-sm font-medium outline-none shadow-inner"
                      >
                        <option value="">Seleziona un docente…</option>

                        {docentes.map((docente) => (
                          <option key={docente.id} value={docente.id}>
                            {docente.nombre}
                            {docente.apellidos ? ` ${docente.apellidos}` : ""} (
                            {docente.email})
                          </option>
                        ))}
                      </select>

                      {docentes.length === 0 && (
                        <span className="text-xs text-[#9d422b]">
                          Non ci sono docenti registrati nel sistema.
                        </span>
                      )}

                    </div>
                  )}

                </section>

                {/* TARIFA */}
                <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#735c00]">
                        payments
                      </span>

                      <h3 className="font-['Playfair_Display'] text-lg font-semibold">
                        Tariffa e Iscrizione
                      </h3>
                    </div>

                    <span className="rounded bg-[#f0eee7] px-3 py-1 text-xs text-[#42493e]">
                      EUR (€)
                    </span>

                  </div>

                  <div className="flex flex-col gap-1">

                    <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                      Prezzo / Quota Corso *
                    </label>

                    <div className="flex items-center rounded-lg bg-[#f6f3ec] px-3 shadow-inner">
                      <span className="text-sm font-semibold text-[#42493e]">
                        €
                      </span>

                      <input
                        type="number"
                        min={0}
                        value={precio}
                        onChange={(e) =>
                          setPrecio(Number(e.target.value))
                        }
                        className="w-full bg-transparent px-2 py-3 text-sm font-semibold text-[#154212] outline-none"
                      />
                    </div>

                  </div>

                </section>

                {/* PORTADA */}
                <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#154212]">
                      image
                    </span>

                    <h3 className="font-['Playfair_Display'] text-lg font-semibold">
                      URL Copertina
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2">

                    <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                      Indirizzo URL Copertina
                    </label>

                    <input
                      type="url"
                      value={portadaUrl}
                      onChange={(e) => setPortadaUrl(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg bg-[#f6f3ec] px-3 py-2 text-xs outline-none shadow-inner focus:bg-white"
                    />

                  </div>

                  {/* Imagen */}
                  <div className="relative h-36 overflow-hidden rounded-lg">
                    {portadaUrl ? (
                      <Image
                        src={portadaUrl}
                        alt="Anteprima copertina"
                        fill
                        sizes="(max-width: 1280px) 50vw, 400px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f6f3ec] text-xs text-[#42493e]">
                        Sin imagen de portada
                      </div>
                    )}
                  </div>

                </section>

              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">

      <div className="flex items-center gap-3">

        {number && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#bcf0ae] text-xs font-bold text-[#154212]">
            {number}
          </span>
        )}

        <h2 className="font-['Playfair_Display'] text-xl font-semibold">
          {title}
        </h2>

      </div>

      {subtitle && (
        <span className="hidden text-xs uppercase tracking-wider text-[#42493e] sm:block">
          {subtitle}
        </span>
      )}

    </div>
  );
}