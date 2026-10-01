/**
 * Typed message catalog — the only place the site's chrome and section labels
 * are written.
 *
 * What belongs here
 * -----------------
 * Short, structural strings: the colophon line, section labels, an `aria-label`
 * or two, and the 404 copy. Product names never belong here. `SirenVenue.com`,
 * `BlinkLive`, and `DOT. Gallery` are brands: they are spelled the same in every
 * locale and are translated by no one.
 *
 * Where the strings live at runtime
 * ---------------------------------
 * This module is the authored source. `prisma/seed-content.ts` projects every
 * row here into the `messages` table (`key`, `locale`, `value`, `reviewed`),
 * which is the table the site reads. The gate in `scripts/check-messages.mjs`
 * reads this module directly so it stays dependency-free and CI-runnable.
 *
 * The review flag
 * ---------------
 * `sk` and `en` are written by the project and seeded as reviewed. The other
 * seven locales (`de`, `es`, `es-ve`, `hu`, `cs`, `uk`, `ru`) are unreviewed
 * drafts awaiting a human who reads the language. An unreviewed, right-language
 * draft is worth more than an English one; a wrong-language string is worth
 * less than nothing.
 *
 * `es-ve` is Venezuelan Spanish and is its own locale. It is never flattened
 * into `es` and never seeded from it.
 *
 * Render policy — no silent English
 * ---------------------------------
 * A key that is absent for a locale and not declared in `declaredMissing` is a
 * defect: the completeness gate fails the build. At render time, `message()`
 * returns the value only for the exact locale asked for. A declared-missing key
 * renders nothing at all — the surface omits the element rather than showing a
 * string in the wrong language. There is no `defaultLocale` fallback, ever:
 * an English string shown to a Slovak visitor is exactly the failure the vision
 * forbids. (The one honest exception is that a *brand* is identical in every
 * locale; brands are not catalog entries.)
 *
 * Placeholders
 * ------------
 * Values may contain `{count}`. It is replaced by the caller after formatting;
 * a placeholder is never translated.
 */
import type { Locale } from "./locales";

/** Every translatable key. Keys are added only when a surface uses them. */
export const messageKeys = [
  "colophon",
  "work.label",
  "work.count",
  "work.aria",
  "nav.language",
  "notFound.lead",
  "notFound.note",
] as const;

export type MessageKey = (typeof messageKeys)[number];

/**
 * A locale's values. `Partial` on purpose: a missing key is legal only when it
 * is declared in `declaredMissing`, and the gate is what proves it.
 */
export type MessageCatalog = Record<
  Locale,
  Partial<Record<MessageKey, string>>
>;

/**
 * The authored catalog, in canonical locale order (`sk` first). Object key
 * order is therefore the display order used by the gate and the seed.
 */
export const catalog: MessageCatalog = {
  sk: {
    colophon: "Softvér a systémy pre live, venue a galérie.",
    "work.label": "Práce",
    "work.count": "{count} systémov",
    "work.aria": "Práce",
    "nav.language": "Jazyk",
    "notFound.lead": "Na tejto adrese nič nie je.",
    "notFound.note":
      "Odkaz je zastaraný alebo nikdy nebol náš. Každý produkt, ktorý vydávame, odkazuje späť na sirenvenue.sk — toto je tá stránka.",
  },
  en: {
    colophon: "Software & systems for live, venue, and gallery.",
    "work.label": "Work",
    "work.count": "{count} systems",
    "work.aria": "Work",
    "nav.language": "Language",
    "notFound.lead": "Nothing at this address.",
    "notFound.note":
      "The link is out of date, or it was never ours. Every product we ship links back to sirenvenue.sk — this is that page.",
  },
  de: {
    colophon: "Software & Systeme für Live, Venue und Galerie.",
    "work.label": "Arbeiten",
    "work.count": "{count} Systeme",
    "work.aria": "Arbeiten",
    "nav.language": "Sprache",
    "notFound.lead": "Unter dieser Adresse gibt es nichts.",
    "notFound.note":
      "Der Link ist veraltet, oder er war nie unserer. Jedes Produkt, das wir ausliefern, verweist zurück auf sirenvenue.sk — das hier ist diese Seite.",
  },
  es: {
    colophon: "Software y sistemas para directo, recintos y galerías.",
    "work.label": "Trabajos",
    "work.count": "{count} sistemas",
    "work.aria": "Trabajos",
    "nav.language": "Idioma",
    "notFound.lead": "En esta dirección no hay nada.",
    "notFound.note":
      "El enlace está desactualizado o nunca fue nuestro. Cada producto que publicamos enlaza de vuelta a sirenvenue.sk — esta es esa página.",
  },
  "es-ve": {
    colophon: "Software y sistemas para vivo, recintos y galerías.",
    "work.label": "Trabajos",
    "work.count": "{count} sistemas",
    "work.aria": "Trabajos",
    "nav.language": "Idioma",
    "notFound.lead": "No hay nada en esta dirección.",
    "notFound.note":
      "El enlace está vencido o nunca fue nuestro. Cada producto que lanzamos enlaza de vuelta a sirenvenue.sk — esta es esa página.",
  },
  hu: {
    colophon: "Szoftver és rendszerek élő, helyszíni és galéria használatra.",
    "work.label": "Munkák",
    "work.count": "{count} rendszer",
    "work.aria": "Munkák",
    "nav.language": "Nyelv",
    "notFound.lead": "Ezen a címen nincs semmi.",
    "notFound.note":
      "A link elavult, vagy soha nem is a miénk volt. Minden termék, amit kiadunk, visszamutat a sirenvenue.sk-ra — ez az az oldal.",
  },
  cs: {
    colophon: "Software a systémy pro live, venue a galerie.",
    "work.label": "Práce",
    "work.count": "{count} systémů",
    "work.aria": "Práce",
    "nav.language": "Jazyk",
    "notFound.lead": "Na této adrese nic není.",
    "notFound.note":
      "Odkaz je zastaralý, nebo nikdy nebyl náš. Každý produkt, který vydáváme, odkazuje zpět na sirenvenue.sk — tohle je ta stránka.",
  },
  uk: {
    colophon: "Софтвер і системи для сцени, майданчиків і галерей.",
    "work.label": "Роботи",
    "work.count": "{count} систем",
    "work.aria": "Роботи",
    "nav.language": "Мова",
    "notFound.lead": "За цією адресою нічого немає.",
    "notFound.note":
      "Посилання застаріло, або ніколи не було нашим. Кожен продукт, який ми випускаємо, веде назад на sirenvenue.sk — це та сторінка.",
  },
  ru: {
    colophon: "Софт и системы для сцены, площадок и галерей.",
    "work.label": "Работы",
    "work.count": "{count} систем",
    "work.aria": "Работы",
    "nav.language": "Язык",
    "notFound.lead": "По этому адресу ничего нет.",
    "notFound.note":
      "Ссылка устарела или никогда не была нашей. Каждый продукт, который мы выпускаем, ведёт обратно на sirenvenue.sk — это та самая страница.",
  },
};

/**
 * Locales in canonical order, derived from the catalog literal. Typed as
 * `Locale` because `catalog` is a `Record<Locale, …>`, so this is exhaustive.
 */
export const messageLocales = Object.keys(catalog) as Locale[];

/** A key a locale intentionally does not carry. Rendered as nothing, never English. */
export type DeclaredMissing = {
  locale: Locale;
  key: MessageKey;
};

/**
 * Keys that are deliberately not translated for a locale. Empty today: every
 * locale carries a draft of every key. When a surface ships a label that no
 * translator can vouch for in a given language, name it here and the gate stays
 * honest instead of failing — or worse, falling back to English.
 */
export const declaredMissing: readonly DeclaredMissing[] = [];

/** True when `(locale, key)` is an explicit, accepted omission. */
export function isDeclaredMissing(locale: Locale, key: MessageKey): boolean {
  return declaredMissing.some(
    (entry) => entry.locale === locale && entry.key === key,
  );
}

/**
 * Resolve one message for one locale. Returns the value, or `null` when the key
 * is missing or declared missing. It never falls back to another locale.
 *
 * This is the documented render policy: `null` means the caller renders
 * nothing — not English, not Slovak, not a placeholder.
 */
export function message(locale: Locale, key: MessageKey): string | null {
  const value = catalog[locale]?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** A flattened row shaped exactly like the `Message` table. */
export type MessageRow = {
  key: MessageKey;
  locale: Locale;
  value: string;
  reviewed: boolean;
};

/**
 * `sk` and `en` are authored by the project and count as reviewed; the other
 * seven locales are drafts that a human who reads the language must still
 * approve.
 */
function isReviewed(locale: Locale): boolean {
  return locale === "sk" || locale === "en";
}

/**
 * Every present value as a seedable row, in canonical order. Declared-missing
 * entries produce no row — their absence in the table is the declaration.
 */
export function messageRows(): MessageRow[] {
  const rows: MessageRow[] = [];
  for (const locale of messageLocales) {
    for (const key of messageKeys) {
      const value = catalog[locale]?.[key];
      if (typeof value !== "string" || value.length === 0) continue;
      rows.push({ key, locale, value, reviewed: isReviewed(locale) });
    }
  }
  return rows;
}
