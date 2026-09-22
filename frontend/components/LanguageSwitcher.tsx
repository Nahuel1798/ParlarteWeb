"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const FLAGS: Record<Locale, { src: string; labelKey: string }> = {
  es: { src: "/espana.svg", labelKey: "switchToEs" },
  it: { src: "/italia.svg", labelKey: "switchToIt" },
};

interface LanguageSwitcherProps {
  onChange?: () => void;
}

export default function LanguageSwitcher({ onChange }: LanguageSwitcherProps) {
  const [animating, setAnimating] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const otherLocale = (locale === "es" ? "it" : "es") as Locale;
  const current = FLAGS[locale as Locale];
  const other = FLAGS[otherLocale];

  const switchLocale = () => {
    if (animating) return;

    setAnimating(true);

    setTimeout(() => {
      localStorage.setItem("parlarte_locale", otherLocale);
      router.replace(pathname, { locale: otherLocale });
      setAnimating(false);
      onChange?.();
    }, 480);
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t("switchLocaleAria")}
      title={t(other.labelKey)}
      className={`group relative flex cursor-pointer items-center rounded-full bg-surface-container-low px-1.5 py-1.5 ring-1 ring-outline-variant/60 transition-all duration-300 hover:ring-primary/60 active:scale-[0.96] ${
        animating ? "scale-105" : ""
      }`}
    >
      <span className="block h-9 w-[7.75rem] motion-safe:[perspective:400px]">
        <span
          className={`absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
            animating ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Cara frontal: idioma actual */}
          <span className="absolute inset-0 flex items-center gap-2 px-1.5 [backface-visibility:hidden]">
            <Image
              src={current.src}
              alt=""
              width={30}
              height={20}
              className="h-5 w-[30px] shrink-0 rounded-[4px] object-cover"
            />

            <span className="truncate text-xs font-semibold uppercase tracking-wide text-on-surface-variant transition-colors group-hover:text-on-surface">
              {t(current.labelKey)}
            </span>

            <span className="ml-auto material-symbols-outlined text-[16px] text-primary transition-transform duration-300 group-hover:rotate-180">
              swap_horiz
            </span>
          </span>

          {/* Cara posterior: idioma destino */}
          <span className="absolute inset-0 flex items-center gap-2 px-1.5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={other.src}
              alt=""
              width={30}
              height={20}
              className="h-5 w-[30px] shrink-0 rounded-[4px] object-cover"
            />

            <span className="truncate text-xs font-semibold uppercase tracking-wide text-on-surface">
              {t(other.labelKey)}
            </span>

            <span className="ml-auto material-symbols-outlined text-[16px] text-primary">
              swap_horiz
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}