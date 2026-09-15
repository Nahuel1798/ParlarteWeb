const resources = [
  {
    title: "Biblioteca Filologica",
    description: "Grammatiche & Testi PDF",
    icon: "auto_stories",
  },
  {
    title: "Caffè Italiano Podcast",
    description: "Ep. 42: L'Arte del Gesto",
    icon: "podcasts",
  },
  {
    title: "Circolo Studentesco",
    description: "3 stanze audio attive ora",
    icon: "groups",
  },
];

export default function Resources() {
  return (
    <section>
      <h2 className="mb-3 font-headline-md text-xl font-semibold tracking-tight text-primary">
        Strumenti Accademici & Risorse
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

        {resources.map((resource) => (
          <button
            key={resource.title}
            className="group flex items-center gap-3 rounded-xl bg-surface-container-low p-3 text-left shadow-sm transition-colors hover:bg-surface-container-high"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[22px]">
                {resource.icon}
              </span>
            </div>

            <div className="min-w-0">
              <span className="block truncate text-xs font-semibold">
                {resource.title}
              </span>

              <span className="block text-[11px] text-on-surface-variant">
                {resource.description}
              </span>
            </div>
          </button>
        ))}

      </div>
    </section>
  );
}