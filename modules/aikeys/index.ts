/**
 * Public entry for the aikeys module — the only path from a presented bearer
 * token to the `ApiKey` row that authorizes it.
 *
 * Storage model
 * -------------
 * A key is persisted only as `keyHash`, the hex SHA-256 of the raw token. The
 * raw token is never written, logged, or returned; it exists only for the
 * length of one request. The hash is deterministic and unsalted on purpose:
 * the unique index on `ApiKey.keyHash` is what turns verification into a single
 * lookup, and API tokens are high-entropy random strings, so an attacker who
 * steals the table cannot mount a useful offline dictionary against them. (This
 * is the same reasoning NPM, GitHub, and Stripe-style tokens rely on.)
 *
 * Scopes and revocation are read from the schema as it already exists
 * (`scopes String[]`, `revokedAt DateTime?`); no migration is required.
 *
 * This module never imports anything from `app/**` and never throws for an
 * invalid key — it returns a decision, and the caller decides the status.
 */
import { createHash } from "node:crypto";
import { prisma } from "./db";

/** Derive the stored hash for a raw bearer token. Never reverse this. */
export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey, "utf8").digest("hex");
}

/** The minimal identity an authenticated request carries forward. */
export type ApiKeyIdentity = {
  id: string;
  label: string;
  scopes: string[];
};

/**
 * Why a key was rejected. Kept internal to the module so callers can map every
 * case to the same outward response and not leak which one applied.
 */
export type ApiKeyRejection = "missing" | "unknown" | "revoked";

export type ApiKeyVerification =
  | { ok: true; key: ApiKeyIdentity }
  | { ok: false; reason: ApiKeyRejection };

/**
 * Resolve a presented token to an active key, or say why it failed.
 *
 * A missing token, a token that matches no row, and a token that matches a
 * revoked row all return `ok: false`; the door collapses them to one 401 so a
 * caller cannot tell whether a key ever existed.
 */
export async function verifyApiKey(
  rawKey: string | null,
): Promise<ApiKeyVerification> {
  if (rawKey === null) {
    return { ok: false, reason: "missing" };
  }

  const row = await prisma.apiKey.findUnique({
    where: { keyHash: hashApiKey(rawKey) },
    select: { id: true, label: true, scopes: true, revokedAt: true },
  });

  if (row === null) {
    return { ok: false, reason: "unknown" };
  }
  if (row.revokedAt !== null) {
    return { ok: false, reason: "revoked" };
  }

  return {
    ok: true,
    key: { id: row.id, label: row.label, scopes: row.scopes ?? [] },
  };
}

/** True when the key carries the exact scope the door requires. */
export function hasScope(identity: ApiKeyIdentity, scope: string): boolean {
  return identity.scopes.includes(scope);
}
