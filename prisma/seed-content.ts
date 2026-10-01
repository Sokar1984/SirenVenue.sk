/**
 * Seed the content tables from the project's own copy.
 *
 * Source of truth for the works remains `content/works.ts`; this script only
 * projects those values into `Work` / `WorkTranslation`, so the site can read
 * them through `modules/content`. The locale catalogue comes from the i18n
 * module's canonical order.
 *
 * Idempotent: every write is an upsert keyed by its natural key (`Work.slug`,
 * `WorkTranslation.(workId, locale)`, `Locale.code`).
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { works } from "../content/works";
import { locales } from "../modules/i18n";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("BLOCKED: DATABASE_URL is not set");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

/** `content/works.ts` spells it "gallery ops"; the enum spells it `gallery_ops`. */
const roleForDatabase = {
  product: "product",
  live: "live",
  "gallery ops": "gallery_ops",
  systems: "systems",
} as const;

/** Human labels for the nine locales, in the i18n module's canonical order. */
const localeLabels: Record<(typeof locales)[number], string> = {
  sk: "Slovenčina",
  en: "English",
  de: "Deutsch",
  es: "Español",
  "es-ve": "Español (Venezuela)",
  hu: "Magyar",
  cs: "Čeština",
  uk: "Українська",
  ru: "Русский",
};

/** Stable slug for each work; used as the natural key in the database. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main(): Promise<void> {
  for (const [sortOrder, work] of works.entries()) {
    const slug = slugify(work.name);
    const role = roleForDatabase[work.role];

    const row = await prisma.work.upsert({
      where: { slug },
      create: {
        slug,
        role,
        href: work.href,
        sortOrder,
        published: true,
      },
      update: {
        role,
        href: work.href,
        sortOrder,
        published: true,
      },
    });

    for (const locale of locales) {
      await prisma.workTranslation.upsert({
        where: { workId_locale: { workId: row.id, locale } },
        create: {
          workId: row.id,
          locale,
          name: work.name,
          descriptor: work.descriptor ?? null,
        },
        update: {
          name: work.name,
          descriptor: work.descriptor ?? null,
        },
      });
    }

    console.log(
      `seeded work ${slug} (${role}) with ${locales.length} translations`,
    );
  }

  for (const [sortOrder, code] of locales.entries()) {
    const label = localeLabels[code];
    await prisma.locale.upsert({
      where: { code },
      create: { code, label, enabled: true, sortOrder },
      update: { label, enabled: true, sortOrder },
    });
  }
  console.log(`seeded ${locales.length} locales`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(
      `BLOCKED: ${error instanceof Error ? error.message : String(error)}`,
    );
    await prisma.$disconnect();
    process.exit(1);
  });
