import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { enabledLocales, isLocale } from "@/modules/i18n";
import "../globals.css";

export const metadata: Metadata = {
  title: "SirenVenue",
  description: "SirenVenue s.r.o. — software & systems",
};

/** Only the enabled locales exist; anything else is a 404, never a fallback. */
export const dynamicParams = false;

export function generateStaticParams() {
  return enabledLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
