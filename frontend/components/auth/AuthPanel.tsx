import { ReactNode } from "react";

interface AuthPanelProps {
  badge: string;
  quote: string;
  description: string;
  children?: ReactNode;
}

const PANEL_BG =
  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwWwYKTTWAnGKUVdY_mK3LN-IAMgLiu2XWJdil2ENp7LiqojaWNYyEsE30NEuj5QvIlq-gAMqN9Rz3GBOTJ3FvSYIsAf4yoZ8YZGj44Izhj9KoeCmZy-5i3uriwVZAsNETfk11WgQhxRoWQnv3N-AmLJ-XGt9V8RKTqQDrdaH-5oq3P78kNuPgLJp07rQCh8_ZycF4o53w3b_NX1X1nQXE-_AuXWAmV4eOPB-_s-1MU4zFUQkCxWME')";

export default function AuthPanel({
  badge,
  quote,
  description,
  children,
}: AuthPanelProps) {
  return (
    <div className="relative w-full md:w-5/12 bg-[#154212] flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-white min-h-[420px] md:min-h-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: PANEL_BG }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#154212] via-[#154212]/80 to-transparent pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#cca730]/30 flex items-center justify-center backdrop-blur-sm text-lg">
          📖
        </div>
        <div className="flex flex-col">
          <span className="text-xs tracking-widest uppercase font-semibold">
            Parlarte
          </span>
          <span className="text-[10px] text-[#a1d494] tracking-wider uppercase">
            Accademia di Lingua 
          </span>
        </div>
      </div>

      <div className="relative z-10 my-auto pt-12">
        <div className="inline-flex items-center gap-2 mb-4 px-2 py-1 rounded bg-white/15 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9d422b]" />
          <span className="text-[10px] uppercase tracking-wider">{badge}</span>
        </div>

        <blockquote className="text-2xl sm:text-3xl font-serif italic leading-tight mb-4">
          {quote}
        </blockquote>

        <p className="text-sm text-[#a1d494]/90 leading-relaxed">
          {description}
        </p>

        {children}
      </div>
    </div>
  );
}