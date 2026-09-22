import { getTranslations } from "next-intl/server";
import Card from "@/components/ui/Card";

const sessions = [
  {
    time: "18:00",
    endKey: "sessions1End",
    typeKey: "sessions1Type",
    groupKey: "sessions1Group",
    titleKey: "sessions1Title",
    descriptionKey: "sessions1Description",
    detailsKeys: ["sessions1Detail1", "sessions1Detail2"],
  },
  {
    time: "20:00",
    endKey: "sessions2End",
    typeKey: "sessions2Type",
    groupKey: "sessions2Group",
    titleKey: "sessions2Title",
    descriptionKey: "sessions2Description",
    detailsKeys: ["sessions2Detail1", "sessions2Detail2"],
  },
];

export default async function UpcomingSessions() {
  const t = await getTranslations("docente");

  return (
    <Card
      kicker={t("sessionsKicker")}
      title={t("sessionsTitle")}
      action={
        <div className="flex items-center gap-1 rounded-xl bg-surface-container px-3 py-1">
          <span className="material-symbols-outlined text-[18px] text-primary">
            videocam
          </span>

          <span className="font-caption text-xs text-on-surface-variant">
            {t("sessionsPlatform")}
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <div
            key={session.titleKey}
            className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-low p-4 transition-all hover:bg-surface-container md:flex-row md:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="flex min-w-[90px] flex-col items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-on-primary">
                <span className="font-label-md text-xs uppercase">
                  {t("sessionsStart")}
                </span>

                <span className="font-headline-md my-1 text-2xl font-bold leading-none">
                  {session.time}
                </span>

                <span className="font-caption text-[10px] opacity-80">
                  {t(session.endKey)}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-tertiary-fixed text-[11px] font-semibold uppercase tracking-wide text-on-tertiary-fixed px-2 py-1">
                    {t(session.typeKey)}
                  </span>

                  <span className="font-caption text-xs font-semibold text-secondary">
                    {t(session.groupKey)}
                  </span>
                </div>

                <h3 className="font-headline-md text-xl font-semibold text-primary">
                  {t(session.titleKey)}
                </h3>

                <p className="text-sm text-on-surface-variant">
                  {t(session.descriptionKey)}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-on-surface-variant">
                  {session.detailsKeys.map((key, index) => (
                    <span
                      key={key}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {index === 0 ? "groups" : "description"}
                      </span>

                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-row gap-2 md:w-auto md:flex-col">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded bg-primary px-4 py-2 font-label-md text-on-primary transition hover:bg-primary-container md:flex-none"
              >
                <span className="material-symbols-outlined text-[18px]">
                  meeting_room
                </span>

                {t("sessionsOpenRoom")}
              </button>

              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded bg-surface-container-high px-4 py-2 font-label-md text-on-surface transition hover:bg-surface-variant md:flex-none"
              >
                <span className="material-symbols-outlined text-[18px]">
                  checklist
                </span>

                {t("sessionsAttendance")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}