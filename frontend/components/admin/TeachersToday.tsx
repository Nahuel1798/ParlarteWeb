const teachers = [
  {
    name: "Anna Berti",
    course: "Italiano A2 — 09:00",
    initials: "AB",
    tone: "bg-[#154212]",
  },
  {
    name: "Giovanni Ferri",
    course: "Italiano B1 — 11:30",
    initials: "GF",
    tone: "bg-[#9d422b]",
  },
  {
    name: "Elena Marchetti",
    course: "Conversazione — 15:00",
    initials: "EM",
    tone: "bg-[#735c00]",
  },
];

export default function TeachersToday() {
  return (
    <section className="bg-white rounded-xl shadow-sm px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-lg font-semibold">
          Docenti Oggi
        </h2>

        <span className="material-symbols-outlined text-[#9d422b]">
          cast_for_education
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {teachers.map((teacher) => (
          <div key={teacher.name} className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full ${teacher.tone} flex items-center justify-center`}
            >
              <span className="text-white text-xs font-semibold">
                {teacher.initials}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold">{teacher.name}</span>
              <span className="text-xs text-[#42493e]">{teacher.course}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}