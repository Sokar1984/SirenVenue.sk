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
    title: "SirenVenue - softvér a systémy pre live, venue a galérie",
    description: `${LEGAL_NAME} je softvérová spoločnosť so sídlom v Bratislave. Staviame systémy pre live, venue a galériu.`,
    ogLocale: "sk_SK",
    hreflang: "sk",
  },
  en: {
    title: "SirenVenue - software & systems for live, venue, and gallery",
    description: `${LEGAL_NAME} is a software company based in Bratislava, Slovakia, building systems for live, venue, and gallery.`,
    ogLocale: "en_US",
    hreflang: "en",
  },
  de: {
    title: "SirenVenue - Software & Systeme für Live, Venue und Galerie",
    description: `${LEGAL_NAME} ist ein Softwareunternehmen mit Sitz in Bratislava, Slowakei, das Systeme für Live, Venue und Galerie entwickelt.`,
    ogLocale: "de_DE",
    hreflang: "de",
  },
  es: {
    title: "SirenVenue - software y sistemas para directo, recintos y galerías",
    description: `${LEGAL_NAME} es una empresa de software con sede en Bratislava, Eslovaquia, que crea sistemas para directo, recintos y galerías.`,
    ogLocale: "es_ES",
    hreflang: "es",
  },
  "es-ve": {
    title: "SirenVenue - software y sistemas para vivo, recintos y galerías",
    description: `${LEGAL_NAME} es una empresa de software con sede en Bratislava, Eslovaquia, que desarrolla sistemas para vivo, recintos y galerías.`,
    ogLocale: "es_VE",
    hreflang: "es-VE",
  },
  hu: {
    title: "SirenVenue - szoftver és rendszerek élő, helyszíni és galéria használatra",
    description: `A ${LEGAL_NAME} pozsonyi (Bratislava) székhelyű szoftvercég, amely élő, helyszíni és galéria rendszereket fejleszt.`,
    ogLocale: "hu_HU",
    hreflang: "hu",
  },
  cs: {
    title: "SirenVenue - software a systémy pro live, venue a galerie",
    description: `${LEGAL_NAME} je softwarová společnost se sídlem v Bratislavě, která vyvíjí systémy pro live, venue a galerie.`,
    ogLocale: "cs_CZ",
    hreflang: "cs",
  },
  uk: {
    title: "SirenVenue - програмне забезпечення та системи для сцени, майданчиків і галерей",
    description: `${LEGAL_NAME} - це софтверна компанія зі штаб-квартирою в Братиславі, Словаччина, що створює системи для сцени, майданчиків і галерей.`,
    ogLocale: "uk_UA",
    hreflang: "uk",
  },
  ru: {
    title: "SirenVenue - программное обеспечение и системы для выступлений, площадок и галерей",
    description: `${LEGAL_NAME} - софтверная компания со штаб-квартирой в Братиславе, Словакия, разрабатывающая системы для выступлений, площадок и галерей.`,
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
