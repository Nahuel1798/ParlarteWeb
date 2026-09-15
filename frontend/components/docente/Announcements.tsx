import Card from "@/components/ui/Card";

const announcements = [
  {
    title: "Calendario Esami CILS",
    date: "Ieri, 17:15",
    text:
      "Sono aperte le iscrizioni per la sessione invernale CILS e CELI. Si prega di verificare l'elenco dei candidati della classe B1 e confermare l'idoneità accademica entro venerdì.",
    action: "Scarica Circolare PDF",
    icon: "download",
  },
  {
    title: "Materiali Glottodidattici",
    date: "14 Ottobre",
    text:
      'Nuova antologia digitale disponibile in biblioteca docenti: "Letteratura Italiana Contemporanea e Cortometraggi per Livelli Intermedi".',
    action: "Esplora Risorse Didattiche",
    icon: "open_in_new",
  },
];

export default function Announcements() {
  return (
    <Card
      kicker="Comunicazioni Ufficiali"
      title="Segreteria Accademica"
      icon="campaign"
    >
      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.title}
            className="flex flex-col gap-1 rounded-xl bg-surface-container-low p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-label-md text-xs font-semibold text-secondary">
                {announcement.title}
              </span>

              <span className="font-caption text-[11px] text-on-surface-variant">
                {announcement.date}
              </span>
            </div>

            <p className="text-sm text-on-surface-variant">
              {announcement.text}
            </p>

            <button
              type="button"
              className="mt-1 inline-flex items-center gap-1 self-start font-caption text-xs font-semibold text-primary transition hover:underline"
            >
              {announcement.action}

              <span className="material-symbols-outlined text-[14px]">
                {announcement.icon}
              </span>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}