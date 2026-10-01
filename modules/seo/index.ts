/**
 * Public entry for the seo module.
 *
 * Trust metadata — the machine-readable answer to "who is this company".
 * Nothing outside this module may import its internals.
 */
export { organizationJsonLd, type OrganizationJsonLd } from "./jsonld";
export { pageMetadata, languageAlternates } from "./metadata";
export { SITE_URL, localeUrl } from "./site";
