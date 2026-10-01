#!/usr/bin/env node
/**
 * Dependency-free check of the ratelimit window logic.
 *
 * Imports the real module sources (Node strips the TypeScript types) and drives
 * them through an in-memory store, so it needs no database and no build step:
 * allows N calls, denies N+1, resets after the window, returns a sane
 * retryAfterSeconds, and proves hashing never keeps the raw identity. Prints
 * every case it checked and exits non-zero on the first failure.
 */
import {
  checkFixedWindow,
  retryAfterSeconds,
  windowStartFor,
} from "../modules/ratelimit/window.ts";
import { WINDOW_MS, WINDOW_SECONDS, limitForRoute } from "../modules/ratelimit/config.ts";
import {
  hashIdentity,
  resolveSalt,
  SALT_FALLBACK,
} from "../modules/ratelimit/identity.ts";

/** In-memory stand-in for the Prisma store; counts per (bucket, window). */
function createMemoryStore() {
  const rows = new Map();
  return {
    rows,
    async increment(bucket, windowStart) {
      const key = `${bucket}@${windowStart.getTime()}`;
      const next = (rows.get(key) ?? 0) + 1;
      rows.set(key, next);
      return next;
    },
  };
}

let failures = 0;
const checked = [];

function check(name, condition, detail) {
  checked.push(name);
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}: ${detail}`);
  }
}

const limit = limitForRoute("ai.door");
const base = 100 * WINDOW_MS; // aligned to a window boundary
const at = (offsetMs) => base + offsetMs;

// 1. Allows exactly N, then denies N+1.
const store = createMemoryStore();
let allowedCount = 0;
let lastRemaining = null;
for (let i = 0; i < limit; i += 1) {
  const result = await checkFixedWindow({
    store,
    bucket: "route:identity",
    limit,
    windowMs: WINDOW_MS,
    nowMs: at(1000),
  });
  if (result.allowed) allowedCount += 1;
  lastRemaining = result.remaining;
}
check(
  "allows N calls",
  allowedCount === limit,
  `allowed ${allowedCount} of ${limit}`,
);
check(
  "remaining reaches 0 after N calls",
  lastRemaining === 0,
  `remaining ${lastRemaining}`,
);

const overLimit = await checkFixedWindow({
  store,
  bucket: "route:identity",
  limit,
  windowMs: WINDOW_MS,
  nowMs: at(1000),
});
check("denies call N+1", overLimit.allowed === false, `allowed ${overLimit.allowed}`);
check(
  "denied call has no remaining quota",
  overLimit.remaining === 0,
  `remaining ${overLimit.remaining}`,
);
check(
  "denied call returns a retryAfterSeconds inside the window",
  overLimit.retryAfterSeconds > 0 &&
    overLimit.retryAfterSeconds <= WINDOW_SECONDS,
  `retryAfterSeconds ${overLimit.retryAfterSeconds}`,
);

// 2. Resets once the window rolls over.
const afterReset = await checkFixedWindow({
  store,
  bucket: "route:identity",
  limit,
  windowMs: WINDOW_MS,
  nowMs: at(WINDOW_MS + 1000),
});
check("resets after the window", afterReset.allowed === true, "still denied");
check(
  "fresh window restores remaining quota",
  afterReset.remaining === limit - 1,
  `remaining ${afterReset.remaining}`,
);

// 3. Buckets are independent (different identities do not share a counter).
const isoStore = createMemoryStore();
const first = await checkFixedWindow({
  store: isoStore,
  bucket: "route:alice",
  limit: 1,
  windowMs: WINDOW_MS,
  nowMs: at(0),
});
const other = await checkFixedWindow({
  store: isoStore,
  bucket: "route:bob",
  limit: 1,
  windowMs: WINDOW_MS,
  nowMs: at(0),
});
check(
  "buckets are independent",
  first.allowed === true && other.allowed === true,
  `alice ${first.allowed}, bob ${other.allowed}`,
);

// 4. Increment contract is atomic under concurrency.
const concStore = createMemoryStore();
const counts = await Promise.all(
  Array.from({ length: 5 }, () => concStore.increment("c", new Date(base))),
);
check(
  "concurrent increments yield distinct, gapless counts",
  JSON.stringify([...counts].sort((a, b) => a - b)) === "[1,2,3,4,5]",
  `counts ${counts.join(",")}`,
);

// 5. Window math.
check(
  "windowStartFor snaps to the boundary",
  windowStartFor(at(12_345), WINDOW_MS) === base,
  `${windowStartFor(at(12_345), WINDOW_MS)}`,
);
check(
  "retryAfterSeconds at the boundary equals the window",
  retryAfterSeconds(base, WINDOW_MS) === WINDOW_SECONDS,
  `${retryAfterSeconds(base, WINDOW_MS)}`,
);
check(
  "retryAfterSeconds partway through is the remainder",
  retryAfterSeconds(at(15_000), WINDOW_MS) === 45,
  `${retryAfterSeconds(at(15_000), WINDOW_MS)}`,
);

// 6. Identity hashing never keeps the raw identity.
const raw = "203.0.113.7";
const hashed = hashIdentity(raw);
check(
  "hash is a 64-char hex sha-256 digest",
  /^[0-9a-f]{64}$/.test(hashed),
  hashed,
);
check(
  "raw identity does not appear in the hash",
  !hashed.includes(raw),
  hashed,
);
const savedSalt = process.env.RATE_LIMIT_SALT;
process.env.RATE_LIMIT_SALT = "check-salt-a";
const withA = hashIdentity(raw);
process.env.RATE_LIMIT_SALT = "check-salt-b";
const withB = hashIdentity(raw);
check(
  "RATE_LIMIT_SALT changes the hash",
  withA !== withB,
  `${withA} vs ${withB}`,
);
delete process.env.RATE_LIMIT_SALT;
check(
  "unset salt falls back to the documented constant",
  resolveSalt() === SALT_FALLBACK,
  resolveSalt(),
);
if (savedSalt === undefined) {
  delete process.env.RATE_LIMIT_SALT;
} else {
  process.env.RATE_LIMIT_SALT = savedSalt;
}

if (failures > 0) {
  console.error(`\n${failures} of ${checked.length} cases failed.`);
  process.exit(1);
}

console.log(`\nChecked ${checked.length} cases, all passed.`);
