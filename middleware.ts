import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, matchLocale } from "@/modules/i18n";

/** Remembers a visitor's last chosen locale across bare-root visits. */
const LOCALE_COOKIE = "locale";

/**
 * A fresh, unguessable nonce per document request. `crypto` and `btoa` are
 * available on the Edge runtime; the value matches Next.js' nonce grammar
 * (`[A-Za-z0-9+/_-]+={0,2}`) so it can be lifted back out of the header.
 */
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/**
 * No wildcards, no `unsafe-inline`, no `unsafe-eval`.
 *
 * `'strict-dynamic'` lets the nonced Next.js bootstrap load its own chunks;
 * `'self'` remains as the fallback for browsers without strict-dynamic.
 * `style-src` carries the nonce because Next.js stamps it on the stylesheet
 * links and any inline styles it emits — `'self'` already covers the CSS, but
 * the nonce keeps the framework's own markup valid if it inlines. No
 * `unsafe-inline` is needed for styles or scripts. `frame-ancestors 'none'` is
 * the real clickjacking defence (X-Frame-Options is belt-and-braces).
 */
function contentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
  ].join("; ");
}

/**
 * The bare root carries no locale, so resolve one and send the visitor to the
 * localized index: a valid `locale` cookie first, then the best
 * `Accept-Language` match, then Slovak.
 *
 * Every other matched document gets a per-request nonce and CSP. The nonce is
 * set on the *request* headers so Next.js can stamp its own bootstrap scripts,
 * and echoed on the response so the browser enforces it.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    const nonce = generateNonce();
    const csp = contentSecurityPolicy(nonce);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

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
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    },
  ],
};
