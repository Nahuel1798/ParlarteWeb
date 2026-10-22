"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_PREFIX = "parlarte_cursos_visitados_";

/** Se dispara dentro de la misma pestaña al registrar una visita. */
export const VISITAS_EVENT = "parlarte:visitas-change";

function storageKey(userId: number) {
  return `${STORAGE_PREFIX}${userId}`;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(VISITAS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(VISITAS_EVENT, callback);
  };
}

function parseIds(raw: string): number[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
}

export function obtenerCursosVisitados(userId: number): number[] {
  if (typeof window === "undefined") return [];
  return parseIds(localStorage.getItem(storageKey(userId)) ?? "");
}

export function registrarVisitaCurso(userId: number, cursoId: number): void {
  if (typeof window === "undefined") return;

  const actuales = obtenerCursosVisitados(userId);
  if (actuales.includes(cursoId)) return;

  localStorage.setItem(storageKey(userId), JSON.stringify([...actuales, cursoId]));
  window.dispatchEvent(new Event(VISITAS_EVENT));
}

export function useCursosVisitados(userId: number | null): number[] {
  const raw = useSyncExternalStore(
    subscribe,
    () =>
      userId === null ? "" : localStorage.getItem(storageKey(userId)) ?? "",
    () => ""
  );

  return useMemo(() => parseIds(raw), [raw]);
}
