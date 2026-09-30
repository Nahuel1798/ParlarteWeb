import DashboardShell from "@/components/dashboard/DashboardShell";
import { docenteConfig } from "@/components/dashboard/config";
import CalendarioView from "@/components/calendario/CalendarioView";

export default function CalendarioDocentePage() {
  return (
    <DashboardShell config={docenteConfig}>
      <CalendarioView />
    </DashboardShell>
  );
}
