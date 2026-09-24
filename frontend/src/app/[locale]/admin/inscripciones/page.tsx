import { getTranslations } from "next-intl/server";
import AdminGuard from "@/components/auth/AdminGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminConfig } from "@/components/dashboard/config";
import PageHeader from "@/components/ui/PageHeader";
import InscripcionesTable from "@/components/admin/InscripcionesTable";
import { Link } from "@/i18n/navigation";

export default async function InscripcionesPage() {
  const t = await getTranslations("admin");

  return (
    <AdminGuard>
      <DashboardShell config={adminConfig}>
        <PageHeader
          kicker={t("inscripcionesKicker")}
          title={t("inscripcionesTitle")}
          description={t("inscripcionesDescription")}
          actions={
            <Link
              href="/admin/inscripciones/nueva"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-base">add</span>
              {t("inscripcionesNew")}
            </Link>
          }
        />

        <InscripcionesTable />
      </DashboardShell>
    </AdminGuard>
  );
}