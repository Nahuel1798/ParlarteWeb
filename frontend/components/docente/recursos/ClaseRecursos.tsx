"use client";

import type { ClaseResponse } from "../../../lib/api";

import VideosPanel from "./VideosPanel";
import MaterialesPanel from "./MaterialesPanel";
import TareasPanel from "./TareasPanel";
import TestsPanel from "./TestsPanel";

export default function ClaseRecursos({
  cursoId,
  clase,
}: {
  cursoId: number;
  clase: ClaseResponse;
}) {
  return (
    <div className="flex flex-col gap-3">
      <VideosPanel cursoId={cursoId} claseId={clase.id} />
      <MaterialesPanel cursoId={cursoId} claseId={clase.id} />
      <TareasPanel cursoId={cursoId} claseId={clase.id} />
      <TestsPanel cursoId={cursoId} claseId={clase.id} />
    </div>
  );
}