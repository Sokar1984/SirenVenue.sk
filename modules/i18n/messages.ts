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
 * Home page uses home.* keys (site v3: lead, identity, the Now index).
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
  "home.lead",
  "home.identity",
  "home.now",
  "home.client",
  "home.own",
  "home.dot",
  "home.comma",
  "home.blink",
  "home.next",
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
    colophon: "Riešenia na mieru pre ľudí a malé firmy.",
    "nav.language": "Jazyk",
    "notFound.lead": "Na tejto adrese nič nie je.",
    "notFound.note":
      "Odkaz je zastaraný alebo nikdy nebol náš. Každý produkt, ktorý vydávame, odkazuje späť na sirenvenue.sk. Toto je tá stránka.",
    "home.lead": "Každá úloha je iná. Aj odpoveď.",
    "home.identity": "Navrhujeme a staviame moderné riešenia na mieru. Pre jednotlivcov aj malé firmy. Z Bratislavy.",
    "home.now": "Teraz",
    "home.client": "Klient",
    "home.own": "Vlastný projekt",
    "home.dot": "Celá prevádzka, kúsok po kúsku.",
    "home.comma": "Rovnaký základ, vlastná tvár.",
    "home.blink": "Živá kamera pre miesta, ktoré potrebujú oči.",
    "home.next": "Ďalší riadok môže byť čokoľvek.",
  },
  en: {
    skip: "Skip to main content",
    colophon: "Made-to-measure solutions for people and small businesses.",
    "nav.language": "Language",
    "notFound.lead": "Nothing at this address.",
    "notFound.note":
      "The link is out of date, or it was never ours. Every product we ship links back to sirenvenue.sk. This is that page.",
    "home.lead": "Every problem is different. So is the answer.",
    "home.identity": "We design and build modern, made-to-measure solutions. For individuals and small businesses. From Bratislava.",
    "home.now": "Now",
    "home.client": "Client",
    "home.own": "Our own",
    "home.dot": "The whole operation, one piece at a time.",
    "home.comma": "Same foundation, its own face.",
    "home.blink": "A live camera for places that need eyes.",
    "home.next": "The next line could be anything.",
  },
  de: {
    skip: "Zum Hauptinhalt springen",
    colophon: "Maßgeschneiderte Lösungen für Menschen und kleine Unternehmen.",
    "nav.language": "Sprache",
    "notFound.lead": "Unter dieser Adresse gibt es nichts.",
    "notFound.note":
      "Der Link ist veraltet, oder er war nie unserer. Jedes Produkt, das wir ausliefern, verweist zurück auf sirenvenue.sk. Das hier ist diese Seite.",
    "home.lead": "Jede Aufgabe ist anders. Die Antwort auch.",
    "home.identity": "Wir entwerfen und bauen moderne Lösungen nach Maß. Für Einzelpersonen und kleine Unternehmen. Aus Bratislava.",
    "home.now": "Jetzt",
    "home.client": "Kunde",
    "home.own": "Eigenes Projekt",
    "home.dot": "Der ganze Betrieb, Stück für Stück.",
    "home.comma": "Gleiches Fundament, eigenes Gesicht.",
    "home.blink": "Eine Live-Kamera für Orte, die Augen brauchen.",
    "home.next": "Die nächste Zeile kann alles sein.",
  },
  es: {
    skip: "Saltar al contenido principal",
    colophon: "Soluciones a medida para personas y pequeñas empresas.",
    "nav.language": "Idioma",
    "notFound.lead": "En esta dirección no hay nada.",
    "notFound.note":
      "El enlace está desactualizado o nunca fue nuestro. Cada producto que publicamos enlaza de vuelta a sirenvenue.sk. Esta es esa página.",
    "home.lead": "Cada problema es distinto. La respuesta también.",
    "home.identity": "Diseñamos y construimos soluciones modernas a medida. Para particulares y pequeñas empresas. Desde Bratislava.",
    "home.now": "Ahora",
    "home.client": "Cliente",
    "home.own": "Proyecto propio",
    "home.dot": "Toda la operación, pieza a pieza.",
    "home.comma": "La misma base, su propia cara.",
    "home.blink": "Una cámara en directo para lugares que necesitan ojos.",
    "home.next": "La próxima línea puede ser cualquier cosa.",
  },
  "es-ve": {
    skip: "Saltar al contenido principal",
    colophon: "Soluciones a la medida para personas y pequeños negocios.",
    "nav.language": "Idioma",
    "notFound.lead": "No hay nada en esta dirección.",
    "notFound.note":
      "El enlace está vencido o nunca fue nuestro. Cada producto que lanzamos enlaza de vuelta a sirenvenue.sk. Esta es esa página.",
    "home.lead": "Cada problema es distinto. La respuesta también.",
    "home.identity": "Diseñamos y construimos soluciones modernas a la medida. Para personas y pequeños negocios. Desde Bratislava.",
    "home.now": "Ahora",
    "home.client": "Cliente",
    "home.own": "Proyecto propio",
    "home.dot": "Toda la operación, pieza por pieza.",
    "home.comma": "La misma base, su propia cara.",
    "home.blink": "Una cámara en vivo para lugares que necesitan ojos.",
    "home.next": "La próxima línea puede ser cualquier cosa.",
  },
  hu: {
    skip: "Ugrás a fő tartalomra",
    colophon: "Személyre szabott megoldások embereknek és kisvállalkozásoknak.",
    "nav.language": "Nyelv",
    "notFound.lead": "Ezen a címen nincs semmi.",
    "notFound.note":
      "A link elavult, vagy soha nem is a miénk volt. Minden termék, amit kiadunk, visszamutat a sirenvenue.sk-ra. Ez az az oldal.",
    "home.lead": "Minden feladat más. A válasz is.",
    "home.identity": "Modern, személyre szabott megoldásokat tervezünk és építünk. Magánszemélyeknek és kisvállalkozásoknak. Pozsonyból.",
    "home.now": "Most",
    "home.client": "Ügyfél",
    "home.own": "Saját projekt",
    "home.dot": "Az egész működés, darabról darabra.",
    "home.comma": "Ugyanaz az alap, saját arc.",
    "home.blink": "Élő kamera olyan helyekre, ahol szem kell.",
    "home.next": "A következő sor bármi lehet.",
  },
  cs: {
    skip: "Přeskočit na hlavní obsah",
    colophon: "Řešení na míru pro lidi a malé firmy.",
    "nav.language": "Jazyk",
    "notFound.lead": "Na této adrese nic není.",
    "notFound.note":
      "Odkaz je zastaralý, nebo nikdy nebyl náš. Každý produkt, který vydáváme, odkazuje zpět na sirenvenue.sk. Tohle je ta stránka.",
    "home.lead": "Každý úkol je jiný. I odpověď.",
    "home.identity": "Navrhujeme a stavíme moderní řešení na míru. Pro jednotlivce i malé firmy. Z Bratislavy.",
    "home.now": "Teď",
    "home.client": "Klient",
    "home.own": "Vlastní projekt",
    "home.dot": "Celý provoz, kousek po kousku.",
    "home.comma": "Stejný základ, vlastní tvář.",
    "home.blink": "Živá kamera pro místa, která potřebují oči.",
    "home.next": "Další řádek může být cokoli.",
  },
  uk: {
    skip: "Перейти до основного вмісту",
    colophon: "Рішення на замовлення для людей і малого бізнесу.",
    "nav.language": "Мова",
    "notFound.lead": "За цією адресою нічого немає.",
    "notFound.note":
      "Посилання застаріло, або ніколи не було нашим. Кожен продукт, який ми випускаємо, веде назад на sirenvenue.sk. Це та сторінка.",
    "home.lead": "Кожне завдання інше. І відповідь теж.",
    "home.identity": "Ми проєктуємо й будуємо сучасні рішення на замовлення. Для людей і малого бізнесу. З Братислави.",
    "home.now": "Зараз",
    "home.client": "Клієнт",
    "home.own": "Власний проєкт",
    "home.dot": "Уся робота, крок за кроком.",
    "home.comma": "Та сама основа, власне обличчя.",
    "home.blink": "Жива камера для місць, яким потрібні очі.",
    "home.next": "Наступний рядок може бути будь-чим.",
  },
  ru: {
    skip: "Перейти к основному содержанию",
    colophon: "Решения на заказ для людей и малого бизнеса.",
    "nav.language": "Язык",
    "notFound.lead": "По этому адресу ничего нет.",
    "notFound.note":
      "Ссылка устарела или никогда не была нашей. Каждый продукт, который мы выпускаем, ведёт обратно на sirenvenue.sk. Это та самая страница.",
    "home.lead": "Каждая задача другая. И ответ тоже.",
    "home.identity": "Мы проектируем и создаём современные решения на заказ. Для частных лиц и малого бизнеса. Из Братиславы.",
    "home.now": "Сейчас",
    "home.client": "Клиент",
    "home.own": "Собственный проект",
    "home.dot": "Вся работа, шаг за шагом.",
    "home.comma": "Та же основа, своё лицо.",
    "home.blink": "Живая камера для мест, которым нужны глаза.",
    "home.next": "Следующая строка может быть чем угодно.",
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
