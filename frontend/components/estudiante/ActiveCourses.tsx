import { getTranslations } from "next-intl/server";

const courses = [
  {
    badgeKey: "active1Badge",
    percentage: 68,
    titleKey: "active1Title",
    descriptionKey: "active1Description",
    progressKey: "active1Progress",
    remainingKey: "active1Remaining",
    icon: "assignment_late",
    labelKey: "active1Label",
    taskKey: "active1Task",
    footerIcon: "folder_open",
    footerKey: "active1Footer",
    actionKey: "active1Action",
  },
  {
    badgeKey: "active2Badge",
    percentage: 45,
    titleKey: "active2Title",
    descriptionKey: "active2Description",
    progressKey: "active2Progress",
    remainingKey: "active2Remaining",
    icon: "mic",
    labelKey: "active2Label",
    taskKey: "active2Task",
    footerIcon: "graphic_eq",
    footerKey: "active2Footer",
    actionKey: "active2Action",
  },
];

export default async function ActiveCourses() {
  const t = await getTranslations("estudiante");

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-primary">
            school
          </span>

          <h2 className="font-headline-md text-xl font-semibold tracking-tight text-primary">
            {t("activeTitle")}
          </h2>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline">
          {t("activeAction")}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {courses.map((course) => (
          <div
            key={course.titleKey}
            className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>

              <div className="mb-3 flex items-center justify-between">
                <span className="rounded bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {t(course.badgeKey)}
                </span>

                <span className="text-xs font-semibold text-on-surface-variant">
                  {t("activePercent", { percentage: course.percentage })}
                </span>
              </div>

              <h3 className="font-headline-md text-lg font-semibold text-on-surface">
                {t(course.titleKey)}
              </h3>

              <p className="mt-1 text-xs text-on-surface-variant">
                {t(course.descriptionKey)}
              </p>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>

              <div className="mt-1 flex justify-between text-[11px] text-on-surface-variant">
                <span>{t(course.progressKey)}</span>
                <span>{t(course.remainingKey)}</span>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-lg bg-surface-container p-3">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  {course.icon}
                </span>

                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-secondary">
                    {t(course.labelKey)}
                  </span>

                  <span className="block truncate text-xs font-semibold">
                    {t(course.taskKey)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-outline-variant/30 pt-3">
              <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">
                  {course.footerIcon}
                </span>

                {t(course.footerKey)}
              </span>

              <button className="flex items-center gap-1 rounded bg-surface-container-high px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-variant">
                {t(course.actionKey)}

                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </button>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}