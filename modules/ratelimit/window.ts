/**
 * Pure fixed-window counter logic.
 *
 * This file has no imports on purpose: it is the part of the module that must
 * run without a database, so `scripts/check-ratelimit.mjs` can import it
 * directly under Node's type stripping. All persistence happens through the
 * {@link RateLimitStore} interface, which the Prisma-backed store implements and
 * an in-memory object can fake in tests.
 */

/** Result of a single rate-limit decision. */
export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

/**
 * Minimal persistence contract for the limiter.
 *
 * Implementations MUST increment atomically: two concurrent callers for the
 * same bucket and window can never observe the same resulting count.
 */
export interface RateLimitStore {
  increment(bucket: string, windowStart: Date): Promise<number>;
}

export interface FixedWindowInput {
  store: RateLimitStore;
  bucket: string;
  limit: number;
  windowMs: number;
  /** Injectable clock (ms since epoch) so tests need no real time. */
  nowMs?: number;
}

/** Start of the fixed window that contains `nowMs`, as ms since epoch. */
export function windowStartFor(nowMs: number, windowMs: number): number {
  return Math.floor(nowMs / windowMs) * windowMs;
}

/**
 * Seconds until the current window rolls over, rounded up so a client is never
 * told to retry before the window has actually reset. Never negative.
 */
export function retryAfterSeconds(nowMs: number, windowMs: number): number {
  const resetAtMs = windowStartFor(nowMs, windowMs) + windowMs;
  return Math.max(0, Math.ceil((resetAtMs - nowMs) / 1000));
}

/**
 * Consume one unit for `bucket` in the current window and decide.
 *
 * The count is fetched through the store's atomic increment; this function only
 * interprets the returned count, so it stays free of read-then-write races.
 */
export async function checkFixedWindow(
  input: FixedWindowInput,
): Promise<RateLimitResult> {
  const nowMs = input.nowMs ?? Date.now();
  const windowStart = windowStartFor(nowMs, input.windowMs);

  const count = await input.store.increment(input.bucket, new Date(windowStart));

  return {
    allowed: count <= input.limit,
    retryAfterSeconds: retryAfterSeconds(nowMs, input.windowMs),
    remaining: Math.max(0, input.limit - count),
  };
}
