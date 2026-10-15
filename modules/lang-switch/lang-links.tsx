import { enabledLocales, localeLabel, type Locale } from "@/modules/i18n";
import { localeHreflang } from "./hreflang";

/**
 * Plain, crawlable links to the current page in every locale. The footer's
 * quiet counterpart to `LangSwitch`: same module, so the locale list still
 * lives in one place. No script, no cookie. The root redirect only needs the
 * cookie for the bare `/`, and these links never point there.
 */
export function LangLinks({
  locale,
  path,
  label,
}: {
  locale: Locale;
  path: string;
  label?: string;
}) {
  return (
    <nav className="lang-links" aria-label={label}>
      {enabledLocales.map((code) =>
        code === locale ? (
          <span key={code} className="lang-link is-current" aria-current="page">
            {localeLabel(code)}
          </span>
        ) : (
          <a
            key={code}
            className="lang-link"
            href={`/${code}${path}`}
            hrefLang={localeHreflang(code)}
            lang={localeHreflang(code)}
          >
            {localeLabel(code)}
          </a>
        ),
      )}
    </nav>
  );
}
