# The AI door

`POST /api/v1/ai/[...route]` is a deliberately reserved route: the mechanism is
built, the product is not. It authenticates, authorizes, rate-limits, and then
fails honestly because no upstream provider exists. It defines no use case,
prompt, model, or example product request.

## Pipeline

1. **Kill switch** — `AI_DOOR_DISABLED` is read per request. Set it to `1`,
   `true`, `yes`, or `on` (case-insensitive) and the door returns
   `503 ai_door_disabled` before touching the database. Any other value leaves
   the door open.
2. **Authentication** — `Authorization: Bearer <key>`. The token is hashed with
   SHA-256 and looked up in the existing `ApiKey` table (`keyHash`, unique). The
   raw token is never stored, logged, or returned. Scopes are the existing
   `scopes String[]`; revocation is the existing `revokedAt DateTime?`. A key
   needs the `ai.door` scope.
3. **Rate limiting** — `modules/ratelimit`'s `checkLimit("ai.door", key.id)`,
   never a second limiter. A denial is `429 rate_limited` with the module's
   `Retry-After` header.
4. **Provider** — `resolveProvider()` in `_lib/provider.ts` is the adapter seam.
   No provider is configured, so the door returns
   `501 provider_unconfigured` and records the attempt through the metering
   seam. A later ticket implements `AiProvider` and returns it; `AI_PROVIDER`
   is the reserved selector name.

## Responses

| Status | Code | When |
| --- | --- | --- |
| 401 | `unauthorized` | missing, unknown, revoked, or scope-mismatched key (one body for all) |
| 429 | `rate_limited` | key over its per-window limit; carries `Retry-After` |
| 501 | `provider_unconfigured` | authenticated and allowed, but no adapter exists |
| 503 | `ai_door_disabled` | kill switch on |
| 503 | `database_unavailable` | key store or limiter unreachable |

Every response uses the shared `/api/v1` envelope
`{ "error": { "code": "...", "message": "..." } }` and `Cache-Control: no-store`.

## Seams

- `_lib/metering.ts` — `recordAiUsage(...)` writes nothing. **SOK-248** owns the
  `AiUsage` ledger and fills this in; the door does not change.
- `_lib/provider.ts` — the upstream adapter. No provider is assumed or called.

## Environment

| Variable | Purpose |
| --- | --- |
| `AI_DOOR_DISABLED` | kill switch (see above) |
| `AI_PROVIDER` | reserved provider selector; unset, read only by a later ticket |
| `DATABASE_URL` | Postgres for `ApiKey` and `RateLimit` (shared with `modules/content`, `modules/ratelimit`) |

An ignored `.env.example` at the repository root mirrors this list for local
setup.
