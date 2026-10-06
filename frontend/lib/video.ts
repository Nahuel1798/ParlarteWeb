/**
 * Helpers para trabajar con videos en el navegador.
 *
 * La duración se obtiene leyendo los metadatos con un elemento <video>
 * descartable. Cuando no se puede (URL externa sin CORS, archivo corrupto,
 * timeout) se devuelve `null` y el docente la carga a mano.
 */

const TIMEOUT_METADATOS_MS = 8000;

export const MAX_SIZE_VIDEO_BYTES = 500 * 1024 * 1024;

export const TIPOS_VIDEO_MP4 = ["video/mp4", "video/m4v", "video/x-m4v"];

/** Extensiones que se pueden reproducir con un <video> embebido. */
const EXTENSIONES_REPRODUCTIBLES = /\.(mp4|m4v|webm|ogv|mov)(?:$|[?#])/i;

/**
 * Indica si la URL apunta a un archivo de video que se puede embeber
 * en la página. Las URLs de YouTube/Vimeo son páginas HTML, no medios,
 * así que se siguen mostrando como enlace externo.
 */
export function esUrlVideoDirecto(url: string): boolean {
  return EXTENSIONES_REPRODUCTIBLES.test(url.trim());
}

export function esArchivoMp4(file: File): boolean {
  const tipo = (file.type || "").toLowerCase();

  return TIPOS_VIDEO_MP4.includes(tipo) || /\.mp4$/i.test(file.name);
}

function leerMetadatos(fuente: string): Promise<number | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    let resuelto = false;

    const finalizar = (segundos: number | null) => {
      if (resuelto) return;
      resuelto = true;

      clearTimeout(timer);
      video.onloadedmetadata = null;
      video.onerror = null;
      video.removeAttribute("src");
      video.load();

      resolve(segundos);
    };

    const timer = setTimeout(() => finalizar(null), TIMEOUT_METADATOS_MS);

    video.onloadedmetadata = () => {
      const duracion = video.duration;

      // Los streams en vivo reportan Infinity y no son videos con duración.
      finalizar(
        Number.isFinite(duracion) && duracion > 0 ? Math.round(duracion) : null
      );
    };

    video.onerror = () => finalizar(null);

    video.src = fuente;
  });
}

/**
 * Lee la duración de un archivo local. Al ser un blob del propio origen
 * siempre funciona, incluso si el backend está en otro dominio.
 */
export async function obtenerDuracionArchivo(file: File): Promise<number | null> {
  const objectUrl = URL.createObjectURL(file);

  try {
    return await leerMetadatos(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Lee la duración desde una URL. Devuelve `null` si el navegador no puede
 * acceder a los metadatos (CORS, la URL no es un archivo de video, etc.).
 */
export async function obtenerDuracionUrl(url: string): Promise<number | null> {
  return await leerMetadatos(url);
}

/** Convierte "90" / 90 en 90, o en null si el valor no es utilizable. */
export function normalizarDuracion(valor: string): number | null {
  const trimmed = valor.trim();

  if (trimmed === "") return null;

  const segundos = Number(trimmed);

  if (!Number.isFinite(segundos) || segundos < 0) return null;

  return Math.round(segundos);
}