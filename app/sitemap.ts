import type { MetadataRoute } from "next";
import { enabledLocales } from "@/modules/i18n";
import { CONTENT_UPDATED, languageAlternates, localeUrl, PAGES } from "@/modules/seo";

/** Every public page in every locale, each carrying its hreflang siblings. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((path) =>
    enabledLocales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: path === "" ? (locale === "sk" ? 1 : 0.8) : 0.5,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
