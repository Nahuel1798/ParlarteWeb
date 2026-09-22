"use client";

import { useTranslations } from "next-intl";

export default function Methodology() {
  const t = useTranslations("methodology");

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Description"),
      icon: "record_voice_over",
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Description"),
      icon: "forum",
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Description"),
      icon: "verified",
    },
    {
      number: "04",
      title: t("step4Title"),
      description: t("step4Description"),
      icon: "holiday_village",
    },
  ];

  return (
    <section
      id="methodology"
      className="w-full py-20 bg-surface-container-low scroll-mt-[80px]"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">

        <div className="text-center mb-12">
          <span className="font-label-md text-sm font-semibold text-secondary uppercase tracking-wider mb-3 block">
            {t("kicker")}
          </span>

          <h2 className="font-headline-lg text-[32px] md:text-[48px] text-primary mb-4">
            {t("title")}
          </h2>

          <p className="font-body-md text-base text-on-surface-variant max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group rounded-xl bg-surface border border-primary/15 p-7 flex flex-col hover:border-secondary transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    {step.icon}
                  </span>
                </span>

                <span className="font-headline-md text-4xl text-primary/20 group-hover:text-secondary/60 transition-colors">
                  {step.number}
                </span>
              </div>

              <h3 className="font-headline-md text-xl text-primary mb-3">
                {step.title}
              </h3>

              <p className="font-body-md text-base text-on-surface-variant">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}