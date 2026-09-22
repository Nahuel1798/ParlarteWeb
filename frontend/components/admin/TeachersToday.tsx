import { getTranslations } from "next-intl/server";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";

const teachers = [
  { name: "Anna Berti", courseKey: "teachers1Course", initials: "AB", tone: "primary" as const },
  { name: "Giovanni Ferri", courseKey: "teachers2Course", initials: "GF", tone: "secondary" as const },
  { name: "Elena Marchetti", courseKey: "teachers3Course", initials: "EM", tone: "tertiary" as const },
];

export default async function TeachersToday() {
  const t = await getTranslations("admin");

  return (
    <Card
      title={t("teachersTitle")}
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
                {t(teacher.courseKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}