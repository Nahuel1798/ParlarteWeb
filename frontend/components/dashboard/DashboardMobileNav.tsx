"use client";

import { useEffect } from "react";
import SidebarContent from "./SidebarContent";
import type { DashboardConfig } from "./config";

interface DashboardMobileNavProps {
  config: DashboardConfig;
  open: boolean;
  onClose: () => void;
}

export default function DashboardMobileNav({
  config,
  open,
  onClose,
}: DashboardMobileNavProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-y-0 left-0 z-[60] w-72 transform bg-surface-container-low transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent config={config} onNavigate={onClose} />
      </div>
    </>
  );
}