"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ToneBadge from "@/components/ui/ToneBadge";
import { CursoResponse, listarCursos } from "../../lib/api";

function nivelTone(nivel: string) {
  if (nivel === "A1" || nivel === "A2") return "warning" as const;
  return "success" as const;
}

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(precio);
}

export default function CoursesTable() {
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    listarCursos()
      .then((data) => {
        if (active) setCursos(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Error al cargar los cursos"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Card
      title="Cataloghi Corsi"
      subtitle="Offerta formativa della scuola"
      action={
        <Link
          href="/curso"
          className="text-xs font-semibold text-primary transition hover:text-secondary"
        >
          Gestisci corsi →
        </Link>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-10 text-sm text-on-surface-variant">
          Caricamento corsi…
        </div>
      ) : error ? (
        <div className="rounded-lg bg-secondary/10 px-4 py-6 text-sm text-secondary">
          {error}
        </div>
      ) : cursos.length === 0 ? (
        <div className="py-10 text-center text-sm text-on-surface-variant">
          Nessun corso registrato.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                <th className="py-3 pr-6 font-semibold">Corso</th>
                <th className="px-6 py-3 font-semibold">Livello</th>
                <th className="px-6 py-3 font-semibold">Docente</th>
                <th className="px-6 py-3 font-semibold">Orario</th>
                <th className="px-6 py-3 font-semibold">Durata</th>
                <th className="px-6 py-3 font-semibold">Prezzo</th>
                <th className="py-3 pl-6 font-semibold">Stato</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-container">
              {cursos.map((curso) => (
                <tr key={curso.id} className="text-sm">
                  <td className="py-3 pr-6 font-semibold">{curso.nombre}</td>
                  <td className="px-6 py-3">
                    <ToneBadge tone={nivelTone(curso.nivel)}>
                      {curso.nivel}
                    </ToneBadge>
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    {curso.profesor
                      ? `${curso.profesor.nombre}${
                          curso.profesor.apellidos
                            ? ` ${curso.profesor.apellidos}`
                            : ""
                        }`
                      : "—"}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    {curso.horario}
                  </td>
                  <td className="px-6 py-3 text-on-surface-variant">
                    {curso.duracionHoras} h
                  </td>
                  <td className="px-6 py-3 font-semibold">
                    {formatearPrecio(curso.precio)}
                  </td>
                  <td className="py-3 pl-6">
                    <ToneBadge tone={curso.activo ? "success" : "neutral"}>
                      {curso.activo ? "Attivo" : "Archiviato"}
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