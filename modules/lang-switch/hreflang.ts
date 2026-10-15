import type { Locale } from "@/modules/i18n";

/** BCP 47 tag for a locale code. Only Venezuelan Spanish needs a region. */
export function localeHreflang(locale: Locale): string {
  return locale === "es-ve" ? "es-VE" : locale;
}
