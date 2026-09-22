import { getTranslations } from "next-intl/server";
import Card from "@/components/ui/Card";

const assignments = [
  {
    initials: "EB",
    nameKey: "pending1Name",
    levelKey: "pending1Level",
    titleKey: "pending1Title",
    infoKey: "pending1Info",
  },
  {
    initials: "LM",
    nameKey: "pending2Name",
    levelKey: "pending2Level",
    titleKey: "pending2Title",
    infoKey: "pending2Info",
  },
  {
    initials: "CD",
    nameKey: "pending3Name",
    levelKey: "pending3Level",
    titleKey: "pending3Title",
    infoKey: "pending3Info",
  },
];

export default async function PendingAssignments() {
  const t = await getTranslations("docente");

  return (
    <Card
      kicker={t("pendingKicker")}
      title={t("pendingTitle")}
      action={
        <button
          type="button"
          className="flex items-center gap-1 font-label-md text-secondary transition hover:underline"
        >
          {t("pendingAction")} (12)

          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {assignments.map((assignment) => (
          <div
            key={assignment.nameKey}
            className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-low p-4 transition-all hover:bg-surface-container md:flex-row md:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container font-label-md text-sm text-on-primary">
                {assignment.initials}
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-md text-on-surface">
                    {t(assignment.nameKey)}
                  </span>

                  <span className="rounded bg-tertiary-fixed px-2 py-1 text-[11px] font-semibold text-on-tertiary-fixed">
                    {t(assignment.levelKey)}
                  </span>
                </div>

                <span className="mt-1 text-sm font-medium text-on-surface">
                  {t(assignment.titleKey)}
                </span>

                <span className="font-caption text-xs text-on-surface-variant">
                  {t(assignment.infoKey)}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 rounded bg-primary px-4 py-2 font-label-md text-on-primary transition hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit_note
              </span>

              {t("pendingCorrect")}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}