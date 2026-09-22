import { getTranslations } from "next-intl/server";

const resources = [
  {
    titleKey: "resources1Title",
    descriptionKey: "resources1Description",
    icon: "auto_stories",
  },
  {
    titleKey: "resources2Title",
    descriptionKey: "resources2Description",
    icon: "podcasts",
  },
  {
    titleKey: "resources3Title",
    descriptionKey: "resources3Description",
    icon: "groups",
  },
];

export default async function Resources() {
  const t = await getTranslations("estudiante");

  return (
    <section>
      <h2 className="mb-3 font-headline-md text-xl font-semibold tracking-tight text-primary">
        {t("resourcesTitle")}
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

        {resources.map((resource) => (
          <button
            key={resource.titleKey}
            className="group flex items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left shadow-sm transition-colors hover:bg-surface-container-high"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">
                {resource.icon}
              </span>
            </div>

            <div className="min-w-0">
              <span className="block truncate text-xs font-semibold">
                {t(resource.titleKey)}
              </span>

              <span className="block text-[11px] text-on-surface-variant">
                {t(resource.descriptionKey)}
              </span>
            </div>
          </button>
        ))}

      </div>
    </section>
  );
}