const alerts = [
  {
    title: "3 certificati MCER in attesa di revisione",
    detail: "Richiesta docenze — scadenza oggi",
    icon: "certificate",
    tone: "text-[#9d422b]",
    bg: "bg-[#f7e5e1]",
  },
  {
    title: "Aula 3 richiede manutenzione",
    detail: "Contratto manutenzione in scadenza",
    icon: "building",
    tone: "text-[#735c00]",
    bg: "bg-[#f6f0d8]",
  },
  {
    title: "Nuove iscrizioni in attesa",
    detail: "+24 richieste nell'ultima settimana",
    icon: "how_to_reg",
    tone: "text-[#2d5a27]",
    bg: "bg-[#e7f0e6]",
  },
];

export default function OperationalAlerts() {
  return (
    <section className="bg-white rounded-xl shadow-sm px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-playfair text-lg font-semibold">
          Allerte Operative
        </h2>

        <span className="bg-[#9d422b] text-white text-xs px-2 py-1 rounded-full font-semibold">
          {alerts.length}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-[#f0eee7]">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-start gap-3 py-3"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${alert.bg}`}
            >
              <span className={`material-symbols-outlined text-lg ${alert.tone}`}>
                {alert.icon}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold">{alert.title}</span>
              <span className="text-xs text-[#42493e]">{alert.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}