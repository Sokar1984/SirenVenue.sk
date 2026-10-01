/**
 * GET /api/v1/health — cheap, unauthenticated liveness/readiness probe.
 *
 * Reports four things:
 *   - process:  the Node process answered (implied by the response itself),
 *   - database: a query actually reached Postgres,
 *   - content:  the content loader answered through its public read path,
 *   - buildId:  which build is running.
 *
 * The database is checked by calling `getLocales()` from `modules/content` —
 * the same public read path the rest of the site uses — and catching failure.
 * Prisma is never imported here. When that read fails the endpoint returns 503
 * and the shared error envelope: a health check that reports `ok` while the
 * database is down is worse than no health check at all.
 *
 * `getLocales()` is wrapped in `unstable_cache`, so a warm entry would answer
 * from memory even after Postgres went away — a false `ok`. The `content:locales`
 * tag is therefore invalidated first, forcing a real round-trip on every probe.
 * That tag is read by nothing but this endpoint, so the only cost is one tiny
 * `Locale` query per check, which is exactly what a probe should do.
 *
 * Cache-Control: `no-store`. A cached health result is not a health result.
 */
import { NextResponse } from "next/server";
import { CONTENT_TAGS, getLocales, revalidateContent } from "@/modules/content";
import { getBuildId } from "../_lib/build-id";
import { apiError } from "../_lib/http";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const startedAt = Date.now();

  try {
    revalidateContent(CONTENT_TAGS.locales);
    await getLocales();
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The database is not reachable, so the content loader is not healthy.",
    );
  }

  return NextResponse.json(
    {
      status: "ok",
      buildId: getBuildId(),
      uptimeSeconds: Math.round(process.uptime()),
      latencyMs: Date.now() - startedAt,
      checks: { process: "up", database: "up", content: "up" },
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
