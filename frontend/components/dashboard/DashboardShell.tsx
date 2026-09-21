"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileNav from "./DashboardMobileNav";
import DashboardHeader from "./DashboardHeader";
import type { DashboardConfig } from "./config";
import { useSessionUser } from "../../lib/session";

const roleLabels: Record<string, string> = {
  ADMINISTRADOR: "Amministratore",
  PROFESOR: "Docente",
  ALUMNO: "Studente",
};

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
    roleLabel: user
      ? roleLabels[user.rol] ?? user.rol
      : config.roleLabel,
    userName: user?.nombre ?? config.userName,
    userTitle: user ? user.email : config.userTitle,
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