"use client";

import { useSyncExternalStore } from "react";
import type { LoginResponse } from "./api";

const STORAGE_KEY = "parlarte_user";

/** Se dispara dentro de la misma pestaña al guardar o limpiar la sesión. */
export const SESSION_EVENT = "parlarte:session-change";

/** Se dispara cuando el backend rechaza la sesión (token expirado/revocado). */
export const SESSION_EXPIRED_EVENT = "parlarte:session-expired";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSION_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSION_EVENT, callback);
  };
}

function emitSessionChange() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

function parseUser(raw: string): LoginResponse | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function getStoredUser(): LoginResponse | null {
  if (typeof window === "undefined") return null;
  return parseUser(getSnapshot());
}

export function saveUser(user: LoginResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  emitSessionChange();
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  emitSessionChange();
}

/** Notifica a la app que la sesión dejó de ser válida y hay que ir al login. */
export function notifySessionExpired(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function useSessionUser(): LoginResponse | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return parseUser(raw);
}

function noSuscribir(): () => void {
  return () => {};
}

function getClienteMontado(): boolean {
  return true;
}

function getServidorMontado(): boolean {
  return false;
}

/** `false` durante el render del servidor y la hidratación; `true` después. */
export function useMontado(): boolean {
  return useSyncExternalStore(noSuscribir, getClienteMontado, getServidorMontado);
}
