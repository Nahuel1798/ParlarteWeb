import { getTranslations } from "next-intl/server";
import Card from "@/components/ui/Card";

const events = [
  {
    dayKey: "agenda1Day",
    date: "19",
    titleKey: "agenda1Title",
    time: "18:00",
    descriptionKey: "agenda1Description",
    active: true,
  },
  {
    dayKey: "agenda2Day",
    date: "21",
    titleKey: "agenda2Title",
    time: "11:30",
    descriptionKey: "agenda2Description",
  },
  {
    dayKey: "agenda3Day",
    date: "22",
    titleKey: "agenda3Title",
    time: "17:00",
    descriptionKey: "agenda3Description",
  },
  {
    dayKey: "agenda4Day",
    date: "24",
    titleKey: "agenda4Title",
    time: "10:30",
    descriptionKey: "agenda4Description",
  },
];

export default async function WeeklyAgenda() {
  const t = await getTranslations("estudiante");

  return (
    <Card
      title={t("agendaTitle")}
      icon="event_upcoming"
      action={
        <span className="text-xs font-semibold text-secondary">
          {t("agendaMonth")}
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        {events.map((event) => (
          <div
            key={`${event.dayKey}-${event.date}`}
            className={`flex items-start gap-3 rounded-lg p-3 ${
              event.active
                ? "bg-surface-container-low"
                : "transition-colors hover:bg-surface-container-low"
            }`}
          >
            <div
              className={`flex h-12 w-10 flex-col items-center justify-center rounded font-semibold ${
                event.active
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="text-[10px] uppercase">
                {t(event.dayKey)}
              </span>

              <span className="font-headline-md text-sm">{event.date}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <span className="truncate text-xs font-semibold">
                  {t(event.titleKey)}
                </span>

                <span className="text-[11px] font-semibold text-secondary">
                  {event.time}
                </span>
              </div>

              <span className="text-[11px] text-on-surface-variant">
                {t(event.descriptionKey)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1 rounded bg-surface-container py-2 text-xs font-semibold text-primary transition hover:bg-surface-container-high">
        <span className="material-symbols-outlined text-[16px]">
          calendar_month
        </span>

        {t("agendaSync")}
      </button>
    </Card>
  );
}