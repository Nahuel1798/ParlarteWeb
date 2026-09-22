import { getTranslations } from "next-intl/server";
import AuthPanel from "@/components/auth/AuthPanel";
import AuthShell from "@/components/auth/AuthShell";
import Benefit from "@/components/register/Benefit";
import RegistrationForm from "@/components/register/RegistrationForm";
import LoginLink from "@/components/register/LoginLink";

export default async function RegistroPage() {
  const t = await getTranslations("auth.register");

  return (
    <AuthShell
      panel={
        <AuthPanel
          badge={t("badge")}
          quote={t("quote")}
          description={t("description")}
        >
          <div className="space-y-3 pt-4">
            <Benefit text={t("benefit1")} />
            <Benefit text={t("benefit2")} />
            <Benefit text={t("benefit3")} />
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