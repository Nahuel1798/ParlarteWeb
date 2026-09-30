export type ModoCalendario = "mes" | "semana" | "dia";

export interface RangoFechas {
  desde: Date;
  hasta: Date;
}

export function inicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0, 0);
}

export function finDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59, 999);
}

export function sumarDias(fecha: Date, dias: number): Date {
  const resultado = inicioDelDia(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

/** La semana arranca en lunes. */
export function inicioSemana(fecha: Date): Date {
  const dia = fecha.getDay();
  const desplazamiento = dia === 0 ? -6 : 1 - dia;
  return sumarDias(fecha, desplazamiento);
}

export function finSemana(fecha: Date): Date {
  return finDelDia(sumarDias(inicioSemana(fecha), 6));
}

export function inicioMes(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1, 0, 0, 0, 0);
}

export function finMes(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function sumarMeses(fecha: Date, meses: number): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth() + meses, 1, 0, 0, 0, 0);
}

export function mismoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function claveDia(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Formato que espera LocalDateTime de Spring: 2026-10-06T09:30:00 */
export function aIso(fecha: Date): string {
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  const segundos = String(fecha.getSeconds()).padStart(2, "0");
  return `${claveDia(fecha)}T${horas}:${minutos}:${segundos}`;
}

/** Formato que espera <input type="datetime-local">: 2026-10-06T09:30 */
export function aInputDateTime(fecha: Date): string {
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${claveDia(fecha)}T${horas}:${minutos}`;
}

export function desdeInputDateTime(valor: string): Date | null {
  if (!valor) return null;
  const [fecha, hora] = valor.split("T");
  if (!fecha || !hora) return null;

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [horas, minutos] = hora.split(":").map(Number);
  if ([anio, mes, dia, horas, minutos].some((parte) => Number.isNaN(parte))) {
    return null;
  }

  return new Date(anio, mes - 1, dia, horas, minutos, 0, 0);
}

export function rangoDe(ancla: Date, modo: ModoCalendario): RangoFechas {
  if (modo === "dia") {
    return { desde: inicioDelDia(ancla), hasta: finDelDia(ancla) };
  }

  if (modo === "semana") {
    return { desde: inicioSemana(ancla), hasta: finSemana(ancla) };
  }

  const mes = inicioMes(ancla);
  return { desde: inicioSemana(mes), hasta: finSemana(finMes(mes)) };
}

export function diasDeRango(desde: Date, hasta: Date): Date[] {
  const dias: Date[] = [];
  let cursor = inicioDelDia(desde);
  const limite = inicioDelDia(hasta);

  while (cursor.getTime() <= limite.getTime()) {
    dias.push(cursor);
    cursor = sumarDias(cursor, 1);
  }

  return dias;
}

export function semanasDeMes(ancla: Date): Date[][] {
  const { desde, hasta } = rangoDe(ancla, "mes");
  const dias = diasDeRango(desde, hasta);
  const semanas: Date[][] = [];

  for (let i = 0; i < dias.length; i += 7) {
    semanas.push(dias.slice(i, i + 7));
  }

  return semanas;
}

export function diasDeSemana(ancla: Date): Date[] {
  const inicio = inicioSemana(ancla);
  return Array.from({ length: 7 }, (_, i) => sumarDias(inicio, i));
}

export function avanzar(ancla: Date, modo: ModoCalendario, direccion: 1 | -1): Date {
  if (modo === "dia") return sumarDias(ancla, direccion);
  if (modo === "semana") return sumarDias(ancla, 7 * direccion);
  return sumarMeses(ancla, direccion);
}

export function esHoy(fecha: Date): boolean {
  return mismoDia(fecha, new Date());
}

// ---------- Etiquetas formateadas ----------

function formateador(locale: string, opciones: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, opciones);
}

export function etiquetaPeriodo(ancla: Date, modo: ModoCalendario, locale: string): string {
  if (modo === "dia") {
    return formateador(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(ancla);
  }

  if (modo === "mes") {
    return formateador(locale, { month: "long", year: "numeric" }).format(ancla);
  }

  const dias = diasDeSemana(ancla);
  const primero = dias[0];
  const ultimo = dias[6];
  const mismoMes = primero.getMonth() === ultimo.getMonth();
  const mismoAnio = primero.getFullYear() === ultimo.getFullYear();

  if (mismoMes) {
    const diaPrimero = formateador(locale, { day: "numeric" }).format(primero);
    const resto = formateador(locale, { day: "numeric", month: "short", year: "numeric" }).format(ultimo);
    return `${diaPrimero} – ${resto}`;
  }

  if (mismoAnio) {
    const inicio = formateador(locale, { day: "numeric", month: "short" }).format(primero);
    const fin = formateador(locale, { day: "numeric", month: "short", year: "numeric" }).format(ultimo);
    return `${inicio} – ${fin}`;
  }

  const inicio = formateador(locale, { day: "numeric", month: "short", year: "numeric" }).format(primero);
  const fin = formateador(locale, { day: "numeric", month: "short", year: "numeric" }).format(ultimo);
  return `${inicio} – ${fin}`;
}

export function nombreDiaCorto(fecha: Date, locale: string): string {
  return formateador(locale, { weekday: "short" }).format(fecha);
}

export function nombreDiaLargo(fecha: Date, locale: string): string {
  return formateador(locale, { weekday: "long" }).format(fecha);
}

export function etiquetaDiaCorto(fecha: Date, locale: string): string {
  return formateador(locale, { day: "numeric", month: "short" }).format(fecha);
}

export function etiquetaDiaLargo(fecha: Date, locale: string): string {
  return formateador(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha);
}

export function numeroDia(fecha: Date): string {
  return String(fecha.getDate());
}

export function formatearHora(iso: string, locale: string): string {
  return formateador(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

// ---------- Posicionamiento en la rejilla horaria ----------

export function minutosDesdeMedianoche(fecha: Date): number {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

export interface BloqueEvento<T> {
  evento: T;
  inicio: number;
  fin: number;
  duracion: number;
}

/** Convierte un evento en minutos desde medianoche, acotados a un día. */
export function bloquesDeEventos<
  T extends { id: number; titulo: string; fecha: string; duracionMinutos: number }
>(eventos: T[], dia: Date): BloqueEvento<T>[] {
  const inicioDia = inicioDelDia(dia).getTime();

  return eventos
    .filter((evento) => inicioDelDia(new Date(evento.fecha)).getTime() === inicioDia)
    .map((evento) => {
      const fecha = new Date(evento.fecha);
      const inicio = minutosDesdeMedianoche(fecha);
      const duracion = Math.max(evento.duracionMinutos, 15);
      return { evento, inicio, fin: inicio + duracion, duracion };
    })
    .sort((a, b) => a.inicio - b.inicio || a.evento.id - b.evento.id);
}
