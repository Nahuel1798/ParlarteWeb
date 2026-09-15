"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Panoramica",
    href: "/dashboard",
    icon: "space_dashboard",
  },
  {
    name: "I Miei Corsi",
    href: "/dashboard/cursos",
    icon: "menu_book",
  },
  {
    name: "Calendario",
    href: "/dashboard/calendario",
    icon: "calendar_month",
  },
  {
    name: "Esercizi e Voti",
    href: "/dashboard/ejercicios",
    icon: "assignment",
  },
  {
    name: "Biblioteca Risorse",
    href: "/dashboard/recursos",
    icon: "local_library",
  },
  {
    name: "Club di Conversazione",
    href: "/dashboard/comunidad",
    icon: "forum",
  },
  {
    name: "Docenza & Aule",
    href: "/dashboard/docencia",
    icon: "cast_for_education",
  },
  {
    name: "Amministrazione",
    href: "/dashboard/admin",
    icon: "admin_panel_settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden lg:flex h-screen w-72 flex-col justify-between bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      
      <div>
        {/* Logo */}
        <div className="flex h-20 items-center px-6">
          <div className="flex flex-col">
            <span className="font-headline-md text-xl font-semibold leading-tight text-primary">
              Scuola d&apos;Italiano
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
              Ruolo Attivo
            </span>

            <span className="rounded bg-primary-container px-2 py-1 text-xs font-semibold text-on-primary">
              Studente
            </span>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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
              <span className="text-xs font-semibold">
                Marco Bellini
              </span>

              <span className="text-[11px] text-on-surface-variant">
                Livello B2 Avanzato
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
    </aside>
  );
}