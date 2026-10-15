import type { Locale } from "@/modules/i18n";

/** BCP 47 tag for a locale code. German is served as Austrian German. */
export function localeHreflang(locale: Locale): string {
  if (locale === "es-ve") return "es-VE";
  if (locale === "de") return "de-AT";
  return locale;
}
