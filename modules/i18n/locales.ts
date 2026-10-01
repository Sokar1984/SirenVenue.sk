/**
 * Locale catalogue for SirenVenue.
 *
 * Slovak is the primary locale and is served from the site root (`/sk`), while
 * `/` redirects to it. The order below is the canonical display order.
 *
 * NOTE: `es-ve` is Venezuelan Spanish and is deliberately its own locale. It
 * must never be flattened into `es`: the two carry different copy and serve
 * different markets, and collapsing them would silently show the wrong one.
 */
export const locales = [
  "sk",
  "en",
  "de",
  "es",
  "es-ve",
  "hu",
  "cs",
  "uk",
  "ru",
] as const;

export type Locale = (typeof locales)[number];

/** Fallback when nothing else matches. */
export const defaultLocale: Locale = "sk";

/** Locales this deployment is allowed to serve. */
export const enabledLocales: readonly Locale[] = locales;

const enabled: ReadonlySet<string> = new Set(locales);

/** Type guard: narrows an arbitrary path segment to a known, enabled locale. */
export function isLocale(value: string): value is Locale {
  return enabled.has(value);
}

/**
 * Header label for a locale. Mirrors the plate treatment the site already used
 * (two-letter plates; Venezuelan Spanish is "VE", not "ES").
 */
export function localeLabel(locale: Locale): string {
  return locale === "es-ve" ? "VE" : locale.toUpperCase();
}

/**
 * Picks the best enabled locale from an `Accept-Language` header.
 *
 * Preference order follows the header's `q` weights. An exact tag wins
 * (`es-VE` -> `es-ve`), otherwise the base language is tried (`en-US` -> `en`).
 * Venezuelan Spanish is only ever selected by an explicit `es-ve`/`es-VE`
 * range — a plain `es` maps to `es` and never to `es-ve`. Returns `undefined`
 * when the header matches nothing so the caller can fall back.
 */
export function matchLocale(
  acceptLanguage: string | null | undefined,
): Locale | undefined {
  if (!acceptLanguage) return undefined;

  const ranges = acceptLanguage
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "") : 1;
      return { tag: rawTag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((range) => range.tag.length > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranges) {
    if (tag === "*") continue;

    const exact = locales.find((locale) => locale === tag);
    if (exact) return exact;

    const base = tag.split("-")[0];
    const baseMatch = locales.find((locale) => locale === base);
    if (baseMatch) return baseMatch;
  }

  return undefined;
}
