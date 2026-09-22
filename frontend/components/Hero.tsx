"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full min-h-[819px] flex items-center justify-center overflow-hidden bg-surface-container">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.trvl-media.com/place/6046257/dfc1097b-fb0b-4d2f-96f5-15d86e72f134.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-20">
        <div className="max-w-2xl">

          <h1 className="font-display-lg-mobile md:font-display-lg text-[40px] md:text-[64px] leading-tight text-primary mb-6">
            {t("titleLine1")}
            <br />
            <span className="text-secondary italic">
              {t("titleLine2")}
            </span>
          </h1>

          <p className="font-body-lg text-[18px] leading-relaxed text-on-surface-variant mb-12 max-w-xl">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-4">

            <Link
              href="#courses"
              className="inline-flex items-center justify-center bg-primary text-white font-label-md text-sm px-8 py-4 rounded hover:bg-primary-container transition-colors"
            >
              {t("ctaStart")}

              <span className="material-symbols-outlined ml-2 text-[18px]">
                arrow_forward
              </span>
            </Link>

            <Link
              href="#methodology"
              className="inline-flex items-center justify-center border border-primary/20 text-primary font-label-md text-sm px-8 py-4 rounded hover:bg-surface-variant transition-colors"
            >
              {t("ctaMethod")}
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}