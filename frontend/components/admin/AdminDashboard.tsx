import { getTranslations } from "next-intl/server";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminConfig } from "@/components/dashboard/config";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import QuickActions from "./QuickActions";
import AdmissionsTable from "./AdmissionsTable";
import CourseCapacity from "./CourseCapacity";
import TeachersToday from "./TeachersToday";
import CoursesTable from "./CoursesTable";

export default async function AdminDashboard() {
  const t = await getTranslations("admin");

  return (
    <DashboardShell config={adminConfig}>
      <PageHeader
        kicker={t("kicker")}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-4 py-2">
              <span className="material-symbols-outlined text-[18px] text-primary">
                calendar_today
              </span>

              <span className="text-xs text-on-surface-variant">{t("periodo")}</span>

              <select className="bg-transparent text-xs font-semibold text-primary outline-none">
                <option>{t("periodOtono")}</option>
                <option>{t("periodPrimavera")}</option>
                <option>{t("periodVerano")}</option>
              </select>
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container">
              <span className="material-symbols-outlined text-base">
                file_download
              </span>

              {t("report")}
            </button>
          </>
        }
      />

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t("statStudenti")}
          value="1.420"
          change={t("statStudentiChange")}
          description={t("statStudentiDesc")}
          icon="groups"
          progress={78}
        />

        <StatCard
          title={t("statPresenze")}
          value="94.2%"
          change={t("statPresenzeChange")}
          description={t("statPresenzeDesc")}
          icon="verified"
          progress={94.2}
          tone="secondary"
        />

        <StatCard
          title={t("statEntrate")}
          value="€184.500"
          change={t("statEntrateChange")}
          description={t("statEntrateDesc")}
          icon="payments"
          progress={88}
          tone="tertiary"
        />

        <StatCard
          title={t("statDocenti")}
          value="28"
          change={t("statDocentiChange")}
          description={t("statDocentiDesc")}
          icon="co_present"
          progress={100}
        />
      </section>

      <QuickActions />

      {/* Contenido */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          <AdmissionsTable />
          <CoursesTable />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-4">
          <CourseCapacity />
          <TeachersToday />
        </div>
      </section>
    </DashboardShell>
  );
}