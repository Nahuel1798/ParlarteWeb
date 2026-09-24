"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";
import ToneBadge from "@/components/ui/ToneBadge";
import { listarInscripciones, InscripcionResponse } from "../../lib/api";

function formatearFecha(fecha: string) {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InscripcionesTable() {
  const t = useTranslations("admin");
  const [inscripciones, setInscripciones] = useState<InscripcionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarInscripciones()
      .then((data) => {
        if (active) setInscripciones(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("inscripcionesDefaultError")
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [t]);

  return (
    <Card
      title={t("inscripcionesTableTitle")}
      subtitle={t("inscripcionesTableSubtitle")}
    >
      {loading ? (
        <div className="flex items-center justify-center py-10 text-sm text-on-surface-variant">
          {t("inscripcionesLoading")}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {error}
        </div>
      ) : inscripciones.length === 0 ? (
        <div className="py-10 text-center text-sm text-on-surface-variant">
          {t("inscripcionesEmpty")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="py-3 pr-6 font-semibold">
                  {t("inscripcionesHeaderAlumno")}
                </th>
                <th className="px-6 py-3 font-semibold">
                  {t("inscripcionesHeaderCurso")}
                </th>
                <th className="px-6 py-3 font-semibold">
                  {t("inscripcionesHeaderFecha")}
                </th>
                <th className="py-3 pl-6 font-semibold">
                  {t("inscripcionesHeaderEstado")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-container">
              {inscripciones.map((inscripcion) => (
                <tr key={inscripcion.id} className="text-sm">
                  <td className="py-3 pr-6 font-semibold">
                    {inscripcion.alumnoNombre}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    {inscripcion.cursoNombre}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    {formatearFecha(inscripcion.fechaInscripcion)}
                  </td>
                  <td className="py-3 pl-6">
                    <ToneBadge
                      tone={inscripcion.activa ? "success" : "neutral"}
                    >
                      {inscripcion.activa
                        ? t("inscripcionesActiva")
                        : t("inscripcionesCancelada")}
                    </ToneBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}