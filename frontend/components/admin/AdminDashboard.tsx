"use client";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import KpiCard from "./KpiCard";
import QuickActions from "./QuickActions";
import AdmissionsTable from "./AdmissionsTable";
import OperationalAlerts from "./OperationalAlerts";
import CourseCapacity from "./CourseCapacity";
import TeachersToday from "./TeachersToday";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#1c1c18]">
      <AdminSidebar />

      <div className="pl-0 lg:pl-72">
        <AdminHeader />

        <main className="pt-20 px-4 md:px-6">
          <div className="w-full pb-20">

            {/* Título */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#9d422b]" />

                  <span className="text-xs uppercase tracking-widest text-[#9d422b] font-semibold">
                    Ufficio Rettorale · Firenze
                  </span>
                </div>

                <h1 className="font-playfair text-3xl md:text-5xl text-[#154212] font-semibold tracking-tight">
                  Direzione Accademica & Administración
                </h1>

                <p className="mt-2 text-[#42493e]">
                  Quadro sinottico delle prestazioni didattiche,
                  ammissioni e operatività istituzionale.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-[#f6f3ec] px-4 py-2 rounded-lg">
                  <span className="material-symbols-outlined text-[#154212]">
                    calendar_today
                  </span>

                  <span className="text-xs text-[#42493e]">
                    Periodo:
                  </span>

                  <select className="bg-transparent text-xs text-[#154212] font-semibold outline-none">
                    <option>
                      Semestre de Otoño 2024–2025
                    </option>

                    <option>
                      Primavera 2025
                    </option>

                    <option>
                      Sessione Estiva Intensiva 2024
                    </option>
                  </select>
                </div>

                <button className="flex items-center gap-2 bg-[#154212] hover:bg-[#2d5a27] text-white px-4 py-2 rounded-lg text-xs font-semibold transition">
                  <span className="material-symbols-outlined text-base">
                    file_download
                  </span>

                  Rapporto Esecutivo
                </button>
              </div>
            </section>

            {/* KPIs */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <KpiCard
                title="Studenti Attivi"
                value="1.420"
                change="+14%"
                description="Rispetto al mese precedente"
                icon="groups"
                progress={78}
              />

              <KpiCard
                title="Tasso Presenze & Ritenzione"
                value="94.2%"
                change="+1.8%"
                description="Frequenza regolare certificata"
                icon="verified"
                progress={94.2}
                secondary
              />

              <KpiCard
                title="Entrate Iscrizioni"
                value="€184.500"
                change="+8%"
                description="Obiettivo semestrale superato"
                icon="payments"
                progress={88}
                tertiary
              />

              <KpiCard
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
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">

              <div className="xl:col-span-8 flex flex-col gap-6">
                <AdmissionsTable />
                <OperationalAlerts />
              </div>

              <div className="xl:col-span-4 flex flex-col gap-6">
                <CourseCapacity />
                <TeachersToday />
              </div>

            </section>
          </div>
        </main>
      </div>
    </div>
  );
}