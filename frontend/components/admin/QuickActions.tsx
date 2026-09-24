import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const actions = [
  { labelKey: "quickNuovoCorso", icon: "add_circle", href: "/curso/nuevo" },
  { labelKey: "quickNuevaInscripcion", icon: "person_add", href: "/admin/inscripciones/nueva" },
  { labelKey: "quickInscripciones", icon: "how_to_reg", href: "/admin/inscripciones" },
  { labelKey: "quickReport", icon: "receipt_long" },
];

export default async function QuickActions() {
  const t = await getTranslations("admin");

  return (
    <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-container-low p-3">
      <div className="flex items-center gap-2 px-3">
        <span className="material-symbols-outlined text-primary">bolt</span>

        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t("quickLabel")}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const className =
            "flex items-center gap-2 rounded bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-on-surface shadow-sm transition hover:bg-surface-container-high";

          if (action.href) {
            return (
              <Link
                key={action.labelKey}
                href={action.href}
                className={className}
              >
                <span className="material-symbols-outlined text-base text-primary">
                  {action.icon}
                </span>

                {t(action.labelKey)}
              </Link>
            );
          }

          return (
            <button key={action.labelKey} className={className}>
              <span className="material-symbols-outlined text-base text-primary">
                {action.icon}
              </span>

              {t(action.labelKey)}
            </button>
          );
        })}
      </div>
    </section>
  );
}