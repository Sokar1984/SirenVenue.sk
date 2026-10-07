/**
 * Typed message catalog - the only place the site's chrome and section labels
 * are written.
 *
 * What belongs here
 * -----------------
 * Short, structural strings: the colophon line, section labels, an `aria-label`
 * or two, and the 404 copy. Product names never belong here. `BlinkLive`
 * and `DOT. Gallery` are brands: they are spelled the same in every locale and
 * are translated by no one. (SirenVenue.com tile removed per SOK-350.)
 * Home plaque uses home.* keys for SOK-348 vision sections.
 *
 * Where the strings live at runtime
 * ---------------------------------
 * This module is the single runtime source for the chrome. It is also the
 * authored input `prisma/seed-content.ts` projects into the `messages` table
 * (`key`, `locale`, `value`, `reviewed`) for machine consumers, exactly as
 * `content/works.ts` seeds the `Work` table.
 *
 * The chrome deliberately reads this module and not that table. The shell must
 * render when Postgres is down (see the outage policy in `modules/content`), and
 * the render policy below - a declared-missing key renders nothing - is stated
 * only here: the table has no notion of a declaration, and the seed projects
 * rows without ever deleting one. `modules/content` owns the only Prisma client,
 * so the chrome cannot consult the table without opening a second one. Chosen:
 * one runtime source, this file. The table remains seed output, not a read path.
 *
 * The gate in `scripts/check-messages.mjs` reads this module directly so it
 * stays dependency-free and CI-runnable.
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
 * Render policy - no silent English
 * ---------------------------------
 * A key that is absent for a locale and not declared in `declaredMissing` is a
 * defect: the completeness gate fails the build. At render time, `message()`
 * returns the value only for the exact locale asked for. A declared-missing key
 * renders nothing at all - the surface omits the element rather than showing a
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
  "skip",
  "colophon",
  "nav.language",
  "notFound.lead",
  "notFound.note",
  "home.identity",
  "home.client",
  "home.blink",
  "home.operations",
  "home.documents",
  "home.live",
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
    skip: "Prejsť na hlavný obsah",
    colophon: "Softvér a systémy pre live, venue a galérie.",
    "nav.language": "Jazyk",
    "notFound.lead": "Na tejto adrese nič nie je.",
    "notFound.note":
      "Odkaz je zastaraný alebo nikdy nebol náš. Každý produkt, ktorý vydávame, odkazuje späť na sirenvenue.sk. Toto je tá stránka.",
    "home.identity":
      "SirenVenue stavia softvér pre galérie a kultúrne priestory. Navrhujeme a dodávame systémy, na ktorých tieto miesta skutočne bežia. Bratislava. Slovenská spoločnosť. Remeslo na prvom mieste.",
    "home.client":
      "DOT. Gallery + COMMA modernizácia. Inventár, dokumenty, udalosti, predaj, automatizácia naprieč doménami. AI sekretárka na podanie a granty. Sklad je interná chrbtica, nie verejná produktová dlaždica.",
    "home.blink": "Živá kamera pre priestory, ktoré potrebujú oči.",
    "home.operations": "operácie",
    "home.documents": "dokumenty",
    "home.live": "live",
  },
  en: {
    skip: "Skip to main content",
    colophon: "Software & systems for live, venue, and gallery.",
    "nav.language": "Language",
    "notFound.lead": "Nothing at this address.",
    "notFound.note":
      "The link is out of date, or it was never ours. Every product we ship links back to sirenvenue.sk. This is that page.",
    "home.identity":
      "SirenVenue builds software for galleries and cultural venues. We design and ship the systems those places actually run on. Bratislava. Slovak company. Craft first.",
    "home.client":
      "DOT. Gallery + COMMA modernization. Inventory, documents, events, sales, automation across domains. AI secretary for filing and grants. Sklad is the internal backbone, not a public product tile.",
    "home.blink": "Live camera for rooms that need eyes.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  de: {
    skip: "Zum Hauptinhalt springen",
    colophon: "Software & Systeme für Live, Venue und Galerie.",
    "nav.language": "Sprache",
    "notFound.lead": "Unter dieser Adresse gibt es nichts.",
    "notFound.note":
      "Der Link ist veraltet, oder er war nie unserer. Jedes Produkt, das wir ausliefern, verweist zurück auf sirenvenue.sk. Das hier ist diese Seite.",
    "home.identity":
      "SirenVenue baut Software für Galerien und Kulturorte. Wir entwerfen und liefern die Systeme, die diese Orte tatsächlich nutzen. Bratislava. Slowakisches Unternehmen. Handwerk zuerst.",
    "home.client":
      "DOT. Gallery + COMMA Modernisierung. Inventar, Dokumente, Veranstaltungen, Verkauf, Automatisierung über Domänen. KI Sekretärin für Ablage und Förderungen. Sklad ist das interne Rückgrat, keine öffentliche Produktkachel.",
    "home.blink": "Live Kamera für Räume, die Augen brauchen.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  es: {
    skip: "Saltar al contenido principal",
    colophon: "Software y sistemas para directo, recintos y galerías.",
    "nav.language": "Idioma",
    "notFound.lead": "En esta dirección no hay nada.",
    "notFound.note":
      "El enlace está desactualizado o nunca fue nuestro. Cada producto que publicamos enlaza de vuelta a sirenvenue.sk. Esta es esa página.",
    "home.identity":
      "SirenVenue construye software para galerías y espacios culturales. Diseñamos y entregamos los sistemas que estos lugares realmente utilizan. Bratislava. Empresa eslovaca. Artesanía primero.",
    "home.client":
      "DOT. Gallery + modernización COMMA. Inventario, documentos, eventos, ventas, automatización entre dominios. Secretaria de IA para archivos y subvenciones. Sklad es la columna interna, no una baldosa de producto público.",
    "home.blink": "Cámara en vivo para salas que necesitan ojos.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  "es-ve": {
    skip: "Saltar al contenido principal",
    colophon: "Software y sistemas para vivo, recintos y galerías.",
    "nav.language": "Idioma",
    "notFound.lead": "No hay nada en esta dirección.",
    "notFound.note":
      "El enlace está vencido o nunca fue nuestro. Cada producto que lanzamos enlaza de vuelta a sirenvenue.sk. Esta es esa página.",
    "home.identity":
      "SirenVenue construye software para galerías y espacios culturales. Diseñamos y entregamos los sistemas que estos lugares realmente utilizan. Bratislava. Empresa eslovaca. Artesanía primero.",
    "home.client":
      "DOT. Gallery + modernización COMMA. Inventario, documentos, eventos, ventas, automatización entre dominios. Secretaria de IA para archivos y subvenciones. Sklad es la columna interna, no una baldosa de producto público.",
    "home.blink": "Cámara en vivo para salas que necesitan ojos.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  hu: {
    skip: "Ugrás a fő tartalomra",
    colophon: "Szoftver és rendszerek élő, helyszíni és galéria használatra.",
    "nav.language": "Nyelv",
    "notFound.lead": "Ezen a címen nincs semmi.",
    "notFound.note":
      "A link elavult, vagy soha nem is a miénk volt. Minden termék, amit kiadunk, visszamutat a sirenvenue.sk-ra. Ez az az oldal.",
    "home.identity":
      "SirenVenue szoftvert épít galériák és kulturális helyszínek számára. Megtervezzük és leszállítjuk azokat a rendszereket, amelyeket ezek a helyek valóban használnak. Bratislava. Szlovák cég. Kézművesség először.",
    "home.client":
      "DOT. Gallery + COMMA modernizáció. Leltár, dokumentumok, események, értékesítés, automatizálás tartományok között. AI titkár irattárhoz és támogatásokhoz. Sklad a belső gerinc, nem nyilvános termékcsempe.",
    "home.blink": "Élő kamera olyan helyiségekhez, amelyeknek szemek kellenek.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  cs: {
    skip: "Přeskočit na hlavní obsah",
    colophon: "Software a systémy pro live, venue a galerie.",
    "nav.language": "Jazyk",
    "notFound.lead": "Na této adrese nic není.",
    "notFound.note":
      "Odkaz je zastaralý, nebo nikdy nebyl náš. Každý produkt, který vydáváme, odkazuje zpět na sirenvenue.sk. Tohle je ta stránka.",
    "home.identity":
      "SirenVenue staví software pro galerie a kulturní prostory. Navrhujeme a dodáváme systémy, na kterých tato místa skutečně běží. Bratislava. Slovenská společnost. Řemeslo na prvním místě.",
    "home.client":
      "DOT. Gallery + COMMA modernizace. Inventář, dokumenty, události, prodej, automatizace napříč doménami. AI sekretářka pro podání a granty. Sklad je interní páteř, ne veřejná produktová dlaždice.",
    "home.blink": "Živá kamera pro místnosti, které potřebují oči.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  uk: {
    skip: "Перейти до основного вмісту",
    colophon: "Софтвер і системи для сцени, майданчиків і галерей.",
    "nav.language": "Мова",
    "notFound.lead": "За цією адресою нічого немає.",
    "notFound.note":
      "Посилання застаріло, або ніколи не було нашим. Кожен продукт, який ми випускаємо, веде назад на sirenvenue.sk. Це та сторінка.",
    "home.identity":
      "SirenVenue створює програмне забезпечення для галерей і культурних просторів. Ми проєктуємо та постачаємо системи, на яких ці місця справді працюють. Bratislava. Словацька компанія. Ремесло насамперед.",
    "home.client":
      "DOT. Gallery + COMMA модернізація. Інвентар, документи, події, продажі, автоматизація між доменами. AI секретар для подання та грантів. Sklad є внутрішнім хребтом, не публічним продуктом.",
    "home.blink": "Жива камера для приміщень, яким потрібні очі.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
  },
  ru: {
    skip: "Перейти к основному содержанию",
    colophon: "Софт и системы для сцены, площадок и галерей.",
    "nav.language": "Язык",
    "notFound.lead": "По этому адресу ничего нет.",
    "notFound.note":
      "Ссылка устарела или никогда не была нашей. Каждый продукт, который мы выпускаем, ведёт обратно на sirenvenue.sk. Это та самая страница.",
    "home.identity":
      "SirenVenue создаёт ПО для галерей и культурных пространств. Мы проектируем и поставляем системы, на которых эти места реально работают. Bratislava. Словацкая компания. Ремесло прежде всего.",
    "home.client":
      "DOT. Gallery + COMMA модернизация. Инвентарь, документы, события, продажи, автоматизация между доменами. AI секретарь для подачи и грантов. Sklad это внутренний хребет, не публичный продукт.",
    "home.blink": "Живая камера для помещений, которым нужны глаза.",
    "home.operations": "operations",
    "home.documents": "documents",
    "home.live": "live",
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
 * honest instead of failing - or worse, falling back to English.
 */
export const declaredMissing: readonly DeclaredMissing[] = [];

/** True when `(locale, key)` is an explicit, accepted omission. */
export function isDeclaredMissing(locale: Locale, key: MessageKey): boolean {
  return declaredMissing.some(
    (entry) => entry.locale === locale && entry.key === key,
  );
}

/**
 * Values a placeholder can be filled with. The catalog carries exactly one
 * placeholder, `{count}`; a value is a template, never a formatted number.
 */
export type MessageParams = {
  count?: number;
};

/**
 * Fill a message template's placeholders. The only placeholder is `{count}`,
 * replaced with `params.count`. A placeholder with no value collapses to the
 * empty string rather than leaking `{count}` to the page. Placeholders are never
 * translated; only the words around them are.
 */
export function format(value: string, params: MessageParams = {}): string {
  return value.replace(/\{count\}/g, () =>
    params.count === undefined ? "" : String(params.count),
  );
}

/**
 * Resolve one message for one locale. Returns the formatted value, or `null`
 * when the key is missing or declared missing. It never falls back to another
 * locale.
 *
 * This is the documented render policy: `null` means the caller renders
 * nothing - not English, not Slovak, not a placeholder. A declaration beats a
 * stale value: if `(locale, key)` is declared missing, nothing is returned even
 * if a value is still present.
 */
export function message(
  locale: Locale,
  key: MessageKey,
  params: MessageParams = {},
): string | null {
  if (isDeclaredMissing(locale, key)) return null;
  const value = catalog[locale]?.[key];
  return typeof value === "string" && value.length > 0
    ? format(value, params)
    : null;
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
 * entries produce no row - their absence in the table is the declaration.
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
