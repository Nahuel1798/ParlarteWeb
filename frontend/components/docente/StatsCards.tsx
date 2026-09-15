import StatCard from "@/components/ui/StatCard";

export default function StatsCards() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="Programma Odierno"
        value="3"
        icon="co_present"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-on-surface">
              <span className="font-semibold">24 Studenti</span>{" "}
              <span className="text-on-surface-variant">attesi nelle aule</span>
            </span>

            <span className="text-xs font-semibold text-primary">
              100% capienza
            </span>
          </div>
        }
      />

      <StatCard
        title="Revisioni in Attesa"
        value="12"
        icon="rate_review"
        tone="secondary"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-on-surface">
              <span className="font-semibold">4 Prioritarie</span>{" "}
              <span className="text-on-surface-variant">
                scadenza entro 24h
              </span>
            </span>

            <span className="text-xs font-semibold text-primary">
              Compiti B1 & C1
            </span>
          </div>
        }
      />

      <StatCard
        title="Valutazione Didattica"
        value="4.9"
        suffix="/ 5.0"
        icon="stars"
        tone="tertiary"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex text-tertiary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className="material-symbols-outlined text-[16px]"
                  >
                    star
                  </span>
                ))}
              </div>

              <span className="text-xs text-on-surface-variant">
                (48 recensioni)
              </span>
            </div>

            <span className="text-xs font-semibold text-primary">
              Semestre II
            </span>
          </div>
        }
      />
    </div>
  );
}