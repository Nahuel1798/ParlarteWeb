"use client";

import { useEffect, useState } from "react";
import {
  listarCursos,
  listarInscripcionesPorAlumno,
  type CursoResponse,
  type LoginResponse,
} from "./api";
import { useSessionUser } from "./session";

export interface CursosAlumno {
  cursos: CursoResponse[];
  cargando: boolean;
  error: string | null;
  user: LoginResponse | null;
}

export function useCursosAlumno(): CursosAlumno {
  const user = useSessionUser();
  const [cursos, setCursos] = useState<CursoResponse[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;

    Promise.all([listarInscripcionesPorAlumno(user.id), listarCursos()])
      .then(([inscripciones, todos]) => {
        if (!active) return;

        const ids = new Set(
          inscripciones
            .filter((inscripcion) => inscripcion.activa)
            .map((inscripcion) => inscripcion.cursoId)
        );

        setCursos(todos.filter((curso) => ids.has(curso.id)));
        setError(null);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : null);
          setCursos([]);
        }
      })
      .finally(() => {
        if (active) setCargando(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  return { cursos, cargando, error, user };
}
