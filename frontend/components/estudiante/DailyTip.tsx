import { getTranslations } from "next-intl/server";

export default async function DailyTip() {
  const t = await getTranslations("estudiante");

  return (
    <section className="mt-6 flex flex-col items-center justify-between gap-6 rounded-xl bg-surface-container-low p-6 shadow-sm md:flex-row">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[28px]">
            lightbulb
          </span>
        </div>

        <div>
          <h3 className="font-headline-md text-lg font-semibold text-primary">
            {t("tipTitle")}
          </h3>

          <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
            {t.rich("tipText", {
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>
        </div>

      </div>

      <button className="flex-shrink-0 rounded bg-primary px-5 py-3 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container">
        {t("tipButton")}
      </button>

    </section>
  );
}