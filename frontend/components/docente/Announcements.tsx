import { getTranslations } from "next-intl/server";
import Card from "@/components/ui/Card";

const announcements = [
  {
    titleKey: "announcements1Title",
    dateKey: "announcements1Date",
    textKey: "announcements1Text",
    actionKey: "announcements1Action",
    icon: "download",
  },
  {
    titleKey: "announcements2Title",
    dateKey: "announcements2Date",
    textKey: "announcements2Text",
    actionKey: "announcements2Action",
    icon: "open_in_new",
  },
];

export default async function Announcements() {
  const t = await getTranslations("docente");

  return (
    <Card
      kicker={t("announcementsKicker")}
      title={t("announcementsTitle")}
      icon="campaign"
    >
      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.titleKey}
            className="flex flex-col gap-1 rounded-xl bg-surface-container-low p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-xs font-semibold text-secondary">
                {t(announcement.titleKey)}
              </span>

              <span className="font-caption text-[11px] text-on-surface-variant">
                {t(announcement.dateKey)}
              </span>
            </div>

            <p className="text-sm text-on-surface-variant">
              {t(announcement.textKey)}
            </p>

            <button
              type="button"
              className="mt-1 inline-flex items-center gap-1 self-start font-caption text-xs font-semibold text-primary transition hover:underline"
            >
              {t(announcement.actionKey)}

              <span className="material-symbols-outlined text-[14px]">
                {announcement.icon}
              </span>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}