export interface LoginResponse {
  token: string;
  tipo: string;
  email: string;
  nombre: string;
  rol: string;
  id: number;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  apellidos: string | null;
  email: string;
  rol: string;
  nivel: string | null;
  fechaCreacion: string;
}

export interface RegistrarRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol: string;
  nivel: string;
}

export interface CursoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  nivel: string;
  duracionHoras: number;
  horario: string;
  precio: number;
  portadaUrl: string;
  activo: boolean;
  numeroModulos?: number;
  profesor?: {
    id: number;
    nombre: string;
    apellidos: string | null;
    email: string;
  };
}

export interface CrearCursoRequest {
  nombre: string;
  descripcion: string;
  nivel: string;
  duracionHoras: number;
  horario: string;
  precio: number;
  portadaUrl: string;
  activo: boolean;
  numeroModulos: number;
  profesor: { id: number };
}

export interface InscripcionResponse {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  cursoId: number;
  cursoNombre: string;
  fechaInscripcion: string;
  activa: boolean;
}

export interface CrearInscripcionRequest {
  alumnoId: number;
  cursoId: number;
}

export interface ClaseResponse {
  id: number;
  titulo: string;
  descripcion: string;
  modulo: number | null;
  orden: number | null;
  cursoId: number;
}

export interface ClaseRequest {
  titulo: string;
  descripcion: string;
  modulo: number | null;
}

export interface CursoResumenResponse {
  cursoId: number;
  modulos: number;
  clases: number;
  videos: number;
  materiales: number;
  tareas: number;
  tests: number;
}

export interface VideoResponse {
  id: number;
  titulo: string;
  url: string;
  duracionSegundos: number | null;
  claseId: number;
}

export interface VideoRequest {
  titulo: string;
  url: string;
  duracionSegundos: number | null;
}

export interface MaterialResponse {
  id: number;
  titulo: string;
  tipo: string;
  url: string;
  claseId: number;
}

export interface MaterialRequest {
  titulo: string;
  tipo: string;
  url: string;
}

export interface TareaResponse {
  id: number;
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
  claseId: number;
}

export interface TareaRequest {
  titulo: string;
  descripcion: string;
  fechaEntrega: string;
}

export interface RespuestaRequest {
  texto: string;
  correcta: boolean;
}

export interface PreguntaRequest {
  enunciado: string;
  respuestas: RespuestaRequest[];
}

export interface TestRequest {
  titulo: string;
  porcentajeAprobacion: string;
  preguntas: PreguntaRequest[];
}

export interface RespuestaResponse {
  id: number;
  texto: string;
  correcta: boolean;
}

export interface PreguntaResponse {
  id: number;
  enunciado: string;
  respuestas: RespuestaResponse[];
}

export interface TestResponse {
  id: number;
  titulo: string;
  porcentajeAprobacion: string;
  claseId: number;
  preguntas: PreguntaResponse[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al iniciar sesión");
  }

  return data as LoginResponse;
}

export async function registrar(
  request: RegistrarRequest
): Promise<UsuarioResponse> {
  const res = await fetch(`${API_URL}/api/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear la cuenta");
  }

  return data as UsuarioResponse;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("parlarte_token") ??
    sessionStorage.getItem("parlarte_token")
  );
}

export async function listarUsuariosPorRol(
  rol: string
): Promise<UsuarioResponse[]> {
  const res = await fetch(`${API_URL}/api/usuarios/rol/${rol}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() ?? ""}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener los usuarios");
  }

  return data as UsuarioResponse[];
}

export async function subirPortada(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("archivo", file);

  const res = await fetch(`${API_URL}/api/archivos/portada`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al subir la imagen");
  }

  return data.url as string;
}

export async function listarInscripciones(): Promise<InscripcionResponse[]> {
  const res = await fetch(`${API_URL}/api/inscripciones`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener las inscripciones");
  }

  return data as InscripcionResponse[];
}

export async function crearInscripcion(
  request: CrearInscripcionRequest
): Promise<InscripcionResponse> {
  const res = await fetch(`${API_URL}/api/inscripciones`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear la inscripción");
  }

  return data as InscripcionResponse;
}

export async function listarCursos(): Promise<CursoResponse[]> {
  const res = await fetch(`${API_URL}/api/cursos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() ?? ""}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener los cursos");
  }

  return data as CursoResponse[];
}

export async function obtenerCurso(
  cursoId: number
): Promise<CursoResponse> {
  const res = await fetch(`${API_URL}/api/cursos/${cursoId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener el curso");
  }

  return data as CursoResponse;
}

export async function crearCurso(
  request: CrearCursoRequest
): Promise<CursoResponse> {
  const res = await fetch(`${API_URL}/api/cursos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken() ?? ""}`,
    },
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear el curso");
  }

  return data as CursoResponse;
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken() ?? ""}`,
  };
}

export async function listarClases(
  cursoId: number
): Promise<ClaseResponse[]> {
  const res = await fetch(`${API_URL}/api/cursos/${cursoId}/clases`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener las clases");
  }

  return data as ClaseResponse[];
}

export async function crearClase(
  cursoId: number,
  request: ClaseRequest
): Promise<ClaseResponse> {
  const res = await fetch(`${API_URL}/api/cursos/${cursoId}/clases`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear la clase");
  }

  return data as ClaseResponse;
}

export async function actualizarClase(
  cursoId: number,
  claseId: number,
  request: ClaseRequest
): Promise<ClaseResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al actualizar la clase");
  }

  return data as ClaseResponse;
}

export async function reordenarClases(
  cursoId: number,
  orden: number[]
): Promise<void> {
  const res = await fetch(`${API_URL}/api/cursos/${cursoId}/clases/orden`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ orden }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al reordenar las clases");
  }
}

export async function obtenerResumen(
  cursoId: number
): Promise<CursoResumenResponse> {
  const res = await fetch(`${API_URL}/api/cursos/${cursoId}/resumen`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener el resumen del curso");
  }

  return data as CursoResumenResponse;
}

export async function eliminarClase(
  cursoId: number,
  claseId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al eliminar la clase");
  }
}

export async function subirRecurso(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("archivo", file);

  const res = await fetch(`${API_URL}/api/archivos/recurso`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
    body: formData,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al subir el archivo");
  }

  return data.url as string;
}

export async function listarVideos(
  cursoId: number,
  claseId: number
): Promise<VideoResponse[]> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/videos`,
    { method: "GET", headers: authHeaders() }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener los videos");
  }

  return data as VideoResponse[];
}

export async function crearVideo(
  cursoId: number,
  claseId: number,
  request: VideoRequest
): Promise<VideoResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/videos`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear el video");
  }

  return data as VideoResponse;
}

export async function actualizarVideo(
  cursoId: number,
  claseId: number,
  videoId: number,
  request: VideoRequest
): Promise<VideoResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/videos/${videoId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al actualizar el video");
  }

  return data as VideoResponse;
}

export async function eliminarVideo(
  cursoId: number,
  claseId: number,
  videoId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/videos/${videoId}`,
    { method: "DELETE", headers: authHeaders() }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al eliminar el video");
  }
}

export async function listarMateriales(
  cursoId: number,
  claseId: number
): Promise<MaterialResponse[]> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/materiales`,
    { method: "GET", headers: authHeaders() }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener los materiales");
  }

  return data as MaterialResponse[];
}

export async function crearMaterial(
  cursoId: number,
  claseId: number,
  request: MaterialRequest
): Promise<MaterialResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/materiales`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear el material");
  }

  return data as MaterialResponse;
}

export async function actualizarMaterial(
  cursoId: number,
  claseId: number,
  materialId: number,
  request: MaterialRequest
): Promise<MaterialResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/materiales/${materialId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al actualizar el material");
  }

  return data as MaterialResponse;
}

export async function eliminarMaterial(
  cursoId: number,
  claseId: number,
  materialId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/materiales/${materialId}`,
    { method: "DELETE", headers: authHeaders() }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al eliminar el material");
  }
}

export async function listarTareas(
  cursoId: number,
  claseId: number
): Promise<TareaResponse[]> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tareas`,
    { method: "GET", headers: authHeaders() }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener las tareas");
  }

  return data as TareaResponse[];
}

export async function crearTarea(
  cursoId: number,
  claseId: number,
  request: TareaRequest
): Promise<TareaResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tareas`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear la tarea");
  }

  return data as TareaResponse;
}

export async function actualizarTarea(
  cursoId: number,
  claseId: number,
  tareaId: number,
  request: TareaRequest
): Promise<TareaResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tareas/${tareaId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al actualizar la tarea");
  }

  return data as TareaResponse;
}

export async function eliminarTarea(
  cursoId: number,
  claseId: number,
  tareaId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tareas/${tareaId}`,
    { method: "DELETE", headers: authHeaders() }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al eliminar la tarea");
  }
}

export async function listarTests(
  cursoId: number,
  claseId: number
): Promise<TestResponse[]> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tests`,
    { method: "GET", headers: authHeaders() }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener los tests");
  }

  return data as TestResponse[];
}

export async function crearTest(
  cursoId: number,
  claseId: number,
  request: TestRequest
): Promise<TestResponse> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tests`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(request),
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear el test");
  }

  return data as TestResponse;
}

export async function eliminarTest(
  cursoId: number,
  claseId: number,
  testId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/api/cursos/${cursoId}/clases/${claseId}/tests/${testId}`,
    { method: "DELETE", headers: authHeaders() }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al eliminar el test");
  }
}
// ---------- Eventos (calendario) ----------

export interface EventoResponse {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  duracionMinutos: number;
  tipo: string;
  activo: boolean;
  cursoId: number | null;
  cursoNombre: string | null;
  claseId: number | null;
  claseTitulo: string | null;
}

export interface EventoRequest {
  titulo: string;
  descripcion: string;
  fecha: string;
  duracionMinutos: number;
  tipo: string;
  cursoId: number | null;
  claseId: number | null;
}

export async function listarEventos(
  desde: string,
  hasta: string
): Promise<EventoResponse[]> {
  const query = new URLSearchParams({ desde, hasta });
  const res = await fetch(`${API_URL}/api/eventos?${query}`, {
    method: "GET",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al obtener los eventos");
  }

  return data as EventoResponse[];
}

export async function crearEvento(
  request: EventoRequest
): Promise<EventoResponse> {
  const res = await fetch(`${API_URL}/api/eventos`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al crear el evento");
  }

  return data as EventoResponse;
}

export async function actualizarEvento(
  eventoId: number,
  request: EventoRequest
): Promise<EventoResponse> {
  const res = await fetch(`${API_URL}/api/eventos/${eventoId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(request),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error ?? "Error al actualizar el evento");
  }

  return data as EventoResponse;
}

export async function eliminarEvento(eventoId: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/eventos/${eventoId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al eliminar el evento");
  }
}
