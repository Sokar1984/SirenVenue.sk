import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { enabledLocales, isLocale } from "@/modules/i18n";
import { organizationJsonLd, pageMetadata } from "@/modules/seo";
import "../globals.css";

/** Per-locale title/description, `og:locale`, and hreflang alternates. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  return pageMetadata(locale);
}

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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
