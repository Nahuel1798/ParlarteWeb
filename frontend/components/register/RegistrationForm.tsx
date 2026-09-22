"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import SocialSignup from "./SocialSignup";
import { registrar } from "../../lib/api";

const NIVEL_MAP: Record<string, string> = {
  none: "NINGUNO",
  "a1-a2": "A1_A2",
  "b1-b2": "B1_B2",
  "c1-c2": "C1_C2",
};

export default function RegistrationForm() {
  const router = useRouter();
  const t = useTranslations("auth.registrationForm");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    nivel: "none",
    password: "",
    confirmPassword: "",
    aceptaTerminos: true,
    newsletter: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError(t("mismatchError"));
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registrar({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        rol: "ALUMNO",
        nivel: NIVEL_MAP[formData.nivel] ?? "NINGUNO",
      });

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("defaultError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-2 text-[#9d422b]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9d422b]" />
        <span className="text-xs tracking-widest uppercase font-semibold">
          {t("badge")}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1c1c18] leading-tight mb-2">
        {t("title")}
      </h1>

      <p className="text-sm sm:text-base text-[#42493e] leading-relaxed mb-6">
        {t("subtitle")}
      </p>

      {/* Google */}
      <SocialSignup />

      {/* Separador */}
      <div className="relative flex items-center justify-center mb-6">

        <div className="w-full bg-[#e5e2db] h-px" />

        <span className="absolute bg-white px-2 text-xs text-[#42493e] uppercase tracking-wider">
          {t("separator")}
        </span>

      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* Éxito */}
      {success && (
        <div className="px-4 py-3 rounded bg-green-50 border border-green-200 text-sm text-green-700 mb-4">
          ✓ {t("successMessage")}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre y apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

          <div className="space-y-xs">

            <label
              htmlFor="nombre"
              className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
            >
              {t("firstNameLabel")}
            </label>

            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder={t("firstNamePlaceholder")}
              type="text"
              required
              className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
            />

          </div>

          <div className="space-y-xs">

            <label
              htmlFor="apellidos"
              className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
            >
              {t("lastNameLabel")}
            </label>

            <input
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder={t("lastNamePlaceholder")}
              type="text"
              required
              className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
            />

          </div>

        </div>

        {/* Email */}
        <div className="space-y-xs">

          <label
            htmlFor="email"
            className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
          >
            {t("emailLabel")}
          </label>

          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("emailPlaceholder")}
            type="email"
            required
            className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
          />

        </div>

        {/* Nivel */}
        <div className="space-y-xs">

          <label
            htmlFor="nivel"
            className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
          >
            {t("levelLabel")}
          </label>

          <select
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all cursor-pointer"
          >

            <option value="none">
              {t("levelNone")}
            </option>

            <option value="a1-a2">
              {t("levelBase")}
            </option>

            <option value="b1-b2">
              {t("levelIntermediate")}
            </option>

            <option value="c1-c2">
              {t("levelAdvanced")}
            </option>

          </select>

        </div>

        {/* Contraseñas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

          <div className="space-y-xs">

            <label
              htmlFor="password"
              className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
            >
              {t("passwordLabel")}
            </label>

            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
            />

          </div>

          <div className="space-y-xs">

            <label
              htmlFor="confirmPassword"
              className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
            >
              {t("confirmPasswordLabel")}
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all"
            />

          </div>

        </div>

        {/* Seguridad */}
        <div className="flex items-center space-x-2 pt-1">

          <div className="flex space-x-1 flex-1">

            <div className="h-1 flex-1 bg-[#154212] rounded-full" />
            <div className="h-1 flex-1 bg-[#154212] rounded-full" />
            <div className="h-1 flex-1 bg-[#e5e2db] rounded-full" />
            <div className="h-1 flex-1 bg-[#e5e2db] rounded-full" />

          </div>

          <span className="text-xs text-[#42493e]">
            {t("securityHint")}
          </span>

        </div>

        {/* Términos */}
        <div className="space-y-1 pt-1">

          <label className="flex items-start space-x-2 cursor-pointer select-none">

            <input
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              type="checkbox"
              required
              className="mt-1 accent-[#154212]"
            />

            <span className="text-xs text-[#42493e] leading-relaxed">
              {t("termsIntro")}{" "}
              <Link
                href="/reglamento"
                className="text-[#154212] underline"
              >
                {t("termsReglamento")}
              </Link>{" "}
              {t("termsAnd")}{" "}
              <Link
                href="/privacidad"
                className="text-[#154212] underline"
              >
                {t("termsPrivacy")}
              </Link>{" "}
              {t("termsOutro")}
            </span>

          </label>

        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading || success}
          className={`w-full mt-4 py-3 px-6 rounded text-white font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all ${
            success
              ? "bg-[#2d5a27] cursor-default"
              : "bg-[#154212] hover:bg-[#2d5a27] cursor-pointer"
          } ${loading ? "opacity-90 cursor-wait" : ""}`}
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
              {t("creating")}
            </>
          ) : success ? (
            <>✓ {t("created")}</>
          ) : (
            <>
              {t("submit")}
              →
            </>
          )}
        </button>

      </form>

    </div>
  );
}