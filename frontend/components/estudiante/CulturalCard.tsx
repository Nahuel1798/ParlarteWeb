import { getTranslations } from "next-intl/server";

export default async function CulturalCard() {
  const t = await getTranslations("estudiante");

  return (
    <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">

      <div className="relative h-36">

        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPzy_cLB0OPxL_QCeqvoEtZIr-2iZmI5YR5TEQLdOnEZH1cQMg4RWnqFa2U2lMGTLmND7z8ExoErTwSjAPmdSdkPItnrpbxLKfoynuK-iOAyk9duk3N5baGB0hlEJjzR0v1IvmhuHq87ITZqr4xDoi0_uADz0F1tNeOBH_bdqvH2GpVDZtQKlv6hXZcH2eTLK3oB8spGXGSBZ6juMtZoJeMA9LXtw6zxjRdpOZwbIb8CRoB180c5DY')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-tertiary-fixed">
            {t("culturalBadge")}
          </span>

          <h4 className="font-headline-md text-base font-semibold leading-tight">
            {t("culturalTitle")}
          </h4>
        </div>

      </div>

      <div className="flex flex-col justify-between p-6">

        <p className="text-xs leading-relaxed text-on-surface-variant">
          {t("culturalText")}
        </p>

        <div className="mt-5 flex items-center justify-between">

          <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">
              timer
            </span>

            {t("culturalReadTime")}
          </span>

          <button className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline">
            {t("culturalAction")}

            <span className="material-symbols-outlined text-[14px]">
              arrow_forward
            </span>
          </button>

        </div>

      </div>
    </section>
  );
}