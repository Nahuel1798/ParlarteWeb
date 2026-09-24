"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";
import ToneBadge from "@/components/ui/ToneBadge";
import { Link } from "@/i18n/navigation";
import { listarUsuariosPorRol, UsuarioResponse } from "../../lib/api";

function nivelTone(nivel: string | null) {
  switch (nivel) {
    case "A1_A2":
      return "warning" as const;
    case "B1_B2":
    case "C1_C2":
      return "success" as const;
    default:
      return "neutral" as const;
  }
}

function formatearFecha(fecha: string) {
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdmissionsTable() {
  const t = useTranslations("admin");
  const [alumnos, setAlumnos] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarUsuariosPorRol("ALUMNO")
      .then((data) => {
        if (active) setAlumnos(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : t("admissionsDefaultError")
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
      title={t("admissionsTitle")}
      subtitle={t("admissionsSubtitle")}
      action={
        <Link
          href="/admin/inscripciones"
          className="text-xs font-semibold text-primary transition hover:text-secondary"
        >
          {t("admissionsAction")} →
        </Link>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-10 text-sm text-on-surface-variant">
          {t("admissionsLoading")}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {error}
        </div>
      ) : alumnos.length === 0 ? (
        <div className="py-10 text-center text-sm text-on-surface-variant">
          {t("admissionsEmpty")}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="py-3 pr-6 font-semibold">{t("admissionsHeaderStudent")}</th>
                <th className="px-6 py-3 font-semibold">{t("admissionsHeaderEmail")}</th>
                <th className="px-6 py-3 font-semibold">{t("admissionsHeaderLevel")}</th>
                <th className="py-3 pl-6 font-semibold">{t("admissionsHeaderDate")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-container">
              {alumnos.map((alumno) => (
                <tr key={alumno.id} className="text-sm">
                  <td className="py-3 pr-6 font-semibold">
                    {alumno.nombre}
                    {alumno.apellidos ? ` ${alumno.apellidos}` : ""}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    {alumno.email}
                  </td>
                  <td className="px-6 py-3">
                    <ToneBadge tone={nivelTone(alumno.nivel)}>
                      {alumno.nivel === "A1_A2" && "A1–A2"}
                      {alumno.nivel === "B1_B2" && "B1–B2"}
                      {alumno.nivel === "C1_C2" && "C1–C2"}
                      {!alumno.nivel && t("admissionsLevelNone")}
                    </ToneBadge>
                  </td>
                  <td className="py-3 pl-6 text-on-surface-variant">
                    {formatearFecha(alumno.fechaCreacion)}
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