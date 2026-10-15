/**
 * Public entry for the seo module.
 *
 * Trust metadata — the machine-readable answer to "who is this company".
 * Nothing outside this module may import its internals.
 */
export { organizationJsonLd, type OrganizationJsonLd } from "./jsonld";
export { pageMetadata, languageAlternates, type PageSeo } from "./metadata";
export { SITE_URL, CONTENT_UPDATED, PAGES, localeUrl, type PagePath } from "./site";
