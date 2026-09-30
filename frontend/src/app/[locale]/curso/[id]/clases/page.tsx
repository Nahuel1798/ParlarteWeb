import { redirect } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

export default async function CursoClasesPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    redirect({ href: "/curso", locale: routing.defaultLocale });
  }

  redirect({ href: `/curso/${id}`, locale: locale as Locale });
}
