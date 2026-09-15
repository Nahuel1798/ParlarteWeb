import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const teachers = [
  {
    name: "Anna Berti",
    course: "Italiano A2 — 09:00",
    initials: "AB",
    tone: "primary",
  },
  {
    name: "Giovanni Ferri",
    course: "Italiano B1 — 11:30",
    initials: "GF",
    tone: "secondary",
  },
  {
    name: "Elena Marchetti",
    course: "Conversazione — 15:00",
    initials: "EM",
    tone: "tertiary",
  },
] as const;

export default function TeachersToday() {
  return (
    <Card
      title="Docenti Oggi"
      action={
        <span className="material-symbols-outlined text-secondary">
          cast_for_education
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        {teachers.map((teacher) => (
          <div key={teacher.name} className="flex items-center gap-3">
            <Avatar initials={teacher.initials} tone={teacher.tone} />

            <div className="flex flex-col">
              <span className="text-sm font-semibold">{teacher.name}</span>
              <span className="text-xs text-on-surface-variant">
                {teacher.course}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}