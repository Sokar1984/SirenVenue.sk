# Modules

A module owns its own directory and exposes exactly one public entry; nothing
imports another module's internals. If something can be a module, write it as a
module with its own on/off (or fail-off) switch. Adding a module is copying the
shape: a directory, one public entry, and a documented switch.

| Module | Owns (paths) | On/off or fail-off | Tickets |
| --- | --- | --- | --- |
| tokens | `modules/tokens/**` | Values only — no switch. `scripts/check-contrast.mjs` fails the build if any text colour drops below 4.5:1. | SOK-233, SOK-249 |
| i18n | `modules/i18n/**` | An unknown locale 404s. It never falls back to English. | SOK-237 |
| seo | `modules/seo/**` | Publishes only verified identity facts. Nothing invented, ever. | SOK-243 |
| motion | `modules/motion/**` | `prefers-reduced-motion: reduce` collapses every named transition to `none` in one place. | SOK-249 |
| content | `modules/content/**` | The only place Prisma is called. Fails loudly when `DATABASE_URL` is unset. Cache tags: `content:works`, `content:legal`, `content:locales`. | SOK-236 |
| ratelimit | `modules/ratelimit/**` | Fails **open** for reads, **closed** for the AI door. Never stores or logs a raw IP. | SOK-245 |
| page surface | `app/**` | The routes themselves — `app/[locale]/`, the 404, and the stylesheets. | SOK-237, SOK-242, SOK-252 |

## Not yet a module

* `content/legal.ts` still holds the company's legal facts, duplicated in
  `modules/seo/site.ts`. SOK-254 collapses them to one source.
* `content/works.ts` is the seed source for `modules/content`, not a runtime read path.
