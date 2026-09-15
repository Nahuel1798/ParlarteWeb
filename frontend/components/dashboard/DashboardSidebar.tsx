"use client";

import SidebarContent from "./SidebarContent";
import type { DashboardConfig } from "./config";

interface DashboardSidebarProps {
  config: DashboardConfig;
}

export default function DashboardSidebar({ config }: DashboardSidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-72 shadow-[0_1px_8px_rgba(0,0,0,0.04)] ${config.sidebarVisible}`}
    >
      <SidebarContent config={config} />
    </aside>
  );
}