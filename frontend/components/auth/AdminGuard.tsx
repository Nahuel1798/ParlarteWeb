"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import type { ReactNode } from "react";
import { useSessionUser } from "../../lib/session";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useSessionUser();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.rol !== "ADMINISTRADOR") {
      router.replace("/curso");
    }
  }, [user, router]);

  if (!user || user.rol !== "ADMINISTRADOR") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}