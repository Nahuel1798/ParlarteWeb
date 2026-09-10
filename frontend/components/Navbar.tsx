"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1280px] mx-auto h-[80px]">
        
        {/* Logo */}
        <Link
          href="/"
          className="font-headline-md text-2xl md:text-[32px] font-semibold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          Parlarte
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-primary border-b-2 border-primary pb-1 font-label-md text-sm"
          >
            Inicio
          </Link>

          <Link
            href="#courses"
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            Cursos
          </Link>

          <Link
            href="#methodology"
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            Metodologia
          </Link>

          <Link
            href="#about"
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            Quienes Somos
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-primary hover:opacity-80 transition-opacity font-label-md text-sm px-4 py-2"
          >
            Iniciar Sesión
          </Link>

          <Link
            href="/register"
            className="bg-primary text-white hover:opacity-90 transition-opacity font-label-md text-sm px-6 py-3 rounded"
          >
            Registrarse
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-primary p-2"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-primary/10 px-4 py-6">
          <nav className="flex flex-col gap-5">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>

            <Link href="#courses" onClick={() => setMenuOpen(false)}>
              Cursos
            </Link>

            <Link href="#methodology" onClick={() => setMenuOpen(false)}>
              Metodologia
            </Link>

            <Link href="#about" onClick={() => setMenuOpen(false)}>
              Quienes Somos
            </Link>

            <hr className="border-primary/10" />

            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Iniciar Sesión
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="bg-primary text-white px-6 py-3 rounded text-center"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}