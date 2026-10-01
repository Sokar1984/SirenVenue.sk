import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { company, contact } from "@/content/legal";
import { enabledLocales, isLocale, message, type Locale } from "@/modules/i18n";
import { LangSwitch } from "@/modules/lang-switch";
import { organizationJsonLd, pageMetadata } from "@/modules/seo";
import { geist } from "@/modules/tokens";
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

type ChromeProps = {
  /** The locale this document is rendered in. Index page passes it through. */
  locale: Locale;
  /**
   * Path after the locale segment, handed to `LangSwitch` so switching locales
   * keeps the visitor on the same page.
   */
  path: string;
  /** True on the index, whose mark is already home and stays a plain span. */
  home?: boolean;
  children: React.ReactNode;
};

/**
 * The one definition of the chrome. Both routes compose it; neither carries its
 * own shell, skip link, header, or footer. Every catalog string is resolved with
 * `message`, and a `null` (missing or declared missing) omits its element rather
 * than falling back to English.
 *
 * It lives beside the document segment so the chrome and the `<html>`/`<body>`
 * boundary are authored in one file, but it is rendered by the route because
 * only the route knows its own path (`LangSwitch`) and whether it is the index.
 * The layout itself only owns the document; see `LocaleLayout` below.
 */
export function Chrome({ locale, path, home = false, children }: ChromeProps) {
  const skip = message(locale, "skip");
  const navLanguage = message(locale, "nav.language");

  return (
    <div className={`shell ${geist.variable}`}>
      {skip ? (
        <a className="skip" href="#main">
          {skip}
        </a>
      ) : null}

      <header className="head">
        <div className="mark">
          {home ? (
            <span className="mark-name">SirenVenue</span>
          ) : (
            <Link className="mark-name" href={`/${locale}`}>
              SirenVenue
            </Link>
          )}
          <span className="mark-legal">s.r.o.</span>
        </div>

        <LangSwitch locale={locale} path={path} label={navLanguage ?? undefined} />
      </header>

      {children}

      <footer className="foot">
        <div className="strip">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span>{contact.city}</span>
        </div>
        <div className="strip legal">
          <span>{company.name}</span>
          <span>{company.seat}</span>
          <span>IČO {company.ico}</span>
        </div>
      </footer>
    </div>
  );
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
