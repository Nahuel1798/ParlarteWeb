import Sidebar from "@/components/estudiante/Sidebar";
import Header from "@/components/estudiante/Header";
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
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />

      <div className="lg:pl-72">
        <Header />

        <main className="w-full px-4 md:px-6 pt-20">
          <div className="mx-auto max-w-[1280px] pb-20">
            
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

          </div>
        </main>
      </div>
    </div>
  );
}