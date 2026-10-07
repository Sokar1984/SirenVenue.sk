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

/**
 * Cache tags owned by the content module. Keep in sync with the `unstable_cache`
 * calls below; anything that writes content must revalidate these.
 */
export const CONTENT_TAGS = {
  works: "content:works",
  legal: "content:legal",
  locales: "content:locales",
} as const;

export type ContentTag = (typeof CONTENT_TAGS)[keyof typeof CONTENT_TAGS];

/**
 * Wraps a reader in `unstable_cache` under a tag. When no Next incremental
 * cache is present (CLI, seed, scripts) it transparently reads through, so the
 * public API is identical inside and outside a request.
 */
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

/** The locale catalogue in canonical display order. */
export function getLocales(): Promise<LocaleRecord[]> {
  return readLocales();
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
    revalidateTag(tag);
  }
}
