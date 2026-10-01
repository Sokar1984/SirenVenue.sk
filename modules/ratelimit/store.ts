/**
 * Prisma-backed {@link RateLimitStore}.
 *
 * The increment is a single `upsert` with `count: { increment: 1 }`. Prisma
 * compiles this to an atomic `INSERT … ON CONFLICT DO UPDATE SET count = count
 * + 1`, so two serverless instances racing on the same (bucket, windowStart)
 * row cannot lose an update and cannot both see "count = 0". A read-then-write
 * (findUnique then update) would race here and is deliberately avoided.
 */
import { PrismaClient } from "@prisma/client";
import type { RateLimitStore } from "./window";

let client: PrismaClient | undefined;

function prisma(): PrismaClient {
  if (!client) {
    client = new PrismaClient();
  }
  return client;
}

export function createPrismaStore(): RateLimitStore {
  return {
    async increment(bucket: string, windowStart: Date): Promise<number> {
      const row = await prisma().rateLimit.upsert({
        where: { bucket_windowStart: { bucket, windowStart } },
        create: { bucket, windowStart, count: 1 },
        update: { count: { increment: 1 } },
      });
      return row.count;
    },
  };
}
