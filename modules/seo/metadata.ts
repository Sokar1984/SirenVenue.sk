import type { Metadata } from "next";
import {
  defaultLocale,
  enabledLocales,
  type Locale,
} from "@/modules/i18n";
import { LEGAL_NAME, localeUrl, SITE_URL } from "./site";

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

/** All locale URLs plus the `x-default` fallback, keyed for `hreflang`. */
export function languageAlternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of enabledLocales) {
    languages[SEO[locale].hreflang] = localeUrl(locale);
  }
  languages["x-default"] = localeUrl(defaultLocale);
  return languages;
}

/**
 * Per-locale document metadata: localized title/description, the Open Graph
 * locale, a self-referencing canonical, and `hreflang` alternates for every
 * enabled locale plus `x-default`.
 */
export function pageMetadata(locale: Locale): Metadata {
  const copy = SEO[locale];
  const url = localeUrl(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      locale: copy.ogLocale,
      url,
      siteName: "SirenVenue",
      title: copy.title,
      description: copy.description,
    },
  };
}
