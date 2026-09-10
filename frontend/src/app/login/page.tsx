import AuthPanel from "@/components/auth/AuthPanel";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      panel={
        <AuthPanel
          badge="Campus Virtual Accademico"
          quote="«Chi conosce la lingua, conosce il mondo.»"
          description="Accede a tu portal formativo y continúa tu viaje hacia la excelencia lingüística y cultural italiana."
        />
      }
    >
      <div className="max-w-md w-full mx-auto">
        <LoginForm />
      </div>
    </AuthShell>
  );
}