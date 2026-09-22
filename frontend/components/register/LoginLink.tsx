"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LoginLink() {
  const t = useTranslations("auth.loginLink");

  return (
    <div className="mt-8 text-center">

      <p className="text-xs text-[#42493e]">

        {t("text")}{" "}

        <Link
          href="/login"
          className="text-[#9d422b] font-semibold text-xs underline ml-1 hover:text-[#74250f]"
        >
          {t("link")}
        </Link>

      </p>

    </div>
  );
}