import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, matchLocale } from "@/modules/i18n";

/** Remembers a visitor's last chosen locale across bare-root visits. */
const LOCALE_COOKIE = "locale";

/**
 * The bare root carries no locale, so resolve one and send the visitor to the
 * localized index: a valid `locale` cookie first, then the best
 * `Accept-Language` match, then Slovak.
 */
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const fromCookie = cookie && isLocale(cookie) ? cookie : undefined;

  const locale =
    fromCookie ??
    matchLocale(request.headers.get("accept-language")) ??
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/"],
};
