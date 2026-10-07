/**
 * Public entry for the content module — the single read path from the database
 * to the surface. Nothing outside this module may talk to Prisma; everything
 * the site renders is read through `getWorks`, `getWork`, `getLegal`, or
 * `getLocales`.
 *
 * Caching
 * -------
 * Every read is wrapped in `unstable_cache` with a named tag so a mutation can
 * invalidate exactly the data it touched:
 *
 *   - `content:works`   — the published work rows (`getWorks`, `getWork`)
 *   - `content:legal`   — the static legal identity (`getLegal`)
 *   - `content:locales` — the locale catalogue (`getLocales`)
 *
 * Invalidate them with `revalidateContent(...)` from a Server Action or Route
 * Handler (both run in a request context). Outside a Next request context —
 * e.g. the `db:seed` script or a one-off proof run — the reads fall back to
 * uncached database calls instead of throwing.
 *
 * Outage policy
 * -------------
 * A reader throws when Postgres cannot be reached, so callers that must tell
 * the truth about availability - /api/v1/works, the health probe - can answer
 * 503 instead of inventing data. The home index (`app/[locale]/page.tsx`) is a
 * shell: the header, identity text, and legal footer are static. A database
 * outage on home shows the plaque without live data. An empty or partial render
 * during outage is honest; pretending to have live data is exactly the failure
 * this module exists to prevent.
 */
import { unstable_cache, revalidateTag } from "next/cache";
import { company, contact } from "../../content/legal";
import { defaultLocale } from "../i18n";
import { prisma } from "./db";
import { createHash, randomBytes } from "node:crypto";

/** Role vocabulary fixed by the schema's `WorkRole` enum. */
export type WorkRole = "product" | "live" | "gallery_ops" | "systems";

/** A published work, resolved for one locale. */
export type Work = {
  slug: string;
  name: string;
  role: WorkRole;
  href: string;
  repoUrl: string | null;
  descriptor: string | null;
  sortOrder: number;
};

/** The house legal identity (static source of truth in `content/legal.ts`). */
export type Legal = {
  company: typeof company;
  contact: typeof contact;
};

/** One row of the locale catalogue. */
export type LocaleRecord = {
  code: string;
  label: string;
  enabled: boolean;
  sortOrder: number;
};

export type HomepageCopy = {
  identity: string | null;
  client: string | null;
  blink: string | null;
};

/**
 * Cache tags owned by the content module. Keep in sync with the `unstable_cache`
 * calls below; anything that writes content must revalidate these.
 */
export const CONTENT_TAGS = {
  works: "content:works",
  legal: "content:legal",
  locales: "content:locales",
  copy: "content:copy",
} as const;

export type ContentTag = (typeof CONTENT_TAGS)[keyof typeof CONTENT_TAGS];

export function hashPassword(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

function cachedRead<Args extends readonly unknown[], Result>(
  keyParts: string[],
  tags: ContentTag[],
  read: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  const cached = unstable_cache(read, keyParts, { tags });
  return async (...args: Args): Promise<Result> => {
    try {
      return await cached(...args);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("incrementalCache missing")
      ) {
        return read(...args);
      }
      throw error;
    }
  };
}

/** Picks the translation nearest the requested locale. */
function pickTranslation<T extends { locale: string }>(
  translations: T[],
  locale: string,
): T | undefined {
  return (
    translations.find((translation) => translation.locale === locale) ??
    translations.find((translation) => translation.locale === defaultLocale) ??
    translations[0]
  );
}

const readWorks = cachedRead(
  ["content", "works"],
  [CONTENT_TAGS.works],
  async (locale: string): Promise<Work[]> => {
    const rows = await prisma.work.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    });

    return rows.map((row) => {
      const translation = pickTranslation(row.translations, locale);
      return {
        slug: row.slug,
        name: translation?.name ?? row.slug,
        role: row.role as WorkRole,
        href: row.href,
        repoUrl: row.repoUrl,
        descriptor: translation?.descriptor ?? null,
        sortOrder: row.sortOrder,
      };
    });
  },
);

/** All published works, translated into `locale`, in display order. */
export function getWorks(locale: string): Promise<Work[]> {
  return readWorks(locale);
}

const readWork = cachedRead(
  ["content", "work"],
  [CONTENT_TAGS.works],
  async (locale: string, slug: string): Promise<Work | null> => {
    const row = await prisma.work.findFirst({
      where: { slug, published: true },
      include: { translations: true },
    });
    if (!row) return null;

    const translation = pickTranslation(row.translations, locale);
    return {
      slug: row.slug,
      name: translation?.name ?? row.slug,
      role: row.role as WorkRole,
      href: row.href,
      repoUrl: row.repoUrl,
      descriptor: translation?.descriptor ?? null,
      sortOrder: row.sortOrder,
    };
  },
);

/**
 * One published work by slug, translated into `locale`, or `null` when the
 * slug is unknown or the work is unpublished. Shares the `content:works` cache
 * tag with `getWorks`, so an edit invalidates the index and the case page
 * together.
 */
export function getWork(locale: string, slug: string): Promise<Work | null> {
  return readWork(locale, slug);
}

const readLegal = cachedRead(
  ["content", "legal"],
  [CONTENT_TAGS.legal],
  async (): Promise<Legal> => ({ company, contact }),
);

/** The house legal identity for the footer plaque. */
export function getLegal(): Promise<Legal> {
  return readLegal();
}

const readLocales = cachedRead(
  ["content", "locales"],
  [CONTENT_TAGS.locales],
  async (): Promise<LocaleRecord[]> => {
    const rows = await prisma.locale.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((row) => ({
      code: row.code,
      label: row.label,
      enabled: row.enabled,
      sortOrder: row.sortOrder,
    }));
  },
);

const readHomepageCopy = cachedRead(
  ["content", "homepageCopy"],
  [CONTENT_TAGS.copy],
  async (locale: string): Promise<HomepageCopy> => {
    const keys = ["home.identity", "home.client", "home.blink"];
    const rows = await prisma.message.findMany({
      where: { key: { in: keys }, locale },
      select: { key: true, value: true },
    });
    const byKey: Record<string, string> = {};
    for (const r of rows) byKey[r.key] = r.value;
    return {
      identity: byKey["home.identity"] ?? null,
      client: byKey["home.client"] ?? null,
      blink: byKey["home.blink"] ?? null,
    };
  },
);

/** The locale catalogue in canonical display order. */
export function getLocales(): Promise<LocaleRecord[]> {
  return readLocales();
}

export async function getHomepageCopy(locale: string): Promise<HomepageCopy> {
  try {
    return await readHomepageCopy(locale);
  } catch {
    return { identity: null, client: null, blink: null };
  }
}

export async function setHomepageCopy(
  locale: string,
  partial: Partial<{ identity: string; client: string; blink: string }>,
): Promise<void> {
  const pairs: Array<[string, string]> = [];
  if (partial.identity !== undefined) pairs.push(["home.identity", partial.identity]);
  if (partial.client !== undefined) pairs.push(["home.client", partial.client]);
  if (partial.blink !== undefined) pairs.push(["home.blink", partial.blink]);
  for (const [key, value] of pairs) {
    await prisma.message.upsert({
      where: { key_locale: { key, locale } },
      create: { key, locale, value, reviewed: true },
      update: { value, reviewed: true },
    });
  }
  revalidateContent(CONTENT_TAGS.copy);
}

/**
 * Invalidate one or more content tags. Call from a Server Action or Route
 * Handler after a write, e.g.:
 *
 *   await revalidateContent(CONTENT_TAGS.works);
 *
 * Defaults to every content tag. Safe to call with duplicates.
 */
export function revalidateContent(
  ...tags: ContentTag[]
): void {
  const targets = tags.length > 0 ? new Set(tags) : new Set(Object.values(CONTENT_TAGS));
  for (const tag of targets) {
    try {
      revalidateTag(tag);
    } catch (e) {
      if (!(e instanceof Error && /static generation store missing|incrementalCache missing/i.test(e.message))) {
        throw e;
      }
    }
  }
}

export async function createAdminSession(userId: string): Promise<string> {
  const raw = randomBytes(32).toString("hex");
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.adminSession.create({
    data: { tokenHash, userId, expiresAt },
  });
  return raw;
}

export async function revokeAdminSession(tokenHash: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { tokenHash } });
}

export async function getAdminSession(rawToken: string | null): Promise<{ userId: string } | null> {
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);
  const row = await prisma.adminSession.findUnique({
    where: { tokenHash },
    select: { userId: true, expiresAt: true },
  });
  if (!row || row.expiresAt <= new Date()) return null;
  return { userId: row.userId };
}

export async function ensureAdminUserFromEnv(): Promise<void> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return;
  const exists = await prisma.adminUser.findFirst({ select: { id: true } });
  if (exists) return;
  const passwordHash = hashPassword(pw);
  await prisma.adminUser.create({ data: { passwordHash } });
}

export async function authenticateAdmin(password: string): Promise<{ userId: string } | null> {
  await ensureAdminUserFromEnv();
  const passwordHash = hashPassword(password);
  const row = await prisma.adminUser.findFirst({
    where: { passwordHash },
    select: { id: true },
  });
  return row ? { userId: row.id } : null;
}

