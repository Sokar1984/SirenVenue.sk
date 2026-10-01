# Modules

A module owns its own directory and exposes exactly one public entry; nothing
imports another module's internals. If something can be a module, write it as a
module with its own on/off (or fail-off) switch. Adding a module is copying the
shape: a directory, one public entry, and a documented switch.

| Module | Owns (paths) | On/off or fail-off | Tickets |
| --- | --- | --- | --- |
| tokens | `modules/tokens/**` | Values only — no switch. `scripts/check-contrast.mjs` fails the build if any text colour drops below 4.5:1. | SOK-233, SOK-249, SOK-252, SOK-256 |
| i18n | `modules/i18n/**` | An unknown locale 404s and never falls back to English. `scripts/check-messages.mjs` fails when a key is missing and not declared missing; a declared-missing key renders nothing. Nine locales, `sk` primary. | SOK-237, SOK-238 |
| lang-switch | `modules/lang-switch/**` | The only definition of the locale control — nothing duplicates it. Persists the choice in a `locale` cookie, which the root redirect honours; an unknown cookie value is ignored rather than trusted. | SOK-239 |
| seo | `modules/seo/**` | Publishes only verified identity facts, derived from `content/legal.ts`. Nothing invented, ever. | SOK-243, SOK-254 |
| motion | `modules/motion/**` | `prefers-reduced-motion: reduce` collapses every named transition to `none` in one place. | SOK-249 |
| content | `modules/content/**` | The only place Prisma is called. Fails loudly when `DATABASE_URL` is unset; a database outage renders the shell with an empty index rather than lying. Cache tags: `content:works`, `content:legal`, `content:locales`. | SOK-236, SOK-240, SOK-241 |
| ratelimit | `modules/ratelimit/**` | Fails **open** for reads, **closed** for the AI door. Never stores or logs a raw IP. | SOK-245, SOK-247 |
| aikeys | `modules/aikeys/**` | Verifies a bearer key against a stored hash. Never stores, returns, or logs the raw key. | SOK-247 |
| page surface | `app/**` | The routes themselves — `app/[locale]/`, the work pages, the 404, the API, and the stylesheets. | SOK-237, SOK-241, SOK-242, SOK-244, SOK-246, SOK-247, SOK-250, SOK-251, SOK-252, SOK-256 |

## Not modules, by design

* `content/legal.ts` — the single source of the company's legal facts. `modules/seo`
  derives from it; it is not duplicated anywhere (SOK-254).
* `content/works.ts` — seed input for `modules/content`, never a runtime read path
  (SOK-240).
* `app/api/v1/ai/**` — the reserved AI door. Built, closed, no provider configured,
  answers `501`. **What it is for is deliberately undecided — do not invent a use
  case to justify it.**

## Checks

Every one of these must pass before a change is called done.

```bash
npm run build                        # includes prisma generate
npx tsc -p tsconfig.json --noEmit
node scripts/check-contrast.mjs      # token contrast, 4.5:1 floor
node scripts/check-messages.mjs      # no silent English fallback
node scripts/check-ratelimit.mjs     # limiter behaviour
node scripts/check-links.mjs         # every published tile still resolves
node scripts/smoke.mjs               # home renders, nine locales answer
```
