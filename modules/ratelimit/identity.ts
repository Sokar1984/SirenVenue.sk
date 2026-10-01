/**
 * Turns a caller identity (an IP address, api key, session id, …) into an
 * opaque bucket key. The raw identity is never stored, logged, or returned.
 *
 * No relative imports: this file is imported directly by the dependency-free
 * check script.
 */
import { createHash } from "node:crypto";

/**
 * Documented fallback salt, used only when RATE_LIMIT_SALT is unset.
 *
 * It is a fixed constant rather than a random per-process value on purpose:
 * serverless instances must derive the *same* bucket for the same identity, or
 * the limit would silently multiply by the instance count. The trade-off is that
 * a known salt lets someone with the database brute-force low-entropy inputs
 * (e.g. brute force the small IPv4 space); production must set RATE_LIMIT_SALT.
 */
export const SALT_FALLBACK = "sirenvenue-ratelimit-fallback-salt-v1";

/** Resolve the active salt, reading the env lazily so tests can toggle it. */
export function resolveSalt(): string {
  const fromEnv = process.env.RATE_LIMIT_SALT;
  return fromEnv && fromEnv.length > 0 ? fromEnv : SALT_FALLBACK;
}

/**
 * SHA-256 over salt + identity, hex encoded. The output is safe to persist and
 * to log; the first argument is never included anywhere else.
 */
export function hashIdentity(identity: string): string {
  return createHash("sha256")
    .update(resolveSalt())
    .update(":")
    .update(identity)
    .digest("hex");
}
