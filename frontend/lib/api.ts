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