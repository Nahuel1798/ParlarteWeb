import { getTranslations } from "next-intl/server";
import AuthPanel from "@/components/auth/AuthPanel";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/login/LoginForm";

export default async function LoginPage() {
  const t = await getTranslations("auth.login");

  return (
    <AuthShell
      panel={
        <AuthPanel
          badge={t("badge")}
          quote={t("quote")}
          description={t("description")}
        />
      }
    >
      <div className="max-w-md w-full mx-auto">
        <LoginForm />
      </div>
    </AuthShell>
  );
}