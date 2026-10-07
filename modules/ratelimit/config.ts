/**
 * Rate-limit policy constants.
 *
 * Kept dependency-free (no imports) so the same file can be exercised directly
 * by `scripts/check-ratelimit.mjs` under Node's type stripping, without a build
 * step and without a database.
 */

/** Length of the fixed window. One minute keeps retry-after values intuitive. */
export const WINDOW_SECONDS = 60;
export const WINDOW_MS = WINDOW_SECONDS * 1000;

/**
 * Ceiling for the AI door.
 *
 * AI requests are the only route that spends real money per call (model tokens)
 * and they can be triggered by an unauthenticated visitor. An unbounded loop or
 * a scripted attacker can therefore burn the budget for every other user. Ten
 * requests per identity per minute is generous for a human filling a form, while
 * still capping a single identity's worst-case spend to a small, predictable
 * amount even if every call runs to the token ceiling. This is intentionally the
 * tightest limit in the map below; any looser route is cheaper per hit.
 */
export const AI_DOOR_PER_WINDOW = 10;

/** Fallback for routes that are not explicitly listed (e.g. cheap reads). */
export const DEFAULT_PER_WINDOW = 30;

/**
 * Per-route limits, in requests per {@link WINDOW_SECONDS} window.
 * Unknown routes fall back to {@link DEFAULT_PER_WINDOW}.
 */
export const ROUTE_LIMITS = {
  "ai.door": AI_DOOR_PER_WINDOW,
  "ai.stream": AI_DOOR_PER_WINDOW,
  "admin.login": AI_DOOR_PER_WINDOW,
  "admin.copy": DEFAULT_PER_WINDOW,
} as const;

/** Resolve the limit for a route, falling back to the default. */
export function limitForRoute(route: string): number {
  const limits = ROUTE_LIMITS as Record<string, number>;
  return limits[route] ?? DEFAULT_PER_WINDOW;
}
