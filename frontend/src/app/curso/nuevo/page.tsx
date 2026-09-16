import AdminGuard from "@/components/auth/AdminGuard";
import NuevoCursoForm from "@/components/nuevocurso/NuevoCursoForm";

export default function NuevoCursoPage() {
  return (
    <AdminGuard>
      <NuevoCursoForm />
    </AdminGuard>
  );
}