/**
 * Internal to the content module — do not import from outside `modules/content`.
 *
 * This is the single PrismaClient for the content read path. Prisma 7 requires
 * a driver adapter, so the client is wired to Postgres through `@prisma/adapter-pg`
 * using `DATABASE_URL` (loaded by Next at runtime and by `prisma/prisma.config.ts`
 * for CLI/seed runs).
 *
 * The instance is cached on `globalThis` in development so hot reloads do not
 * open a new pool on every edit.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForContent = globalThis as unknown as {
  contentPrisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set; the content module cannot reach the database.",
    );
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma: PrismaClient = globalForContent.contentPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForContent.contentPrisma = prisma;
}
