import { getTranslations } from "next-intl/server";

export default async function NextLesson() {
  const t = await getTranslations("estudiante");

  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-md md:flex-row">

      <div className="relative h-64 md:h-auto md:w-5/12">

        <div
          className="h-full min-h-[220px] w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDwDyTv2_2YdPo6EjcgnPdWgbj-5EiqqOFcp8rRcAcAMOYcJj6I8vVVuW53kti09_yMiEu91xnvd8lkgVzRwu2UluQpyb5yxN5x5OCcOEkJR-0XrFsRYKGLBM5WDHjgjznnzXhnCsbI6lgbYtbWbicz1wfqWc8_Mzk_Al2vL9eXxds05lwgLjCI2VbA4AfB_R3H5XJNPock3AeNn05hssqmyWT5EQUFLu6mp79U7d778gkBEHIwmz5R')",
          }}
        />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          {t("nextLessonLive")}
        </div>
      </div>

      <div className="flex flex-col justify-between p-6 md:w-7/12">

        <div>

          <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <span className="material-symbols-outlined text-[16px]">
                schedule
              </span>

              {t("nextLessonTime")}
            </span>

            <span className="hidden md:block">
              {t("nextLessonRoom")}
            </span>
          </div>

          <h2 className="font-headline-md text-2xl font-semibold leading-snug text-primary">
            {t("nextLessonTitle")}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
            {t("nextLessonDescription")}
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-xs font-semibold text-on-secondary-container">
              SR
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold">
                {t("nextLessonTeacher")}
              </span>

              <span className="text-[11px] text-on-surface-variant">
                {t("nextLessonChair")}
              </span>
            </div>
          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          <button className="flex items-center gap-2 rounded bg-primary px-5 py-3 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container">
            <span className="material-symbols-outlined text-[18px]">
              videocam
            </span>

            {t("nextLessonJoin")}
          </button>

          <button className="flex items-center gap-2 rounded bg-surface-container-high px-4 py-3 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-variant">
            <span className="material-symbols-outlined text-[18px]">
              menu_book
            </span>

            {t("nextLessonMaterials")}
          </button>

        </div>
      </div>
    </section>
  );
}