"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full bg-surface-container text-on-surface pt-20 pb-6 mt-20 border-t border-primary/10">

      <div className="w-full px-4 md:px-6 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-headline-md text-2xl text-primary block mb-4"
          >
            Parlarte
          </Link>

          <p className="font-body-md text-base text-on-surface-variant mb-6">
            {t("brandDescription")}
          </p>

          <div className="flex gap-4">
            <Link
              href="#"
              className="text-primary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">
                language
              </span>
            </Link>

            <Link
              href="mailto:contact@example.com"
              className="text-primary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">
                mail
              </span>
            </Link>
          </div>
        </div>

        {/* Programs */}
        <div>
          <h4 className="font-semibold text-sm text-primary mb-4 uppercase tracking-wider">
            {t("programsTitle")}
          </h4>

          <ul className="space-y-3 text-base text-on-surface-variant">
            <li>
              <Link href="#" className="hover:text-secondary">
                {t("program1")}
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                {t("program2")}
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                {t("program3")}
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                {t("program4")}
              </Link>
            </li>
          </ul>
        </div>

        {/* School */}
        <div>
          <h4 className="font-semibold text-sm text-primary mb-4 uppercase tracking-wider">
            {t("schoolTitle")}
          </h4>

          <ul className="space-y-3 text-base text-on-surface-variant">
            <li>
              <Link href="#about" className="hover:text-secondary">
                {t("schoolAbout")}
              </Link>
            </li>

            <li>
              <Link href="#methodology" className="hover:text-secondary">
                {t("schoolMethodology")}
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                {t("schoolTestimonials")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-sm text-primary mb-4 uppercase tracking-wider">
            {t("legalTitle")}
          </h4>

          <ul className="space-y-3 text-base text-on-surface-variant">
            <li>
              <Link href="#" className="hover:text-secondary">
                {t("legalPrivacy")}
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                {t("legalTerms")}
              </Link>
            </li>

            <li>
              <Link href="#" className="hover:text-secondary">
                {t("legalContact")}
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="w-full px-4 md:px-6 max-w-[1280px] mx-auto border-t border-primary/10 pt-6">
        <p className="text-xs text-on-surface-variant text-center md:text-left">
          {t("rights")}
        </p>
      </div>

    </footer>
  );
}