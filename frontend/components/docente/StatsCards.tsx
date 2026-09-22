import { getTranslations } from "next-intl/server";
import StatCard from "@/components/ui/StatCard";

export default async function StatsCards() {
  const t = await getTranslations("docente");

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title={t("statsProgram")}
        value="3"
        icon="co_present"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-on-surface">
              <span className="font-semibold">{t("statsProgramStudents")}</span>{" "}
              <span className="text-on-surface-variant">
                {t("statsProgramExpected")}
              </span>
            </span>

            <span className="text-xs font-semibold text-primary">
              {t("statsProgramCapacity")}
            </span>
          </div>
        }
      />

      <StatCard
        title={t("statsRevisions")}
        value="12"
        icon="rate_review"
        tone="secondary"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-on-surface">
              <span className="font-semibold">{t("statsRevisionsPriority")}</span>{" "}
              <span className="text-on-surface-variant">
                {t("statsRevisionsDeadline")}
              </span>
            </span>

            <span className="text-xs font-semibold text-primary">
              {t("statsRevisionsHomework")}
            </span>
          </div>
        }
      />

      <StatCard
        title={t("statsRating")}
        value="4.9"
        suffix="/ 5.0"
        icon="stars"
        tone="tertiary"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex text-tertiary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className="material-symbols-outlined text-[16px]"
                  >
                    star
                  </span>
                ))}
              </div>

              <span className="text-xs text-on-surface-variant">
                {t("statsRatingReviews", { count: 48 })}
              </span>
            </div>

            <span className="text-xs font-semibold text-primary">
              {t("statsRatingSemester")}
            </span>
          </div>
        }
      />
    </div>
  );
}