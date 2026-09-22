"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  adminConfig,
  docenteConfig,
  estudianteConfig,
  type DashboardConfig,
} from "@/components/dashboard/config";
import { useSessionUser } from "../../lib/session";

function configForRole(rol: string): DashboardConfig {
  if (rol === "ADMINISTRADOR") return adminConfig;
  if (rol === "PROFESOR") return docenteConfig;
  return estudianteConfig;
}

export default function CourseDashboard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useSessionUser();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return (
    <DashboardShell config={configForRole(user.rol)}>{children}</DashboardShell>
  );
}