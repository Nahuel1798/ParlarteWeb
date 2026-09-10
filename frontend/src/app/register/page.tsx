import AuthPanel from "@/components/auth/AuthPanel";
import AuthShell from "@/components/auth/AuthShell";
import Benefit from "@/components/register/Benefit";
import RegistrationForm from "@/components/register/RegistrationForm";
import LoginLink from "@/components/register/LoginLink";

export default function RegistroPage() {
  return (
    <AuthShell
      panel={
        <AuthPanel
          badge="Anno Accademico 2025–2026"
          quote="«Il viaggio di mille miglia comincia con un solo passo.»"
          description="Inizia il tuo percorso nell'eleganza della lingua e nell'eredità culturale italiana."
        >
          <div className="space-y-3 pt-4">
            <Benefit text="Acceso al Campus Virtual y aulas multimedia." />
            <Benefit text="Tutorías directas con docentes certificados." />
            <Benefit text="Recursos interactivos semanales." />
          </div>
        </AuthPanel>
      }
    >
      <div className="max-w-md w-full mx-auto">
        <RegistrationForm />
        <LoginLink />
      </div>
    </AuthShell>
  );
}