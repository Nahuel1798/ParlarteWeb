export default function AdminHeader() {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-20 bg-[#fcf9f2]/80 backdrop-blur-xl z-40 flex items-center justify-between px-4 md:px-6 shadow-sm">

      <div className="flex items-center gap-3">
        <span className="font-playfair text-xl font-medium">
          Campus Virtual
        </span>

        <span className="h-4 w-px bg-[#c2c9bb]" />

        <span className="text-xs text-[#42493e] hidden sm:block">
          Anno Accademico 2024–2025
        </span>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden xl:flex items-center gap-2 bg-[#f6f3ec] px-3 py-2 rounded-xl">
          <span className="text-xs text-[#42493e]">
            Contesto:
          </span>

          <div className="flex items-center gap-1 text-[#154212] text-xs font-semibold">
            <span className="material-symbols-outlined text-base">
              school
            </span>

            <span>Sede Centrale Firenze</span>
          </div>
        </div>

        <button className="p-2 rounded-full hover:bg-[#ebe8e1]">
          <span className="material-symbols-outlined">
            notifications
          </span>
        </button>

        <button className="p-2 rounded-full hover:bg-[#ebe8e1]">
          <span className="material-symbols-outlined">
            search
          </span>
        </button>

        <button className="p-2 rounded-full hover:bg-[#ebe8e1]">
          <span className="material-symbols-outlined">
            help
          </span>
        </button>

        <div className="h-6 w-px bg-[#c2c9bb]" />

        <div className="w-8 h-8 rounded-full bg-[#154212] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg">
            person
          </span>
        </div>

      </div>
    </header>
  );
}