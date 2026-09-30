import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminConfig } from "@/components/dashboard/config";
import CalendarioView from "@/components/calendario/CalendarioView";

export default function CalendarioAdminPage() {
  return (
    <DashboardShell config={adminConfig}>
      <CalendarioView />
    </DashboardShell>
  );
}
