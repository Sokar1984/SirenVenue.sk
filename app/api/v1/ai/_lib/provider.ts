/**
 * The upstream-model adapter seam for the AI door.
 *
 * This deployment has no provider configured, and the door does not assume one.
 * {@link resolveProvider} returns `null`, and the door answers with an explicit
 * `501 provider_unconfigured` instead of pretending to call a model or emitting
 * fabricated output.
 *
 * A later ticket fills this seam: implement {@link AiProvider} and return it
 * from {@link resolveProvider} (reading its own configuration, reserved here as
 * `AI_PROVIDER`). The door already composes `complete(...)`, so only this file
 * needs to change.
 *
 * The provider adapter owns reading and validating the request body. The door
 * itself never parses, stores, logs, or forwards a request body, and no
 * provider payload is ever logged.
 */
export type AiCompletionRequest = {
  /** The path below `/api/v1/ai` (`""` at the door root, `"a/b"` deeper). */
  route: string;
  /** The authenticated `ApiKey.id` — never the raw bearer token. */
  keyId: string;
};

export type AiCompletion = {
  /** Model identifier reported by the adapter, for the usage ledger. */
  model: string;
  /** Adapter-owned result. The door passes it through unchanged. */
  output: unknown;
  inputTokens: number;
  outputTokens: number;
};

export interface AiProvider {
  complete(request: AiCompletionRequest): Promise<AiCompletion>;
}

/**
 * The reserved configuration variable a later ticket reads to select an
 * adapter. Unset today; documented so the name is fixed before it is used.
 */
export const AI_PROVIDER_ENV = "AI_PROVIDER";

/**
 * Resolve the configured provider, or `null` when none is.
 *
 * Returns `null` unconditionally: nothing is configured. Do not replace the
 * body with an upstream call until the product use case exists.
 */
export function resolveProvider(): AiProvider | null {
  return null;
}
