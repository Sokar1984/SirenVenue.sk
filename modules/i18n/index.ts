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

export {
  messageKeys,
  messageLocales,
  catalog,
  declaredMissing,
  isDeclaredMissing,
  format,
  message,
  messageRows,
  type MessageKey,
  type MessageCatalog,
  type MessageParams,
  type MessageRow,
  type DeclaredMissing,
} from "./messages";
