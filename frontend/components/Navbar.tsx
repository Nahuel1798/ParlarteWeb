"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <header className="bg-surface/95 backdrop-blur-md sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-[1280px] mx-auto h-[80px]">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/imagen/parlarte.png"
            alt="Parlarte"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full"
          />

          <span className="font-headline-md text-2xl md:text-[32px] font-semibold text-primary">
            Parlarte
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-primary border-b-2 border-primary pb-1 font-label-md text-sm"
          >
            {t("inicio")}
          </Link>

          <Link
            href="#courses"
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            {t("cursos")}
          </Link>

          <Link
            href="#methodology"
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            {t("metodologia")}
          </Link>

          <Link
            href="#about"
            className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            {t("quienesSomos")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="text-primary hover:opacity-80 transition-opacity font-label-md text-sm px-4 py-2"
          >
            {t("iniciarSesion")}
          </Link>

          <Link
            href="/register"
            className="bg-primary text-white hover:opacity-90 transition-opacity font-label-md text-sm px-6 py-3 rounded"
          >
            {t("registrarse")}
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-primary p-2"
          aria-label={t("menuAria")}
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
              {t("inicio")}
            </Link>

            <Link href="#courses" onClick={() => setMenuOpen(false)}>
              {t("cursos")}
            </Link>

            <Link href="#methodology" onClick={() => setMenuOpen(false)}>
              {t("metodologia")}
            </Link>

            <Link href="#about" onClick={() => setMenuOpen(false)}>
              {t("quienesSomos")}
            </Link>

            <hr className="border-primary/10" />

            <LanguageSwitcher onChange={() => setMenuOpen(false)} />

            <Link href="/login" onClick={() => setMenuOpen(false)}>
              {t("iniciarSesion")}
            </Link>

            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="bg-primary text-white px-6 py-3 rounded text-center"
            >
              {t("registrarse")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}