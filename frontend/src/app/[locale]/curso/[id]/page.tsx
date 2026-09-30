import CourseDashboard from "@/components/cursos/CourseDashboard";
import CursoDetalle from "@/components/cursos/CursoDetalle";

export default async function CursoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <CourseDashboard>
      <CursoDetalle cursoId={Number(id)} />
    </CourseDashboard>
  );
}
