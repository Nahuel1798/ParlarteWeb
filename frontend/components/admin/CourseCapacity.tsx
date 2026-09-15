import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";

const courses = [
  {
    name: "Italiano A2",
    used: 42,
    total: 50,
  },
  {
    name: "Italiano B1",
    used: 35,
    total: 40,
  },
  {
    name: "Italiano B2",
    used: 28,
    total: 30,
  },
];

export default function CourseCapacity() {
  return (
    <Card
      title="Capacità Corsi"
      subtitle="Occupazione delle aule questo semestre"
    >
      <div className="flex flex-col gap-4">
        {courses.map((course) => {
          const pct = Math.round((course.used / course.total) * 100);

          return (
            <div key={course.name}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold">{course.name}</span>

                <span className="text-xs text-on-surface-variant">
                  {course.used}/{course.total}
                </span>
              </div>

              <Progress value={pct} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}