/**
 * Internal to the aikeys module — do not import from outside `modules/aikeys`.
 *
 * The single PrismaClient used to read the `ApiKey` table. Prisma 7 requires a
 * driver adapter, so the client is wired to Postgres through `@prisma/adapter-pg`
 * using `DATABASE_URL` (loaded by Next at runtime and by `prisma/prisma.config.ts`
 * for CLI/seed runs).
 *
 * The instance is cached on `globalThis` in development so hot reloads do not
 * open a new pool on every edit.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForAiKeys = globalThis as unknown as {
  aiKeysPrisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set; the aikeys module cannot reach the database.",
    );
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma: PrismaClient =
  globalForAiKeys.aiKeysPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForAiKeys.aiKeysPrisma = prisma;
}
