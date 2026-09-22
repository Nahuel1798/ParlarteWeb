"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  crearCurso,
  listarUsuariosPorRol,
  subirPortada,
  type UsuarioResponse,
} from "../../lib/api";

const niveles = ["A1", "A2", "B1", "B2", "C1", "C2"];

const diasSemanaKey = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
] as const;

const franjasHorarias = (() => {
  const slots: string[] = [];
  for (let h = 8; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h === 22) break;
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
})();

const modulosPredefinidos = [4, 6, 8, 12];
const preciosPredefinidos = [30000, 45000, 60000, 90000];

function formatearPesos(value: number) {
  return value.toLocaleString("es-AR");
}

export default function NuevoCursoForm() {
  const router = useRouter();
  const t = useTranslations("nuevoCurso");

  const [nivel, setNivel] = useState("C1");
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState(60);
  const [descripcion, setDescripcion] = useState("");
  const [dia, setDia] = useState<(typeof diasSemanaKey)[number]>("lunes");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin, setHoraFin] = useState("10:00");
  const [numeroModulos, setNumeroModulos] = useState(0);
  const [precio, setPrecio] = useState(45000);

  const horario = `${t(`dias.${dia}`)} ${horaInicio} - ${horaFin}`;
  const [portadaUrl, setPortadaUrl] = useState("");
  const [profesorId, setProfesorId] = useState<number | null>(null);

  const [docentes, setDocentes] = useState<UsuarioResponse[]>([]);
  const [cargandoDocentes, setCargandoDocentes] = useState(true);
  const [submitting, setSubmitting] = useState<
    "bozza" | "publicar" | null
  >(null);
  const [subiendoPortada, setSubiendoPortada] = useState(false);
  const [errorPortada, setErrorPortada] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
            err instanceof Error ? err.message : t("teacherDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) setCargandoDocentes(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  const guardar = async (activo: boolean) => {
    setError(null);

    if (!nombre.trim()) {
      setError(t("nameRequired"));
      return;
    }

    if (!descripcion.trim()) {
      setError(t("descriptionRequired"));
      return;
    }

    if (!horario.trim()) {
      setError(t("scheduleRequired"));
      return;
    }

    if (!profesorId) {
      setError(t("teacherRequired"));
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
        err instanceof Error ? err.message : t("defaultError")
      );
      setSubmitting(null);
    }
  };

  const handleSubirImagen = async (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorPortada(t("coverMustBeImage"));
      return;
    }

    setSubiendoPortada(true);
    setErrorPortada(null);

    try {
      const url = await subirPortada(file);
      setPortadaUrl(url);
    } catch (err) {
      setErrorPortada(
        err instanceof Error ? err.message : t("coverError")
      );
    } finally {
      setSubiendoPortada(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

              {/* Title */}
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                <div>

                  <h1 className="font-['Playfair_Display'] text-3xl font-semibold tracking-tight sm:text-4xl">
                    {t("title")}
                  </h1>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[#42493e]">
                    {t("subtitle")}
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

                    {t("backAdmin")}
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

                    {t("saveDraft")}
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

                    {t("publish")}
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
                    number={t("section1Number")}
                    title={t("section1Title")}
                    subtitle={t("section1Subtitle")}
                  />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        {t("nameLabel")}
                      </label>

                      <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="rounded-lg bg-[#f6f3ec] px-3 py-3 text-sm font-medium outline-none shadow-inner focus:bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        {t("durationLabel")}
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
                          {t("hoursSuffix")}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* CANTIDAD DE MODULOS */}
                  <div className="flex flex-col gap-3">

                    <div className="flex items-center justify-between gap-2">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        {t("moduliLabel")}
                      </label>

                      <span className="material-symbols-outlined text-[16px] text-[#42493e]">
                        grid_view
                      </span>

                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-4 rounded-lg bg-[#f6f3ec] px-3 py-3 shadow-inner">

                      <button
                        type="button"
                        onClick={() =>
                          setNumeroModulos(Math.max(0, numeroModulos - 1))
                        }
                        disabled={numeroModulos === 0}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg font-bold text-[#154212] shadow-sm transition hover:bg-[#ebe8e1] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <div className="flex flex-1 items-center justify-center gap-2">
                        <span className="text-2xl font-bold tabular-nums text-[#154212]">
                          {numeroModulos}
                        </span>

                        <span className="text-xs text-[#42493e]">
                          {t("moduliUnit", { count: numeroModulos })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setNumeroModulos(numeroModulos + 1)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg font-bold text-[#154212] shadow-sm transition hover:bg-[#ebe8e1]"
                      >
                        +
                      </button>

                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-1">

                      {modulosPredefinidos.map((modulo) => (
                        <button
                          key={modulo}
                          type="button"
                          onClick={() => setNumeroModulos(modulo)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            numeroModulos === modulo
                              ? "bg-[#154212] text-white shadow-sm"
                              : "bg-white text-[#42493e] ring-1 ring-[#e5e2db] hover:bg-[#f6f3ec]"
                          }`}
                        >
                          {t("moduliPreset", { count: modulo })}
                        </button>
                      ))}

                    </div>

                    <span className="text-[11px] text-[#42493e]">
                      {t("moduliInfo")}
                    </span>

                  </div>

                  {/* NIVEL */}
                  <div className="flex flex-col gap-2">

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        {t("levelLabel")}
                      </label>

                      <span className="text-xs font-semibold text-[#9d422b]">
                        {nivel} — {t("levelAvanzado")}
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
                  <div className="flex flex-col gap-3">

                    <div className="flex flex-wrap items-center justify-between gap-2">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        {t("scheduleLabel")}
                      </label>

                      <span className="material-symbols-outlined text-[16px] text-[#42493e]">
                        schedule
                      </span>

                    </div>

                    {/* Dia */}
                    <div className="flex flex-wrap gap-1">

                      {diasSemanaKey.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDia(item)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            dia === item
                              ? "bg-[#154212] text-white shadow-sm"
                              : "bg-[#f6f3ec] text-[#42493e] hover:bg-[#ebe8e1]"
                          }`}
                        >
                          {t(`dias.${item}`)}
                        </button>
                      ))}

                    </div>

                    {/* Horas */}
                    <div className="grid grid-cols-2 items-end gap-3">

                      <div className="flex flex-col gap-1">

                        <label className="text-xs font-medium text-[#42493e]">
                          {t("scheduleFrom")}
                        </label>

                        <select
                          value={horaInicio}
                          onChange={(e) => setHoraInicio(e.target.value)}
                          className="rounded-lg bg-[#f6f3ec] px-3 py-3 text-sm font-medium outline-none shadow-inner"
                        >
                          {franjasHorarias.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>

                      </div>

                      <div className="flex flex-col gap-1">

                        <label className="text-xs font-medium text-[#42493e]">
                          {t("scheduleTo")}
                        </label>

                        <select
                          value={horaFin}
                          onChange={(e) => setHoraFin(e.target.value)}
                          className="rounded-lg bg-[#f6f3ec] px-3 py-3 text-sm font-medium outline-none shadow-inner"
                        >
                          {franjasHorarias.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>

                      </div>

                    </div>

                    {/* Resumen */}
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-[#bcf0ae]/50 px-3 py-2">

                      <span className="text-xs font-medium text-[#42493e]">
                        {t("scheduleSummary")}
                      </span>

                      <span className="text-sm font-bold text-[#154212]">
                        {horario}
                      </span>

                    </div>

                  </div>

                  {/* DESCRIPCION */}
                  <div className="flex flex-col gap-1">

                    <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                      {t("descriptionLabel")}
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
                      {t("teacherTitle")}
                    </h3>
                  </div>

                  {cargandoDocentes ? (
                    <div className="flex items-center justify-center rounded-xl bg-[#f6f3ec] py-8 text-sm text-[#42493e]">
                      {t("teacherLoading")}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">

                      <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                        {t("teacherSelectLabel")}
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
                        <option value="">{t("teacherSelectPlaceholder")}</option>

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
                          {t("teacherEmpty")}
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
                        {t("priceTitle")}
                      </h3>
                    </div>

                    <span className="rounded bg-[#f0eee7] px-3 py-1 text-xs text-[#42493e]">
                      {t("priceCurrency")}
                    </span>

                  </div>

                  <div className="flex flex-col gap-1">

                    <label className="text-xs font-semibold uppercase tracking-wider text-[#42493e]">
                      {t("priceLabel")}
                    </label>

                    <div className="flex items-center rounded-lg bg-[#f6f3ec] px-3 shadow-inner">
                      <span className="text-sm font-semibold text-[#42493e]">
                        $
                      </span>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={
                          precio === 0 ? "" : formatearPesos(precio)
                        }
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setPrecio(digits === "" ? 0 : Number(digits));
                        }}
                        className="w-full bg-transparent px-2 py-3 text-sm font-semibold text-[#154212] outline-none"
                      />

                      <span className="text-xs text-[#42493e]">ARS</span>
                    </div>

                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap items-center gap-1">

                    {preciosPredefinidos.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecio(p)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          precio === p
                            ? "bg-[#154212] text-white shadow-sm"
                            : "bg-white text-[#42493e] ring-1 ring-[#e5e2db] hover:bg-[#f6f3ec]"
                        }`}
                      >
                        ${formatearPesos(p)}
                      </button>
                    ))}

                  </div>

                  <span className="text-[11px] text-[#42493e]">
                    {t("priceInfo")}
                  </span>

                </section>

                {/* PORTADA */}
                <section className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm">

                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#154212]">
                      image
                    </span>

                    <h3 className="font-['Playfair_Display'] text-lg font-semibold">
                      {t("coverTitle")}
                    </h3>
                  </div>

                  {/* Subir imagen */}
                  <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#c2c9bb] bg-[#f6f3ec] px-4 py-6 text-center">

                    <span className="material-symbols-outlined text-[28px] text-[#154212]">
                      upload
                    </span>

                    <p className="text-sm font-medium text-[#42493e]">
                      {t("coverUploadHint")}
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={subiendoPortada || submitting !== null}
                      className="flex items-center gap-1 rounded-lg bg-[#154212] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#2d5a27] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {subiendoPortada ? (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">
                          add_photo_alternate
                        </span>
                      )}

                      {subiendoPortada ? t("coverUploading") : t("coverChoose")}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleSubirImagen(e.target.files?.[0])
                      }
                    />

                    {errorPortada && (
                      <span className="text-xs font-medium text-[#9d422b]">
                        {errorPortada}
                      </span>
                    )}

                  </div>

                  {/* Preliminar */}
                  <div className="relative h-36 overflow-hidden rounded-lg">
                    {portadaUrl ? (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${portadaUrl}')` }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f6f3ec] text-xs text-[#42493e]">
                        {t("coverNone")}
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