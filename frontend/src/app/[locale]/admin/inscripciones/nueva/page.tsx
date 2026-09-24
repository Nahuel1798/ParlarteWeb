import { getTranslations } from "next-intl/server";
import AdminGuard from "@/components/auth/AdminGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminConfig } from "@/components/dashboard/config";
import PageHeader from "@/components/ui/PageHeader";
import NuevaInscripcionForm from "@/components/admin/NuevaInscripcionForm";

export default async function NuevaInscripcionPage() {
  const t = await getTranslations("admin");

  return (
    <AdminGuard>
      <DashboardShell config={adminConfig}>
        <PageHeader
          kicker={t("nuevaInscripcionKicker")}
          title={t("nuevaInscripcionTitle")}
          description={t("nuevaInscripcionDescription")}
        />

        <NuevaInscripcionForm />
      </DashboardShell>
    </AdminGuard>
  );
}