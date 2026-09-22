import DashboardShell from "@/components/dashboard/DashboardShell";
import { docenteConfig } from "@/components/dashboard/config";
import WelcomePanel from "@/components/docente/WelcomePanel";
import StatsCards from "@/components/docente/StatsCards";
import UpcomingSessions from "@/components/docente/UpcomingSessions";
import PendingAssignments from "@/components/docente/PendingAssignments";
import AssignedCourses from "@/components/docente/AssignedCourses";
import Announcements from "@/components/docente/Announcements";
import ConversationClub from "@/components/docente/ConversationClub";

export default function DocentePage() {
  return (
    <DashboardShell config={docenteConfig}>
      <WelcomePanel />

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <UpcomingSessions />
          <PendingAssignments />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <AssignedCourses />
          <Announcements />
          <ConversationClub />
        </div>
      </div>
    </DashboardShell>
  );
}