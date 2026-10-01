"use client";

import Link from "next/link";
import { enabledLocales, localeLabel, type Locale } from "@/modules/i18n";

/** Matches the cookie the root redirect reads in `middleware.ts`. */
const LOCALE_COOKIE = "locale";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Records the visitor's pick so `/` sends them here next time. */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

type LangSwitchProps = {
  /** The locale the current document is rendered in. */
  locale: Locale;
  /**
   * Path after the locale segment, e.g. `""` for the index or
   * `"/work/sirenvenue-com"` for a case page. Each entry links to the same
   * path in the target locale.
   */
  path?: string;
};

/**
 * The one locale switcher. A quiet, always-visible row of links — no dropdown,
 * no menu button — with the current locale marked `is-active`/`aria-current`.
 * Picking a locale drops a cookie and navigates to the same path in that
 * locale.
 */
export function LangSwitch({ locale, path = "" }: LangSwitchProps) {
  return (
    <nav className="locales" aria-label="Language">
      {enabledLocales.map((candidate) => {
        const active = candidate === locale;
        return (
          <Link
            key={candidate}
            href={`/${candidate}${path}`}
            className={active ? "locale is-active" : "locale"}
            aria-current={active ? "page" : undefined}
            onClick={() => remember(candidate)}
          >
            {localeLabel(candidate)}
          </Link>
        );
      })}
    </nav>
  );
}
