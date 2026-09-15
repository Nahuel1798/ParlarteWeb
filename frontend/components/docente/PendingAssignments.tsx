import Card from "@/components/ui/Card";

const assignments = [
  {
    initials: "EB",
    name: "Elena Bianchi",
    level: "B1 Italiano",
    title: 'Saggio: "Il Mio Viaggio Immaginario tra le Colline Senesi"',
    info: "Sottomesso oggi alle 11:20 • 420 parole • Formato PDF",
  },
  {
    initials: "LM",
    name: "Lucas Müller",
    level: "C1 Linguistica",
    title:
      'Analisi critica: "L\'Evoluzione dei Neologismi nel Giornalismo Moderno"',
    info: "Sottomesso ieri alle 19:45 • 850 parole • Con audio allegato",
  },
  {
    initials: "CD",
    name: "Claire Dupont",
    level: "B1 Italiano",
    title:
      'Esercizio: "Periodo Ipotetico della Possibilità ed Irrealtà"',
    info: "Sottomesso ieri alle 16:30 • 15 risposte aperte",
  },
];

export default function PendingAssignments() {
  return (
    <Card
      kicker="Compiti e Valutazioni"
      title="Elaborati in Attesa di Correzione"
      action={
        <button
          type="button"
          className="flex items-center gap-1 font-label-md text-secondary transition hover:underline"
        >
          Vedi tutti (12)

          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      }
    >
      <div className="flex flex-col gap-2">
        {assignments.map((assignment) => (
          <div
            key={assignment.name}
            className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-container-low p-4 transition-all hover:bg-surface-container md:flex-row md:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-container font-label-md text-sm text-on-primary">
                {assignment.initials}
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-md text-on-surface">
                    {assignment.name}
                  </span>

                  <span className="rounded bg-tertiary-fixed px-2 py-1 text-[11px] font-semibold text-on-tertiary-fixed">
                    {assignment.level}
                  </span>
                </div>

                <span className="mt-1 text-sm font-medium text-on-surface">
                  {assignment.title}
                </span>

                <span className="font-caption text-xs text-on-surface-variant">
                  {assignment.info}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-1 rounded bg-primary px-4 py-2 font-label-md text-on-primary transition hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[16px]">
                edit_note
              </span>

              Correggi &amp; Vota
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}