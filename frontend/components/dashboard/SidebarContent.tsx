"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardConfig } from "./config";

interface SidebarContentProps {
  config: DashboardConfig;
  onNavigate?: () => void;
}

export default function SidebarContent({
  config,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="flex h-20 items-center px-6">
          <div className="flex flex-col">
            <span className="font-headline-md text-xl font-semibold leading-tight text-primary">
              Parlarte
            </span>

            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-secondary">
              Accademia Culturale
            </span>
          </div>
        </div>

        {/* Rol */}
        <div className="mb-6 px-6">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-high p-1">
            <span className="pl-2 text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
              Rol
            </span>

            <span className="rounded bg-primary px-2 py-1 text-xs font-semibold text-on-primary">
              {config.roleLabel}
            </span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 px-3">
          {config.menuItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Usuario */}
      <div className="p-6">
        <div className="flex items-center justify-between rounded-xl bg-surface-container p-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                person
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold">{config.userName}</span>

              <span className="text-[11px] text-on-surface-variant">
                {config.userTitle}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}