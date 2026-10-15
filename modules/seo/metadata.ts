import type { Metadata } from "next";
import {
  defaultLocale,
  enabledLocales,
  type Locale,
} from "@/modules/i18n";
import { LEGAL_NAME, localeUrl, SITE_URL, type PagePath } from "./site";

type LocaleSeo = {
  /** `<title>` / `og:title`. */
  title: string;
  /** `<meta name="description">` / `og:description`. */
  description: string;
  /** Open Graph locale, region-qualified (`en_US`). */
  ogLocale: string;
  /** `hreflang` tag, BCP 47 (Venezuelan Spanish is `es-VE`). */
  hreflang: string;
};

const SEO: Record<Locale, LocaleSeo> = {
  sk: {
    title: "SirenVenue - riešenia na mieru",
    description: `${LEGAL_NAME} navrhuje a stavia moderné riešenia na mieru pre jednotlivcov a malé firmy. Bratislava.`,
    ogLocale: "sk_SK",
    hreflang: "sk",
  },
  en: {
    title: "SirenVenue - made-to-measure solutions",
    description: `${LEGAL_NAME} designs and builds modern, made-to-measure solutions for individuals and small businesses. Bratislava, Slovakia.`,
    ogLocale: "en_US",
    hreflang: "en",
  },
  de: {
    title: "SirenVenue - Lösungen nach Maß",
    description: `${LEGAL_NAME} entwirft und baut moderne Lösungen nach Maß für Einzelpersonen und kleine Unternehmen. Bratislava, Slowakei.`,
    ogLocale: "de_DE",
    hreflang: "de",
  },
  es: {
    title: "SirenVenue - soluciones a medida",
    description: `${LEGAL_NAME} diseña y construye soluciones modernas a medida para particulares y pequeñas empresas. Bratislava, Eslovaquia.`,
    ogLocale: "es_ES",
    hreflang: "es",
  },
  "es-ve": {
    title: "SirenVenue - soluciones a la medida",
    description: `${LEGAL_NAME} diseña y construye soluciones modernas a la medida para personas y pequeños negocios. Bratislava, Eslovaquia.`,
    ogLocale: "es_VE",
    hreflang: "es-VE",
  },
  hu: {
    title: "SirenVenue - személyre szabott megoldások",
    description: `A ${LEGAL_NAME} modern, személyre szabott megoldásokat tervez és épít magánszemélyeknek és kisvállalkozásoknak. Pozsony, Szlovákia.`,
    ogLocale: "hu_HU",
    hreflang: "hu",
  },
  cs: {
    title: "SirenVenue - řešení na míru",
    description: `${LEGAL_NAME} navrhuje a staví moderní řešení na míru pro jednotlivce a malé firmy. Bratislava, Slovensko.`,
    ogLocale: "cs_CZ",
    hreflang: "cs",
  },
  uk: {
    title: "SirenVenue - рішення на замовлення",
    description: `${LEGAL_NAME} проєктує й будує сучасні рішення на замовлення для людей і малого бізнесу. Братислава, Словаччина.`,
    ogLocale: "uk_UA",
    hreflang: "uk",
  },
  ru: {
    title: "SirenVenue - решения на заказ",
    description: `${LEGAL_NAME} проектирует и создаёт современные решения на заказ для частных лиц и малого бизнеса. Братислава, Словакия.`,
    ogLocale: "ru_RU",
    hreflang: "ru",
  },
};

/** Every locale's URL for one page, plus `x-default` (Slovak). Includes self. */
export function languageAlternates(path: PagePath = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of enabledLocales) {
    languages[SEO[locale].hreflang] = localeUrl(locale, path);
  }
  languages["x-default"] = localeUrl(defaultLocale, path);
  return languages;
}

/** Optional per-page overrides. The index uses the locale's own SEO entry. */
export type PageSeo = {
  path: PagePath;
  title: string | null;
  description: string | null;
};

/**
 * Per-locale document metadata: localized title/description, the Open Graph
 * locale, a self-referencing canonical for this exact page, and `hreflang`
 * alternates for the same page in every enabled locale plus `x-default`.
 * The og:image comes from app/[locale]/opengraph-image.tsx.
 */
export function pageMetadata(locale: Locale, page?: PageSeo): Metadata {
  const copy = SEO[locale];
  const path = page?.path ?? "";
  const url = localeUrl(locale, path);
  const title = page?.title ? `${page.title} · SirenVenue` : copy.title;
  const description = page?.description ?? copy.description;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: copy.ogLocale,
      alternateLocale: enabledLocales
        .filter((other) => other !== locale)
        .map((other) => SEO[other].ogLocale),
      url,
      siteName: "SirenVenue",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
