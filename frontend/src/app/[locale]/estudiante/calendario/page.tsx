import DashboardShell from "@/components/dashboard/DashboardShell";
import { estudianteConfig } from "@/components/dashboard/config";
import CalendarioView from "@/components/calendario/CalendarioView";

export default function CalendarioEstudiantePage() {
  return (
    <DashboardShell config={estudianteConfig}>
      <CalendarioView />
    </DashboardShell>
  );
}
