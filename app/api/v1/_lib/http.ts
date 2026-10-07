/**
 * Shared HTTP helpers for the public `/api/v1` surface.
 *
 * Every failure — validation, missing content, or an unreachable database —
 * uses the same envelope so clients can parse one shape:
 *
 *   { "error": { "code": "...", "message": "..." } }
 *
 * `code` is a stable, machine-readable token; `message` is for humans and may
 * change. `_lib` is a private folder, so Next never turns it into a route.
 */

/** Stable machine-readable error tokens for the v1 surface. */
export type ApiErrorCode =
  | "invalid_locale"
  | "content_unavailable"
  | "database_unavailable"
  | "unauthorized"
  | "rate_limited"
  | "ai_door_disabled"
  | "provider_unconfigured"
  | "invalid_request";

/** Builds a JSON error response with the one shared envelope. */
export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
): Response {
  return Response.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
