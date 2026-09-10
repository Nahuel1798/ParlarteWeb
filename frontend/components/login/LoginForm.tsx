"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    try {
      // Acá posteriormente conectamos con Spring Boot
      console.log({
        email,
        password,
        rememberMe,
      });

      // Simulación temporal
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 1800);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Título */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#9d422b]" />
          <span className="text-xs text-[#9d422b] tracking-widest uppercase font-semibold">
            Portal del Estudiante
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1c1c18] leading-tight mb-2">
          Bentornato alla Scuola
        </h1>

        <p className="text-sm sm:text-base text-[#42493e] leading-relaxed">
          Ingresa tus credenciales para acceder a tus módulos de estudio,
          biblioteca de audio y tutorías en vivo.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
          >
            Correo Electrónico
          </label>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#72796e]">
              @
            </span>

            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@scuolaitaliano.edu"
              className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-xs uppercase text-[#42493e] tracking-wider font-semibold"
            >
              Contraseña
            </label>

            <a
              href="#"
              className="text-xs text-[#9d422b] hover:text-[#74250f] font-semibold"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#72796e]">
              🔒
            </span>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
            />

            <button
              type="button"
              aria-label="Mostrar u ocultar contraseña"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#72796e] hover:text-[#1c1c18]"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Recordarme */}
        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#154212]"
            />
            <span className="text-xs text-[#42493e]">
              Recordar mi sesión en este dispositivo
            </span>
          </label>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 py-3 px-6 rounded text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all ${
            success ? "bg-[#2d5a27]" : "bg-[#154212] hover:bg-[#2d5a27]"
          } ${loading ? "opacity-90 cursor-wait" : "cursor-pointer"}`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>

              Verificando credenziali...
            </>
          ) : success ? (
            <>
              ✓
              Accesso Consentito
            </>
          ) : (
            <>
              Iniciar Sesión
              →
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full bg-[#e5e2db] h-px" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-[#42493e] uppercase tracking-wider">
            o continúa con
          </span>
        </div>
      </div>

      {/* Google / Apple */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#f6f3ec] hover:bg-[#f0eee7] text-[#1c1c18] text-xs font-semibold transition-colors"
        >
          <span className="text-sm font-bold">G</span>
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#f6f3ec] hover:bg-[#f0eee7] text-[#1c1c18] text-xs font-semibold transition-colors"
        >
          <span className="text-sm"> Apple ID</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#e5e2db] text-center">
        <p className="text-xs text-[#42493e]">
          ¿Aún no eres alumno?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#154212] hover:text-[#2d5a27] underline underline-offset-4"
          >
            Crea tu cuenta académica
          </Link>
        </p>
      </div>
    </>
  );
}