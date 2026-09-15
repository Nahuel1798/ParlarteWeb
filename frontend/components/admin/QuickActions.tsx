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
    <section className="mt-6 bg-[#f6f3ec] rounded-xl p-3 flex flex-wrap items-center justify-between gap-4">

      <div className="flex items-center gap-2 px-3">
        <span className="material-symbols-outlined text-[#154212]">
          bolt
        </span>

        <span className="text-xs uppercase tracking-wider text-[#154212] font-semibold">
          Azioni Rapide di Direzione:
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-2 bg-white hover:bg-[#ebe8e1] px-3 py-2 rounded text-xs font-semibold transition"
          >
            <span className="material-symbols-outlined text-base text-[#154212]">
              {action.icon}
            </span>

            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}