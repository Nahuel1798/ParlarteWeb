import { getTranslations } from "next-intl/server";
import Card from "@/components/ui/Card";
import ToneBadge from "@/components/ui/ToneBadge";

const alerts = [
  {
    titleKey: "alerts1Title",
    detailKey: "alerts1Detail",
    icon: "certificate",
    tone: "secondary" as const,
    badge: "error" as const,
  },
  {
    titleKey: "alerts2Title",
    detailKey: "alerts2Detail",
    icon: "building",
    tone: "tertiary" as const,
    badge: "warning" as const,
  },
  {
    titleKey: "alerts3Title",
    detailKey: "alerts3Detail",
    icon: "how_to_reg",
    tone: "primary" as const,
    badge: "success" as const,
  },
];

const iconText: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

const iconBg: Record<string, string> = {
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  tertiary: "bg-tertiary/10",
};

export default async function OperationalAlerts() {
  const t = await getTranslations("admin");

  return (
    <Card
      title={t("alertsTitle")}
      action={
        <ToneBadge tone="neutral">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          {alerts.length}
        </ToneBadge>
      }
    >
      <div className="flex flex-col divide-y divide-surface-container">
        {alerts.map((alert) => (
          <div key={alert.titleKey} className="flex items-start gap-3 py-3">
            <div
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                iconBg[alert.tone]
              }`}
            >
              <span
                className={`material-symbols-outlined text-lg ${
                  iconText[alert.tone]
                }`}
              >
                {alert.icon}
              </span>
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold">
                {t(alert.titleKey)}
              </span>
              <span className="text-xs text-on-surface-variant">
                {t(alert.detailKey)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}