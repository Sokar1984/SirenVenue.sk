/**
 * POST /api/v1/ai/[...route] — the AI door.
 *
 * This route is deliberately reserved: it is the mechanism, not a product. It
 * authenticates a bearer key, authorizes it against a scope, rate-limits it,
 * and then fails honestly because no upstream provider is configured. It
 * returns no model output and invents no use case.
 *
 * Pipeline, in order:
 *
 *   1. kill switch  — `AI_DOOR_DISABLED` (env, read per request) -> 503
 *                     `ai_door_disabled`. Checked first so it trips without
 *                     touching the database.
 *   2. authentication — `Authorization: Bearer <key>` is hashed and looked up
 *                       in `ApiKey`. Missing, unknown, revoked, and
 *                       scope-mismatched keys all answer the same 401
 *                       `unauthorized`, so a caller cannot probe which key
 *                       exists.
 *   3. rate limiting — `modules/ratelimit`'s `checkLimit("ai.door", key.id)`;
 *                      a denial is 429 `rate_limited` with the module's
 *                      `Retry-After`. There is no second limiter here.
 *   4. provider      — `resolveProvider()` is the adapter seam. No provider is
 *                      configured, so the door records the attempt through the
 *                      metering seam and answers 501 `provider_unconfigured`.
 *
 * Failure envelope: the one shared `/api/v1` shape `{ error: { code, message } }`
 * via `apiError`, with `Cache-Control: no-store`. No request body, bearer token,
 * or provider payload is ever logged.
 */
import { checkLimit, type RateLimitResult } from "@/modules/ratelimit";
import {
  hasScope,
  verifyApiKey,
  type ApiKeyVerification,
} from "@/modules/aikeys";
import { apiError } from "../../_lib/http";
import { isAiDoorDisabled } from "../_lib/kill-switch";
import { recordAiUsage } from "../_lib/metering";
import { resolveProvider } from "../_lib/provider";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** The scope a key must carry to reach the door. */
const AI_DOOR_SCOPE = "ai.door";

/** The rate-limit route key, matching `modules/ratelimit/config.ts`. */
const AI_DOOR_ROUTE = "ai.door";

/** The same 401 body for every rejection, so nothing is leaked. */
const UNAUTHORIZED_MESSAGE = "A valid API key is required.";

type RouteContext = { params: Promise<{ route: string[] }> };

/** Extract the token from `Authorization: Bearer <token>`, or `null`. */
function readBearerToken(header: string | null): string | null {
  if (header === null) {
    return null;
  }
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match === null ? null : match[1];
}

export async function POST(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const startedAt = Date.now();

  if (isAiDoorDisabled()) {
    return apiError(
      503,
      "ai_door_disabled",
      "The AI door is switched off for this deployment.",
    );
  }

  const presented = readBearerToken(request.headers.get("authorization"));

  let verification: ApiKeyVerification;
  try {
    verification = await verifyApiKey(presented);
  } catch {
    return apiError(
      503,
      "database_unavailable",
      "The key store is not reachable.",
    );
  }

  if (!verification.ok || !hasScope(verification.key, AI_DOOR_SCOPE)) {
    return apiError(401, "unauthorized", UNAUTHORIZED_MESSAGE);
  }

  const { key } = verification;

  let limit: RateLimitResult;
  try {
    limit = await checkLimit(AI_DOOR_ROUTE, key.id);
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
      "Rate limit exceeded for this key; retry after the window resets.",
    );
    response.headers.set("Retry-After", String(limit.retryAfterSeconds));
    return response;
  }

  const { route } = await context.params;
  const routePath = route.join("/");

  const provider = resolveProvider();

  if (provider === null) {
    await recordAiUsage({
      apiKeyId: key.id,
      route: routePath,
      model: null,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: Date.now() - startedAt,
      outcome: "provider_unconfigured",
    });

    return apiError(
      501,
      "provider_unconfigured",
      "No AI provider is configured for this deployment; the door has no upstream to call.",
    );
  }

  const completion = await provider.complete({
    route: routePath,
    keyId: key.id,
  });

  await recordAiUsage({
    apiKeyId: key.id,
    route: routePath,
    model: completion.model,
    inputTokens: completion.inputTokens,
    outputTokens: completion.outputTokens,
    latencyMs: Date.now() - startedAt,
    outcome: "ok",
  });

  return Response.json(
    { model: completion.model, output: completion.output },
    { headers: { "Cache-Control": "no-store" } },
  );
}
