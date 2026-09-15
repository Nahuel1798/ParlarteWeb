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
    <section className="bg-white rounded-xl shadow-sm px-6 py-5">
      <h2 className="font-playfair text-lg font-semibold mb-1">
        Capacità Corsi
      </h2>

      <p className="text-xs text-[#42493e] mb-4">
        Occupazione delle aule questo semestre
      </p>

      <div className="flex flex-col gap-4">
        {courses.map((course) => {
          const pct = Math.round((course.used / course.total) * 100);

          return (
            <div key={course.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold">{course.name}</span>

                <span className="text-xs text-[#42493e]">
                  {course.used}/{course.total}
                </span>
              </div>

              <div className="w-full bg-[#ebe8e1] h-2 rounded-full">
                <div
                  className="bg-[#154212] h-2 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}