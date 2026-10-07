import { NextResponse } from "next/server";
import { authenticateAdmin, createAdminSession } from "@/modules/content";
import { apiError } from "../../_lib/http";
import { checkLimit, hashIdentity, type RateLimitResult } from "@/modules/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(400, "invalid_request", "Invalid JSON body.");
  }

  const password =
    body && typeof body === "object" && "password" in body
      ? String((body as { password?: unknown }).password ?? "")
      : "";

  if (password.length === 0) {
    return apiError(400, "invalid_request", "Password is required.");
  }

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const firstHop = forwarded.split(",")[0].trim() || "unknown";
  const identity = hashIdentity(firstHop);

  let limit: RateLimitResult;
  try {
    limit = await checkLimit("admin.login", identity);
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
      "Rate limit exceeded for login attempts.",
    );
    response.headers.set("Retry-After", String(limit.retryAfterSeconds));
    return response;
  }

  let auth: { userId: string } | null;
  try {
    auth = await authenticateAdmin(password);
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The admin store is temporarily unavailable.",
    );
  }

  if (!auth) {
    return apiError(401, "unauthorized", "Invalid credentials.");
  }

  let rawToken: string;
  try {
    rawToken = await createAdminSession(auth.userId);
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The admin store is temporarily unavailable.",
    );
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set("sv_admin", rawToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
