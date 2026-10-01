/**
 * The AI usage-metering seam.
 *
 * SOK-248 owns the usage ledger (`AiUsage`). Until it lands, the door calls
 * exactly one function, {@link recordAiUsage}, and that function writes
 * nothing. When SOK-248 implements the ledger it replaces this body — the door
 * does not change.
 *
 * Nothing here is logged. `apiKeyId` is the internal `ApiKey.id`, never the
 * bearer token, and no request or provider payload is passed in.
 */
export type AiUsageOutcome =
  | "provider_unconfigured"
  | "provider_error"
  | "ok";

export type AiUsageRecord = {
  /** Internal key id, or `null` if a future flow meters unauthenticated work. */
  apiKeyId: string | null;
  /** The path below `/api/v1/ai`. */
  route: string;
  /** Model identifier, or `null` when no model was called. */
  model: string | null;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  outcome: AiUsageOutcome;
  costUsd?: string | null;
};

/**
 * Record one AI request. Intentionally a no-op: SOK-248 fills this in.
 *
 * The parameter is accepted and ignored on purpose, so the call site and its
 * shape are already in place and the ledger ticket is a pure implementation
 * change.
 */
export async function recordAiUsage(record: AiUsageRecord): Promise<void> {
  void record;
}
