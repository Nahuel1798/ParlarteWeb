"use client";

import { useSyncExternalStore } from "react";
import type { LoginResponse } from "./api";

const EMPTY = "";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionValue(): string {
  return (
    sessionStorage.getItem("parlarte_user") ??
    localStorage.getItem("parlarte_user") ??
    EMPTY
  );
}

function getServerSnapshot(): string {
  return EMPTY;
}

function parseUser(raw: string): LoginResponse | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function useSessionUser(): LoginResponse | null {
  const raw = useSyncExternalStore(
    subscribe,
    getSessionValue,
    getServerSnapshot
  );

  return parseUser(raw);
}