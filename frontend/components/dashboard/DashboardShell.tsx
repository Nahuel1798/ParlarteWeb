"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileNav from "./DashboardMobileNav";
import DashboardHeader from "./DashboardHeader";
import type { DashboardConfig } from "./config";
import { useSessionUser } from "../../lib/session";

interface DashboardShellProps {
  config: DashboardConfig;
  contentClassName?: string;
  children: ReactNode;
}

export default function DashboardShell({
  config,
  contentClassName = "",
  children,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSessionUser();

  const effectiveConfig: DashboardConfig = {
    ...config,
    roleKey: user?.rol === "ADMINISTRADOR"
      ? "roleAdministrador"
      : user?.rol === "PROFESOR"
        ? "roleProfesor"
        : user?.rol === "ALUMNO"
          ? "roleAlumno"
          : config.roleKey,
    userName: user?.nombre ?? config.userName,
    userTitleKey: config.userTitleKey,
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <DashboardSidebar config={effectiveConfig} />

      <DashboardMobileNav
        config={effectiveConfig}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className={config.contentPadding}>
        <DashboardHeader
          config={effectiveConfig}
          onMenuClick={() => setMenuOpen(true)}
        />

        <main className="min-h-screen w-full px-4 pt-24 md:px-6">
          <div
            className={`mx-auto w-full max-w-[1280px] pb-20 ${contentClassName}`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}