/**
 * GET /api/v1/works — published works, resolved for one locale.
 *
 * The rows are read through `modules/content`'s `getWorks(locale)`, the only
 * public read path to the database. This handler never touches Prisma.
 *
 * Ordering is explicit: rows are sorted by their persisted `sortOrder` (then
 * slug as a stable tie-breaker), so display order is a property of the data,
 * not of whatever order the driver happened to return.
 *
 * Cache-Control
 * -------------
 *   public, max-age=0, s-maxage=300, stale-while-revalidate=86400
 *
 *   - `public`      — no auth, no cookies, identical for every caller.
 *   - `max-age=0`   — browsers revalidate on navigation; avoids pinning a
 *                     stale locale view in a long-lived tab.
 *   - `s-maxage=300`— shared/CDN caches may serve for five minutes. The
 *                     portfolio changes rarely and by hand.
 *   - `stale-while-revalidate=86400` — for a day, serve the stale copy while
 *                     the cache refreshes in the background, so an edit never
 *                     blocks a visitor.
 */
import { NextResponse } from "next/server";
import { getWorks } from "@/modules/content";
import { apiError } from "../_lib/http";
import { resolveLocale } from "../_lib/locale";

export const dynamic = "force-dynamic";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

export async function GET(request: Request): Promise<Response> {
  const resolved = resolveLocale(request);
  if (!resolved.ok) {
    return apiError(
      400,
      "invalid_locale",
      `Unknown locale "${resolved.requested}".`,
    );
  }

  try {
    const works = await getWorks(resolved.locale);
    const ordered = [...works].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug),
    );

    return NextResponse.json(
      { locale: resolved.locale, count: ordered.length, works: ordered },
      { headers: { "Cache-Control": CACHE_CONTROL } },
    );
  } catch {
    return apiError(
      503,
      "content_unavailable",
      "The works catalogue is temporarily unavailable.",
    );
  }
}
