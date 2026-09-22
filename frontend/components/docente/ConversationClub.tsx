import { getTranslations } from "next-intl/server";

export default async function ConversationClub() {
  const t = await getTranslations("docente");

  return (
    <section className="relative rounded-xl overflow-hidden shadow-sm h-64 flex flex-col justify-end p-6">

      <div
        className="bg-cover bg-center absolute inset-0"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcW_xAEqv01JUXfupUpIg3hvAU6beDVIbuvb0Wylg1Cob8qcMPUFtfnaeY6wXnIbJdnAx_PNUg0F8OiCVETUky8ZB0q5uIAKouA09Fzv3p5iiAI8WDIKqVr5as1b9mwaE4W4x1ei53r33IQo36AxeuE4L3Ls4GLM0ozVc3HxDisSW-wpLH4MYgYiAwuVqgOWEjvV8F4H_y5imgkF9bD0tD89SaMMq3B-TSIQCxZfZkr6V239fhLloG')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

      <div className="relative z-10 flex flex-col gap-1 text-on-primary">

        <span className="font-caption uppercase tracking-widest text-[11px] font-semibold opacity-90">
          {t("clubKicker")}
        </span>

        <h4 className="font-headline-md text-xl font-semibold">
          {t("clubTitle")}
        </h4>

        <p className="text-xs opacity-90">
          {t("clubDescription")}
        </p>

        <button
          type="button"
          className="mt-2 bg-surface-container-lowest text-primary px-4 py-2 rounded font-label-md self-start shadow-sm hover:bg-surface-bright transition-colors"
        >
          {t("clubButton")}
        </button>

      </div>

    </section>
  );
}