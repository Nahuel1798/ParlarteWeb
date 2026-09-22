"use client";

import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: "10+", label: t("statYears") },
    { value: "1000+", label: t("statStudents") },
    { value: "A1–C2", label: t("statLevels") },
  ];

  return (
    <section
      id="about"
      className="w-full py-20 bg-surface scroll-mt-[80px]"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <div>
          <span className="font-label-md text-sm font-semibold text-secondary uppercase tracking-wider mb-3 block">
            {t("kicker")}
          </span>

          <h2 className="font-headline-lg text-[32px] md:text-[48px] text-primary mb-6">
            {t("titleLine1")}
            <br />
            <span className="text-secondary italic">{t("titleLine2")}</span>
          </h2>

          <p className="font-body-md text-base text-on-surface-variant mb-6 max-w-xl">
            {t("p1")}
          </p>

          <p className="font-body-md text-base text-on-surface-variant mb-10 max-w-xl">
            {t("p2")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-surface-container-low border border-primary/15 p-5 text-center"
              >
                <p className="font-headline-md text-3xl text-primary mb-1">
                  {stat.value}
                </p>
                <p className="font-body-md text-sm text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[360px] lg:min-h-[480px] rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.trvl-media.com/place/6046257/dfc1097b-fb0b-4d2f-96f5-15d86e72f134.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}