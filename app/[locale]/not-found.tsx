"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { company, contact } from "@/content/legal";
import {
  defaultLocale,
  isLocale,
  message,
  type Locale,
} from "@/modules/i18n";
import { LangSwitch } from "@/modules/lang-switch";
import { geist } from "@/modules/tokens";

/**
 * The 404 a `notFound()` inside `[locale]` lands on (an unknown work slug).
 *
 * Why this is a client component and why its chrome is written out here
 * ---------------------------------------------------------------------
 * A `not-found.tsx` boundary receives no route props — Next.js renders it as
 * `<Component />` (see `createBoundaryConventionElement` in Next's app-render
 * tree), and `headers()` carries no path. So the locale is only knowable from
 * the router context, i.e. `usePathname` on the client. The locale layout still
 * owns the document (`<html lang>`, the localized title/description, JSON-LD);
 * this boundary only supplies the body.
 *
 * `Chrome` is exported from the locale layout and is reused by the root 404, but
 * it cannot be imported into a client boundary: its module also imports
 * `next/headers` for `LocaleLayout`, and that import is server-only. To avoid a
 * third arrangement, this file mirrors `Chrome`'s header and footer with the
 * same classes and `content/legal.ts` values. The root boundary uses the real
 * `Chrome`; only this client copy is duplicated, and only header/footer.
 *
 * `usePathname` is empty during the server pass, so the copy falls back to the
 * default locale until hydration; it is never English.
 */

/** Fill a locale's copy with its brand text linked to the default home. */
export function NotFoundNote({ locale }: { locale: Locale }) {
  const note = message(locale, "notFound.note");
  if (!note) return null;

  const brand = "sirenvenue.sk";
  const at = note.indexOf(brand);
  if (at === -1) {
    return <p className="note">{note}</p>;
  }

  return (
    <p className="note">
      {note.slice(0, at)}
      <Link href={`/${defaultLocale}`}>{brand}</Link>
      {note.slice(at + brand.length)}
    </p>
  );
}

export default function LocaleNotFound() {
  const pathname = usePathname();
  const segment = pathname?.split("/")[1] ?? "";
  const locale: Locale = isLocale(segment) ? segment : defaultLocale;

  const skip = message(locale, "skip");
  const lead = message(locale, "notFound.lead");
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
          <Link className="mark-name" href={`/${locale}`}>
            SirenVenue
          </Link>
          <span className="mark-legal">s.r.o.</span>
        </div>

        <LangSwitch locale={locale} path="" label={navLanguage ?? undefined} />
      </header>

      {lead ? <p className="colophon">{lead}</p> : null}

      <main id="main" tabIndex={-1}>
        <NotFoundNote locale={locale} />
      </main>

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
