import CursoClases from "@/components/docente/CursoClases";

export default async function CursoClasesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CursoClases cursoId={Number(id)} />;
}