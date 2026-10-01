/**
 * Locale negotiation for `/api/v1/works`.
 *
 * Precedence, as specified by SOK-244:
 *   1. an explicit `?locale=` query parameter,
 *   2. the `Accept-Language` request header,
 *   3. the site default (`sk`).
 *
 * An explicit but unknown locale is a client error, never a silent fallback:
 * returning Slovak for `?locale=xx` would hand the caller the wrong market's
 * copy with no signal. A `*` or unmatched header, by contrast, is not a
 * client error — it just means "no preference", so it falls back.
 */
import {
  defaultLocale,
  isLocale,
  matchLocale,
  type Locale,
} from "@/modules/i18n";

export type LocaleResolution =
  | { ok: true; locale: Locale }
  | { ok: false; requested: string };

export function resolveLocale(request: Request): LocaleResolution {
  const requested = new URL(request.url).searchParams.get("locale");

  if (requested !== null) {
    return isLocale(requested)
      ? { ok: true, locale: requested }
      : { ok: false, requested };
  }

  return {
    ok: true,
    locale: matchLocale(request.headers.get("accept-language")) ?? defaultLocale,
  };
}
