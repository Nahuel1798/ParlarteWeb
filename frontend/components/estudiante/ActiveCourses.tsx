const courses = [
  {
    badge: "Modulo B1.2",
    percentage: 68,
    title: "Italiano B1: Navigando il Passato",
    description:
      "Studio approfondito del Passato Prossimo vs Imperfetto e forme narrative.",
    progress: "8 di 12 lezioni superate",
    remaining: "4 lezioni rimaste",
    icon: "assignment_late",
    label: "Prossima Consegna (Giovedì)",
    task: "Ensayo breve: 'Ladri di biciclette' e il dopoguerra",
    footerIcon: "folder_open",
    footer: "3 materiali da revisionare",
    action: "Continuar",
  },
  {
    badge: "Laboratorio Speciale",
    percentage: 45,
    title: "Laboratorio di Fonetica e Pronuncia",
    description:
      "Consonanti doppie, cadenza toscana e intonazione musicale del discorso.",
    progress: "5 di 11 moduli completati",
    remaining: "Prossima sessione: Giovedì",
    icon: "mic",
    label: "Esercizio Pratico Orale",
    task: "Registrazione: 'Sci' vs 'Chi' in contesto narrativo",
    footerIcon: "graphic_eq",
    footer: "8 feedback del docente",
    action: "Ascolta",
  },
];

export default function ActiveCourses() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-primary">
            school
          </span>

          <h2 className="font-headline-md text-xl font-semibold tracking-tight text-primary">
            I Miei Corsi Attivi
          </h2>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline">
          Ver curriculum completo
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {courses.map((course) => (
          <div
            key={course.title}
            className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>

              <div className="mb-3 flex items-center justify-between">
                <span className="rounded bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {course.badge}
                </span>

                <span className="text-xs font-semibold text-on-surface-variant">
                  {course.percentage}% Completato
                </span>
              </div>

              <h3 className="font-headline-md text-lg font-semibold text-on-surface">
                {course.title}
              </h3>

              <p className="mt-1 text-xs text-on-surface-variant">
                {course.description}
              </p>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>

              <div className="mt-1 flex justify-between text-[11px] text-on-surface-variant">
                <span>{course.progress}</span>
                <span>{course.remaining}</span>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-lg bg-surface-container p-3">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  {course.icon}
                </span>

                <div className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-secondary">
                    {course.label}
                  </span>

                  <span className="block truncate text-xs font-semibold">
                    {course.task}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-outline-variant/30 pt-3">
              <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">
                  {course.footerIcon}
                </span>

                {course.footer}
              </span>

              <button className="flex items-center gap-1 rounded bg-surface-container-high px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-variant">
                {course.action}

                <span className="material-symbols-outlined text-[14px]">
                  arrow_forward
                </span>
              </button>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}