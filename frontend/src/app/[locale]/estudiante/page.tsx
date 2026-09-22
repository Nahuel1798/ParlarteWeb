import DashboardShell from "@/components/dashboard/DashboardShell";
import { estudianteConfig } from "@/components/dashboard/config";
import WelcomeHeader from "@/components/estudiante/WelcomeHeader";
import NextLesson from "@/components/estudiante/NextLesson";
import ActiveCourses from "@/components/estudiante/ActiveCourses";
import Resources from "@/components/estudiante/Resources";
import WeeklyAgenda from "@/components/estudiante/WeeklyAgenda";
import WordOfDay from "@/components/estudiante/WordOfDay";
import CulturalCard from "@/components/estudiante/CulturalCard";
import DailyTip from "@/components/estudiante/DailyTip";

export default function DashboardPage() {
  return (
    <DashboardShell config={estudianteConfig}>
      <WelcomeHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <NextLesson />
          <ActiveCourses />
          <Resources />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <WeeklyAgenda />
          <WordOfDay />
          <CulturalCard />
        </div>
      </div>

      <DailyTip />
    </DashboardShell>
  );
}