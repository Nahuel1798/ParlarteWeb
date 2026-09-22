import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PageHeader from "@/components/ui/PageHeader";

export default async function WelcomeHeader() {
  const t = await getTranslations("estudiante");

  return (
    <PageHeader
      kicker={t("welcomeKicker")}
      title={t("welcomeTitle")}
      description={t("welcomeDescription")}
      actions={
        <>
          <Link
            href="/curso"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-base">
              menu_book
            </span>

            {t("welcomeCatalog")}
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary-container text-lg font-semibold text-on-tertiary-container">
              B1
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-on-surface-variant">
                {t("welcomeLevelLabel")}
              </span>

              <span className="text-xs font-semibold text-primary">
                {t("welcomeLevelValue")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-3 py-2 shadow-sm">
            <span className="material-symbols-outlined text-[24px] text-secondary">
              local_fire_department
            </span>

            <div>
              <span className="block text-[11px] text-on-surface-variant">
                {t("welcomeStreakLabel")}
              </span>

              <span className="text-xs font-semibold">
                {t("welcomeStreakValue")}
              </span>
            </div>
          </div>
        </>
      }
    />
  );
}