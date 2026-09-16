export interface MenuItem {
  name: string;
  href: string;
  icon: string;
}

export interface DashboardConfig {
  roleLabel: string;
  userName: string;
  userTitle: string;
  menuItems: MenuItem[];
  sidebarVisible: string;
  contentPadding: string;
  headerOffset: string;
}

const sidebarVisible = "hidden lg:flex";
const contentPadding = "pl-0 lg:pl-72";
const headerOffset = "left-0 lg:left-72";

export const adminConfig: DashboardConfig = {
  roleLabel: "Amministratore",
  userName: "Giulia Rinaldi",
  userTitle: "Direttrice Accademica",
  menuItems: [
    { name: "Panoramica", href: "/admin", icon: "space_dashboard" },
    { name: "I Corsi", href: "/curso", icon: "menu_book" },
    { name: "Calendario", href: "/admin/calendario", icon: "calendar_month" },
    { name: "Esercizi e Voti", href: "/admin/esercizi", icon: "assignment" },
    { name: "Biblioteca Risorse", href: "/admin/risorse", icon: "local_library" },
    { name: "Club di Conversazione", href: "/admin/conversazione", icon: "forum" },
    { name: "Docenza & Aule", href: "/admin/docenza", icon: "cast_for_education" },
    { name: "Amministrazione", href: "/admin/struttura", icon: "admin_panel_settings" },
  ],
  sidebarVisible,
  contentPadding,
  headerOffset,
};

export const docenteConfig: DashboardConfig = {
  roleLabel: "Docente",
  userName: "Sofia Romano",
  userTitle: "Docente",
  menuItems: [
    { name: "Panoramica", href: "/docente", icon: "space_dashboard" },
    { name: "I Miei Corsi", href: "/curso", icon: "menu_book" },
    { name: "Calendario", href: "/docente/calendario", icon: "calendar_month" },
    { name: "Esercizi e Voti", href: "/docente/esercizi", icon: "assignment" },
    { name: "Biblioteca Risorse", href: "/docente/biblioteca", icon: "local_library" },
    { name: "Club di Conversazione", href: "/docente/conversazione", icon: "forum" },
    { name: "Docenza & Aule", href: "/docente/docenza", icon: "cast_for_education" },
    { name: "Amministrazione", href: "/docente/amministrazione", icon: "admin_panel_settings" },
  ],
  sidebarVisible,
  contentPadding,
  headerOffset,
};

export const estudianteConfig: DashboardConfig = {
  roleLabel: "Studente",
  userName: "Marco Bellini",
  userTitle: "Livello B2 Avanzato",
  menuItems: [
    { name: "Panoramica", href: "/estudiante", icon: "space_dashboard" },
    { name: "I Miei Corsi", href: "/curso", icon: "menu_book" },
    { name: "Calendario", href: "/estudiante/calendario", icon: "calendar_month" },
    { name: "Esercizi e Voti", href: "/estudiante/esercizi", icon: "assignment" },
    { name: "Biblioteca Risorse", href: "/estudiante/risorse", icon: "local_library" },
    { name: "Club di Conversazione", href: "/estudiante/conversazione", icon: "forum" },
    { name: "Docenza & Aule", href: "/estudiante/docenza", icon: "cast_for_education" },
    { name: "Amministrazione", href: "/estudiante/amministrazione", icon: "admin_panel_settings" },
  ],
  sidebarVisible,
  contentPadding,
  headerOffset,
};