/**
 * Public entry for the i18n module.
 *
 * Nothing outside this module may import its internals; everything locale
 * related is re-exported here.
 */
export {
  locales,
  enabledLocales,
  defaultLocale,
  isLocale,
  localeLabel,
  matchLocale,
  type Locale,
} from "./locales";
