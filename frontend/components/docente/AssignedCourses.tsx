import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";

const courses = [
  {
    level: "B1 Intermedio",
    students: "8 Studenti",
    title: "Italiano Intermedio B1 — Cohorte Autunno",
    progress: 65,
    module: 'Modulo 6 di 10: "Società e Cultura"',
    schedule: "Martedì & Giovedì",
  },
  {
    level: "C1 Superiore",
    students: "6 Studenti",
    title: "Maestria Linguistica C1",
    progress: 82,
    module: "Prossima verifica: Giovedì",
    schedule: "Aula Magna 2",
  },
];

export default function AssignedCourses() {
  return (
    <Card kicker="Didattica Attiva" title="Corsi Assegnati">
      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div
            key={course.title}
            className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-4"
          >
            <div className="flex items-center justify-between">
              <span className="rounded bg-tertiary-fixed px-2 py-1 text-[11px] font-semibold uppercase text-on-tertiary-fixed">
                {course.level}
              </span>

              <span className="font-caption text-xs text-on-surface-variant">
                {course.students}
              </span>
            </div>

            <h4 className="font-headline-md text-lg font-semibold text-primary">
              {course.title}
            </h4>

            <div className="mt-1 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">
                  Avanzamento Programma
                </span>

                <span className="font-label-md font-semibold text-primary">
                  {course.progress}%
                </span>
              </div>

              <Progress value={course.progress} size="sm" />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-on-surface-variant">
              <span>{course.module}</span>

              <span className="font-medium text-secondary">
                {course.schedule}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}