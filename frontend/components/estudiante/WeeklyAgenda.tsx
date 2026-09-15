const events = [
  {
    day: "Lun",
    date: "19",
    title: "Conversazione & Cultura",
    time: "18:00",
    description: "Classe Plenaria • Zoom",
    active: true,
  },
  {
    day: "Mer",
    date: "21",
    title: "Tutoría Individual: Fonética",
    time: "11:30",
    description: "Con Dott. Gianluca Vieri",
  },
  {
    day: "Gio",
    date: "22",
    title: "Navigando il Passato: Lez. 9",
    time: "17:00",
    description: "Grammatica applicata",
  },
  {
    day: "Sab",
    date: "24",
    title: "Caffè Letterario Weekend",
    time: "10:30",
    description: "Club Informale: Racconti di Calvino",
  },
];

export default function WeeklyAgenda() {
  return (
    <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">

      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">
            event_upcoming
          </span>

          <h3 className="font-headline-md text-lg font-semibold text-primary">
            Agenda Settimanale
          </h3>
        </div>

        <span className="text-xs font-semibold text-secondary">
          Maggio 2025
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">

        {events.map((event) => (
          <div
            key={`${event.day}-${event.date}`}
            className={`flex items-start gap-3 rounded-lg p-3 ${
              event.active
                ? "bg-surface-container-low"
                : "transition-colors hover:bg-surface-container-low"
            }`}
          >
            <div
              className={`flex h-12 w-10 flex-col items-center justify-center rounded font-semibold ${
                event.active
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <span className="text-[10px] uppercase">
                {event.day}
              </span>

              <span className="font-headline-md text-sm">
                {event.date}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <span className="truncate text-xs font-semibold">
                  {event.title}
                </span>

                <span className="text-[11px] font-semibold text-secondary">
                  {event.time}
                </span>
              </div>

              <span className="text-[11px] text-on-surface-variant">
                {event.description}
              </span>
            </div>
          </div>
        ))}

      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1 rounded bg-surface-container py-2 text-xs font-semibold text-primary hover:bg-surface-container-high">
        <span className="material-symbols-outlined text-[16px]">
          calendar_month
        </span>

        Sincronizzare con Google / iCal
      </button>

    </section>
  );
}