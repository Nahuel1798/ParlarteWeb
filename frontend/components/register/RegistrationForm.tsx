
"use client";

import { useState } from "react";
import SocialSignup from "./SocialSignup";

export default function RegistrationForm() {

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
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

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log(formData);

    // Próximo paso:
    // enviar estos datos al backend Spring Boot.
  };

  return (
    <div>

      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-2 text-[#9d422b]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#9d422b]" />
        <span className="text-xs tracking-widest uppercase font-semibold">
          Immatricolazione Studente
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1c1c18] leading-tight mb-2">
        Crea tu Cuenta
      </h1>

      <p className="text-sm sm:text-base text-[#42493e] leading-relaxed mb-6">
        Únete a nuestra comunidad académica y formaliza
        tu ingreso al estudio del idioma.
      </p>

      {/* Google / Apple */}
      <SocialSignup />

      {/* Separador */}
      <div className="relative flex items-center justify-center mb-6">

        <div className="w-full bg-[#e5e2db] h-px" />

        <span className="absolute bg-white px-2 text-xs text-[#42493e] uppercase tracking-wider">
          O mediante formulario
        </span>

      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* Nombre y apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

          <div className="space-y-xs">

            <label
              htmlFor="nombre"
              className="block text-xs uppercase text-[#42493e] mb-2 tracking-wider font-semibold"
            >
              Nombre
            </label>

            <input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="p. ej. Matteo"
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
              Apellidos
            </label>

            <input
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="p. ej. Rossi"
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
            Correo Electrónico
          </label>

          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="estudiante@accademia.it"
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
            Nivel de Conocimiento Actual
          </label>

          <select
            id="nivel"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 bg-[#f6f3ec] rounded text-sm text-[#1c1c18] placeholder-[#72796e] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#154212] transition-all cursor-pointer"
          >

            <option value="none">
              Sin conocimientos previos
              (Principiante assoluto)
            </option>

            <option value="a1-a2">
              Elementale / Base (A1 - A2)
            </option>

            <option value="b1-b2">
              Intermedio / Fluente (B1 - B2)
            </option>

            <option value="c1-c2">
              Avanzado / Perfezionamento (C1 - C2)
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
              Contraseña
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
              Confirmar Contraseña
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
            Mín. 8 letras y números
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
              Acepto el{" "}
              <a
                href="/reglamento"
                className="text-[#154212] underline"
              >
                Reglamento Académico
              </a>{" "}
              y la{" "}
              <a
                href="/privacidad"
                className="text-[#154212] underline"
              >
                Política de Privacidad
              </a>{" "}
              de la Scuola.
            </span>

          </label>

        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full mt-4 py-3 px-6 bg-[#154212] hover:bg-[#2d5a27] text-white rounded font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition"
        >

          <span>
            Crear Mi Cuenta Académica
          </span>

          <span>
            →
          </span>

        </button>

      </form>

    </div>
  );
}

