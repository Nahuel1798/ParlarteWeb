"use client";

export default function WordOfDay() {

  const speakWord = () => {
    if (typeof window === "undefined") return;

    const speech = window.speechSynthesis;

    if (!speech) return;

    speech.cancel();

    const utterance = new SpeechSynthesisUtterance("Mozzafiato");
    utterance.lang = "it-IT";

    speech.speak(utterance);
  };

  return (
    <section className="relative overflow-hidden rounded-xl bg-primary p-6 text-on-primary shadow-sm">

      <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary-container/40" />

      <div className="relative z-10">

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-on-primary-container">
            Vocabolario d&apos;Autore
          </span>

          <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
            translate
          </span>
        </div>

        <div className="mt-3">
          <span className="font-headline-md text-2xl italic text-surface-bright">
            Mozzafiato
          </span>

          <span className="ml-1 text-xs text-on-primary-container">
            [mot-tsa-fià-to] • agg.
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-inverse-on-surface">
          Letteralmente:{" "}
          <em>&quot;che toglie il fiato&quot;</em>. Straordinario per bellezza,
          emozione o intensità emotiva.
        </p>

        <div className="mt-3 rounded bg-primary-container/60 p-2 text-[11px] italic text-inverse-on-surface">
          &quot;Dalla cima della cupola del Brunelleschi si gode una vista
          mozzafiato su tutta Firenze.&quot;
        </div>

      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between">

        <button
          onClick={speakWord}
          className="flex items-center gap-1 text-xs font-semibold text-on-primary transition-colors hover:text-tertiary-fixed"
        >
          <span className="material-symbols-outlined text-[16px]">
            volume_up
          </span>

          Ascolta Pronuncia
        </button>

        <button className="text-on-primary-container hover:text-white">
          <span className="material-symbols-outlined text-[18px]">
            bookmark_border
          </span>
        </button>

      </div>

    </section>
  );
}