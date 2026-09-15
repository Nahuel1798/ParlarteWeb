import Card from "@/components/ui/Card";
import ToneBadge from "@/components/ui/ToneBadge";

const alerts = [
  {
    title: "3 certificati MCER in attesa di revisione",
    detail: "Richiesta docenze — scadenza oggi",
    icon: "certificate",
    tone: "secondary",
    badge: "error",
  },
  {
    title: "Aula 3 richiede manutenzione",
    detail: "Contratto manutenzione in scadenza",
    icon: "building",
    tone: "tertiary",
    badge: "warning",
  },
  {
    title: "Nuove iscrizioni in attesa",
    detail: "+24 richieste nell'ultima settimana",
    icon: "how_to_reg",
    tone: "primary",
    badge: "success",
  },
];

const iconText = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

const iconBg = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  tertiary: "bg-tertiary/10",
};

export default function OperationalAlerts() {
  return (
    <Card
      title="Allerte Operative"
      action={
        <ToneBadge tone="neutral">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          {alerts.length}
        </ToneBadge>
      }
    >
      <div className="flex flex-col divide-y divide-surface-container">
        {alerts.map((alert) => (
          <div key={alert.title} className="flex items-start gap-3 py-3">
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                iconBg[alert.tone as keyof typeof iconBg]
              }`}
            >
              <span
                className={`material-symbols-outlined text-lg ${
                  iconText[alert.tone as keyof typeof iconText]
                }`}
              >
                {alert.icon}
              </span>
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold">{alert.title}</span>
              <span className="text-xs text-on-surface-variant">
                {alert.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}