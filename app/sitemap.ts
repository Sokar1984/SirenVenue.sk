import type { MetadataRoute } from "next";
import { enabledLocales } from "@/modules/i18n";
import { localeUrl } from "@/modules/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return enabledLocales.map((locale) => ({
    url: localeUrl(locale),
    changeFrequency: "monthly",
    priority: locale === "sk" ? 1 : 0.8,
  }));
}
