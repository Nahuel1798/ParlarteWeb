import Card from "@/components/ui/Card";

const sessions = [
  {
    time: "18:00",
    end: "19:30 Fine",
    type: "Livello B1",
    group: "Gruppo Roma • 8 Iscritti",
    title: "Conversazione e Uso del Congiuntivo",
    description:
      "Focus tematico: Arte rinascimentale fiorentina ed espressione di opinione personale.",
    details: [
      "8/8 Presenti confermati",
      "2 dispense caricate",
    ],
  },
  {
    time: "20:00",
    end: "20:45 Fine",
    type: "Tutorato 1-a-1",
    group: "Sessione Personalizzata",
    title: "Tutorato Individuale: Matteo Rossi",
    description:
      "Preparazione esame di certificazione CILS B2 (sezione produzione scritta e colloquio orale).",
    details: [
      "Studente Regolare",
      "Revisione bozza saggio n. 4",
    ],
  },
];

export default function UpcomingSessions() {
  return (
    <Card
      kicker="Orario Giornaliero"
      title="Prossime Sessioni in Diretta"
      action={
        <div className="flex items-center gap-1 rounded-xl bg-surface-container px-3 py-1">
          <span className="material-symbols-outlined text-[18px] text-primary">
            videocam
          </span>

          <span className="font-caption text-xs text-on-surface-variant">
            Piattaforma Aula Virtuale WebRTC HD
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {sessions.map((session) => (
          <div
            key={session.title}
            className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-low p-4 transition-all hover:bg-surface-container md:flex-row md:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="flex min-w-[90px] flex-col items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-on-primary">
                <span className="font-label-md text-xs uppercase">
                  Inizio
                </span>

                <span className="font-headline-md my-1 text-2xl font-bold leading-none">
                  {session.time}
                </span>

                <span className="font-caption text-[10px] opacity-80">
                  {session.end}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-tertiary-fixed text-[11px] font-semibold uppercase tracking-wide text-on-tertiary-fixed px-2 py-1">
                    {session.type}
                  </span>

                  <span className="font-caption text-xs font-semibold text-secondary">
                    {session.group}
                  </span>
                </div>

                <h3 className="font-headline-md text-xl font-semibold text-primary">
                  {session.title}
                </h3>

                <p className="text-sm text-on-surface-variant">
                  {session.description}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-on-surface-variant">
                  {session.details.map((detail, index) => (
                    <span key={detail} className="flex items-center gap-1 text-xs">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {index === 0 ? "groups" : "description"}
                      </span>

                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-row gap-2 md:w-auto md:flex-col">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded bg-primary px-4 py-2 font-label-md text-on-primary transition hover:bg-primary-container md:flex-none"
              >
                <span className="material-symbols-outlined text-[18px]">
                  meeting_room
                </span>

                Apri Aula Virtuale
              </button>

              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1 rounded bg-surface-container-high px-4 py-2 font-label-md text-on-surface transition hover:bg-surface-variant md:flex-none"
              >
                <span className="material-symbols-outlined text-[18px]">
                  checklist
                </span>

                Appello e Note
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}