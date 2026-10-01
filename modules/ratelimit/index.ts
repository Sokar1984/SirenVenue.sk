/**
 * Public entry for the ratelimit module.
 *
 * One fixed-window counter per (route, identity), persisted in the existing
 * RateLimit table. Nothing outside this module may import its internals.
 *
 * Wiring the limiter into an endpoint is a separate ticket; this module only
 * exposes the decision.
 */
import { WINDOW_MS, limitForRoute } from "./config";
import { hashIdentity } from "./identity";
import { createPrismaStore } from "./store";
import { checkFixedWindow, type RateLimitResult, type RateLimitStore } from "./window";

export type { RateLimitResult, RateLimitStore } from "./window";
export {
  WINDOW_SECONDS,
  WINDOW_MS,
  ROUTE_LIMITS,
  DEFAULT_PER_WINDOW,
  limitForRoute,
} from "./config";
export { hashIdentity, resolveSalt, SALT_FALLBACK } from "./identity";

let store: RateLimitStore = createPrismaStore();

/**
 * Swap the backing store. Intended for tests and alternative deployments, not
 * for per-request use.
 */
export function setRateLimitStore(next: RateLimitStore): void {
  store = next;
}

/**
 * Consume one request for `identity` on `route`.
 *
 * `identity` is a raw identifier (IP, api key, …); it is hashed before it ever
 * reaches the store, so the database only sees an opaque bucket.
 */
export async function checkLimit(
  route: string,
  identity: string,
): Promise<RateLimitResult> {
  const bucket = `${route}:${hashIdentity(identity)}`;
  return checkFixedWindow({
    store,
    bucket,
    limit: limitForRoute(route),
    windowMs: WINDOW_MS,
  });
}
