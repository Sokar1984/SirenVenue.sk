import type { Metadata } from "next";
import { headers } from "next/headers";
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

  // Reading the per-request nonce opts this route into dynamic rendering: a
  // statically prerendered document cannot carry a fresh nonce, and a stale
  // one would be rejected by the CSP. Next.js stamps the same nonce onto its
  // own bootstrap scripts from the request header.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={locale}>
      <body>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
