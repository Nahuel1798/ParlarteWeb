import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminConfig } from "@/components/dashboard/config";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import QuickActions from "./QuickActions";
import AdmissionsTable from "./AdmissionsTable";
import OperationalAlerts from "./OperationalAlerts";
import CourseCapacity from "./CourseCapacity";
import TeachersToday from "./TeachersToday";

export default function AdminDashboard() {
  return (
    <DashboardShell config={adminConfig}>
      <PageHeader
        kicker="Ufficio Rettorale · Firenze"
        title="Direzione Accademica & Amministrazione"
        description="Quadro sinottico delle prestazioni didattiche, ammissioni e operatività istituzionale."
        actions={
          <>
            <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-4 py-2">
              <span className="material-symbols-outlined text-[18px] text-primary">
                calendar_today
              </span>

              <span className="text-xs text-on-surface-variant">Periodo:</span>

              <select className="bg-transparent text-xs font-semibold text-primary outline-none">
                <option>Semestre de Otoño 2024–2025</option>
                <option>Primavera 2025</option>
                <option>Sessione Estiva Intensiva 2024</option>
              </select>
            </div>

            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container">
              <span className="material-symbols-outlined text-base">
                file_download
              </span>

              Rapporto Esecutivo
            </button>
          </>
        }
      />

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Studenti Attivi"
          value="1.420"
          change="+14%"
          description="Rispetto al mese precedente"
          icon="groups"
          progress={78}
        />

        <StatCard
          title="Tasso Presenze & Ritenzione"
          value="94.2%"
          change="+1.8%"
          description="Frequenza regolare certificata"
          icon="verified"
          progress={94.2}
          tone="secondary"
        />

        <StatCard
          title="Entrate Iscrizioni"
          value="€184.500"
          change="+8%"
          description="Obiettivo semestrale superato"
          icon="payments"
          progress={88}
          tone="tertiary"
        />

        <StatCard
          title="Corpo Docente"
          value="28"
          change="Docenti Certificati"
          description="100% madrelingua DITALS/CEDILS"
          icon="co_present"
          progress={100}
        />
      </section>

      <QuickActions />

      {/* Contenido */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="flex flex-col gap-6 xl:col-span-8">
          <AdmissionsTable />
          <OperationalAlerts />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-4">
          <CourseCapacity />
          <TeachersToday />
        </div>
      </section>
    </DashboardShell>
  );
}