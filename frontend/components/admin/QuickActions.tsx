const actions = [
  {
    label: "Nuovo Corso",
    icon: "add_circle",
  },
  {
    label: "Invita Docente",
    icon: "person_add",
  },
  {
    label: "Emetti Certificati MCER",
    icon: "card_membership",
  },
  {
    label: "Report Finanziario",
    icon: "receipt_long",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-container-low p-3">
      <div className="flex items-center gap-2 px-3">
        <span className="material-symbols-outlined text-primary">bolt</span>

        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Azioni Rapide di Direzione:
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-2 rounded bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-on-surface shadow-sm transition hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-base text-primary">
              {action.icon}
            </span>

            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}