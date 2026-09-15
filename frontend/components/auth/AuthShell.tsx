import Link from "next/link";
import { ReactNode } from "react";

interface AuthShellProps {
  panel: ReactNode;
  children: ReactNode;
}

export default function AuthShell({ panel, children }: AuthShellProps) {
  return (
    <main className="min-h-dvh bg-[#fcf9f2] flex items-stretch justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row md:min-h-[min(100dvh-4rem,900px)] mx-auto">
        {panel}
        <div className="md:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 w-fit text-xs font-semibold uppercase tracking-wider text-[#42493e] hover:text-[#154212] transition-colors"
          >
            <span className="text-sm leading-none">←</span>
            Volver al inicio
          </Link>
          {children}
        </div>
      </div>
    </main>
  );
}