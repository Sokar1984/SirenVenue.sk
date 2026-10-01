/**
 * GET /api/v1/locales — the enabled locales and their display metadata.
 *
 * Sourced from `modules/i18n` (the canonical catalogue and its label rule), not
 * from the database: the set of locales is a deployment decision, so this route
 * stays correct even while the database is down.
 *
 * Cache-Control
 * -------------
 *   public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
 *
 *   - `public`      — identical for every caller.
 *   - `max-age=3600`— browsers may reuse for an hour.
 *   - `s-maxage=86400` — the set changes only on deploy, so a day at the CDN.
 *   - `stale-while-revalidate=604800` — a week of background refresh, so a
 *                     redeploy never front-runs a cache miss to every visitor.
 */
import { NextResponse } from "next/server";
import { defaultLocale, enabledLocales, localeLabel } from "@/modules/i18n";

const CACHE_CONTROL =
  "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

export function GET(): Response {
  const locales = enabledLocales.map((code) => ({
    code,
    label: localeLabel(code),
  }));

  return NextResponse.json(
    { defaultLocale, count: locales.length, locales },
    { headers: { "Cache-Control": CACHE_CONTROL } },
  );
}
