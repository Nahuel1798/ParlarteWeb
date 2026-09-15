"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Panoramica",
    href: "/admin",
    icon: "space_dashboard",
  },
  {
    name: "I Miei Corsi",
    href: "/admin/corsi",
    icon: "menu_book",
  },
  {
    name: "Calendario",
    href: "/admin/calendario",
    icon: "calendar_month",
  },
  {
    name: "Esercizi e Voti",
    href: "/admin/esercizi",
    icon: "assignment",
  },
  {
    name: "Biblioteca Risorse",
    href: "/admin/recursos",
    icon: "local_library",
  },
  {
    name: "Club di Conversazione",
    href: "/admin/comunidad",
    icon: "forum",
  },
  {
    name: "Docenza & Aule",
    href: "/admin/docencia",
    icon: "cast_for_education",
  },
  {
    name: "Amministrazione",
    href: "/admin",
    icon: "admin_panel_settings",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#f6f3ec] hidden lg:flex flex-col justify-between z-50">

      <div>

        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <div className="flex flex-col">
            <span className="font-playfair text-xl text-[#154212] font-semibold">
              Scuola d'Italiano
            </span>

            <span className="text-[10px] text-[#9d422b] uppercase tracking-widest mt-1 font-semibold">
              Accademia Culturale
            </span>
          </div>
        </div>

        {/* Rol */}
        <div className="px-6 mb-6">
          <div className="bg-[#ebe8e1] rounded-xl p-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider pl-2 text-[#42493e]">
              Ruolo Attivo
            </span>

            <span className="bg-[#2d5a27] text-white text-xs px-2 py-1 rounded">
              Studente
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-semibold transition ${
                  active
                    ? "bg-[#154212] text-white"
                    : "text-[#42493e] hover:bg-[#ebe8e1]"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
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
        <div className="bg-[#f0eee7] rounded-xl p-2 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#154212] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">
                person
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold">
                Marco Bellini
              </span>

              <span className="text-[11px] text-[#42493e]">
                Livello B2 Avanzato
              </span>
            </div>
          </div>

          <button>
            <span className="material-symbols-outlined text-[#42493e]">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}