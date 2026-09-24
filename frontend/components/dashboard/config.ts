export interface MenuItem {
  nameKey: string;
  href: string;
  icon: string;
}

export interface DashboardConfig {
  roleKey: string;
  userTitleKey: string;
  userName: string;
  menuItems: MenuItem[];
  sidebarVisible: string;
  contentPadding: string;
  headerOffset: string;
}

const sidebarVisible = "hidden lg:flex";
const contentPadding = "pl-0 lg:pl-72";
const headerOffset = "left-0 lg:left-72";

export const adminConfig: DashboardConfig = {
  roleKey: "roleAdministrador",
  userName: "Giulia Rinaldi",
  userTitleKey: "adminUserTitle",
  menuItems: [
    { nameKey: "menuPanoramica", href: "/admin", icon: "space_dashboard" },
    { nameKey: "menuCursos", href: "/curso", icon: "menu_book" },
    { nameKey: "menuInscripciones", href: "/admin/inscripciones", icon: "how_to_reg" },
    { nameKey: "menuCalendario", href: "/admin/calendario", icon: "calendar_month" },
    { nameKey: "menuEjercicios", href: "/admin/esercizi", icon: "assignment" },
    { nameKey: "menuBiblioteca", href: "/admin/risorse", icon: "local_library" },
    { nameKey: "menuConversacion", href: "/admin/conversazione", icon: "forum" },
    { nameKey: "menuDocencia", href: "/admin/docenza", icon: "cast_for_education" },
    { nameKey: "menuAdministracion", href: "/admin/struttura", icon: "admin_panel_settings" },
  ],
  sidebarVisible,
  contentPadding,
  headerOffset,
};

export const docenteConfig: DashboardConfig = {
  roleKey: "roleProfesor",
  userName: "Sofia Romano",
  userTitleKey: "docenteUserTitle",
  menuItems: [
    { nameKey: "menuPanoramica", href: "/docente", icon: "space_dashboard" },
    { nameKey: "menuMisCursos", href: "/curso", icon: "menu_book" },
    { nameKey: "menuCalendario", href: "/docente/calendario", icon: "calendar_month" },
    { nameKey: "menuEjercicios", href: "/docente/esercizi", icon: "assignment" },
    { nameKey: "menuBiblioteca", href: "/docente/biblioteca", icon: "local_library" },
    { nameKey: "menuConversacion", href: "/docente/conversazione", icon: "forum" },
    { nameKey: "menuDocencia", href: "/docente/docenza", icon: "cast_for_education" },
    { nameKey: "menuAdministracion", href: "/docente/amministrazione", icon: "admin_panel_settings" },
  ],
  sidebarVisible,
  contentPadding,
  headerOffset,
};

export const estudianteConfig: DashboardConfig = {
  roleKey: "roleAlumno",
  userName: "Marco Bellini",
  userTitleKey: "estudianteUserTitle",
  menuItems: [
    { nameKey: "menuPanoramica", href: "/estudiante", icon: "space_dashboard" },
    { nameKey: "menuMisCursos", href: "/curso", icon: "menu_book" },
    { nameKey: "menuCalendario", href: "/estudiante/calendario", icon: "calendar_month" },
    { nameKey: "menuEjercicios", href: "/estudiante/esercizi", icon: "assignment" },
    { nameKey: "menuBiblioteca", href: "/estudiante/risorse", icon: "local_library" },
    { nameKey: "menuConversacion", href: "/estudiante/conversazione", icon: "forum" },
    { nameKey: "menuDocencia", href: "/estudiante/docenza", icon: "cast_for_education" },
    { nameKey: "menuAdministracion", href: "/estudiante/amministrazione", icon: "admin_panel_settings" },
  ],
  sidebarVisible,
  contentPadding,
  headerOffset,
};