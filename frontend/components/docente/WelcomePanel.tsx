import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/ui/PageHeader";

export default async function WelcomePanel() {
  const t = await getTranslations("docente");

  return (
    <section className="relative mb-8 overflow-hidden rounded-xl bg-surface-container p-6 shadow-sm md:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10">
        <PageHeader
          kicker={t("welcomeKicker")}
          title={t("welcomeTitle")}
          description={t("welcomeDescription")}
          actions={
            <div className="flex flex-col items-start gap-2 md:items-end">
              <Link
                href="/curso"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-base">
                  menu_book
                </span>

                {t("welcomeCatalog")}
              </Link>

              <div className="inline-flex items-center gap-2 rounded-xl bg-primary-fixed px-4 py-3 text-on-primary-fixed shadow-sm">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />

                <span className="font-label-md">{t("welcomeActive")}</span>
              </div>

              <span className="font-caption text-xs text-on-surface-variant">
                {t("welcomeSync")}
              </span>
            </div>
          }
        />
      </div>
    </section>
  );
}