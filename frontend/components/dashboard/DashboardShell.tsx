"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileNav from "./DashboardMobileNav";
import DashboardHeader from "./DashboardHeader";
import type { DashboardConfig } from "./config";

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

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <DashboardSidebar config={config} />

      <DashboardMobileNav
        config={config}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className={config.contentPadding}>
        <DashboardHeader config={config} onMenuClick={() => setMenuOpen(true)} />

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