"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { obtenerUsuarioActual } from "../../lib/api";
import {
  getStoredUser,
  SESSION_EXPIRED_EVENT,
} from "../../lib/session";

const RUTAS_PROTEGIDAS = ["/admin", "/docente", "/estudiante", "/curso"];

function esRutaProtegida(pathname: string): boolean {
  return RUTAS_PROTEGIDAS.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`)
  );
}

/**
 * Vigila la sesión: redirige al login cuando el backend la rechaza y valida
 * silenciosamente el token al entrar a una ruta protegida.
 */
export default function AuthWatcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => router.replace("/login");

    window.addEventListener(SESSION_EXPIRED_EVENT, handler);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
  }, [router]);

  useEffect(() => {
    if (!esRutaProtegida(pathname) || !getStoredUser()) return;

    obtenerUsuarioActual().catch(() => {
      // El apiFetch ya limpia la sesión y emite SESSION_EXPIRED_EVENT.
    });
  }, [pathname]);

  return null;
}
