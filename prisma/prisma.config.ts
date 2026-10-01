import { loadEnvFile } from 'node:process'
import { defineConfig } from 'prisma/config'

// Prisma 7 does not load `.env` files automatically. The project keeps its
// local database URL in `.env.local` (Next.js convention), so load it here
// before the datasource is read. Real environment variables still win.
try {
  loadEnvFile('.env.local')
} catch {
  // No local file (e.g. CI/Vercel) — rely on the process environment.
}

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
    seed: 'tsx prisma/seed-content.ts',
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@localhost:5432/sirenvenue',
  },
})
