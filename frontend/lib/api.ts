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
  cursoId: number;
}

export interface ClaseRequest {
  titulo: string;
  descripcion: string;
  modulo: number | null;
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