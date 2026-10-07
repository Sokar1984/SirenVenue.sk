import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSession, setHomepageCopy } from "@/modules/content";
import { apiError } from "../../_lib/http";
import { checkLimit, type RateLimitResult } from "@/modules/ratelimit";
import { isLocale } from "@/modules/i18n";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sv_admin")?.value ?? null;

  let session: { userId: string } | null;
  try {
    session = await getAdminSession(token);
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The admin session store is temporarily unavailable.",
    );
  }

  if (!session) {
    return apiError(401, "unauthorized", "Not authenticated.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, "invalid_request", "Invalid JSON body.");
  }

  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const locale = typeof b.locale === "string" ? b.locale : "";

  if (!isLocale(locale)) {
    return apiError(400, "invalid_locale", `Unknown locale "${locale}".`);
  }

  const partial: Partial<{ identity: string; client: string; blink: string }> = {};
  if (typeof b.identity === "string") partial.identity = b.identity;
  if (typeof b.client === "string") partial.client = b.client;
  if (typeof b.blink === "string") partial.blink = b.blink;

  if (Object.keys(partial).length === 0) {
    return apiError(
      400,
      "invalid_request",
      "At least one of identity, client, blink must be provided.",
    );
  }

  const userId = session.userId;
  let limit: RateLimitResult;
  try {
    limit = await checkLimit("admin.copy", userId);
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The rate limiter is not reachable.",
    );
  }

  if (!limit.allowed) {
    const response = apiError(
      429,
      "rate_limited",
      "Rate limit exceeded for copy updates.",
    );
    response.headers.set("Retry-After", String(limit.retryAfterSeconds));
    return response;
  }

  try {
    await setHomepageCopy(locale, partial);
  } catch {
    return apiError(
      503,
      "content_unavailable",
      "The content store is temporarily unavailable.",
    );
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
