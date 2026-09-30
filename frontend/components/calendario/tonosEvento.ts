export interface TonoEvento {
  chip: string;
  punto: string;
  barra: string;
  icono: string;
}

const NEUTRO: TonoEvento = {
  chip: "bg-surface-container text-on-surface-variant border-outline-variant",
  punto: "bg-outline",
  barra: "bg-outline",
  icono: "event",
};

export const TONOS_EVENTO: Record<string, TonoEvento> = {
  CLASE: {
    chip: "bg-primary/10 text-primary border-primary/30",
    punto: "bg-primary",
    barra: "bg-primary",
    icono: "videocam",
  },
  EVALUACION: {
    chip: "bg-secondary/10 text-secondary border-secondary/30",
    punto: "bg-secondary",
    barra: "bg-secondary",
    icono: "assignment",
  },
  ENTREGA: {
    chip: "bg-tertiary/15 text-tertiary border-tertiary/35",
    punto: "bg-tertiary",
    barra: "bg-tertiary",
    icono: "task_alt",
  },
  TUTORIA: {
    chip: "bg-primary-container/15 text-primary-container border-primary-container/40",
    punto: "bg-primary-container",
    barra: "bg-primary-container",
    icono: "forum",
  },
  ACTIVIDAD: {
    chip: "bg-secondary-container/20 text-on-secondary-container border-secondary-container/50",
    punto: "bg-secondary-container",
    barra: "bg-secondary-container",
    icono: "celebration",
  },
  OTRO: NEUTRO,
};

export const TIPOS_EVENTO = [
  "CLASE",
  "EVALUACION",
  "ENTREGA",
  "TUTORIA",
  "ACTIVIDAD",
  "OTRO",
] as const;

export function tonoDe(tipo: string): TonoEvento {
  return TONOS_EVENTO[tipo] ?? NEUTRO;
}

export const DURACIONES = [
  15, 30, 45, 60, 90, 120, 180, 240,
];
