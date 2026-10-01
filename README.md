# SirenVenue.sk

Company site for **SirenVenue s.r.o.** — house plaque / portfolio at [sirenvenue.sk](https://sirenvenue.sk).

Vision: Notion `sirenvenue.sk — CEO vision (company site)` under CRE → SirenVenue.
Hermes bot: **Siren.sk** (`hermes -p siren-sk`).

## Stack (target)

- Next.js (App Router) on Vercel
- Neon Postgres
- Real API + reserved AI routes
- i18n: sk, en, de, es, es-VE, hu, cs, uk, ru

## Dev

```bash
npm install
npm run dev
```

## Modules

Each module owns its directory and exposes exactly one public entry; nothing imports another module's internals.
If it can be a module, write it as a module with its own on/off or fail-off; adding a module is copying the shape.
Modules live under `modules/`, each with one public entry point.
See [MODULES.md](./MODULES.md) for the inventory.
