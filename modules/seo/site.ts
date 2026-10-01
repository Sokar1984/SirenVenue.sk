/**
 * The only facts the site may publish about the company.
 *
 * Everything here is verified identity data; nothing inferred or invented may
 * be added (no registrations, VAT/DIČ, dates, ratings, or social profiles).
 */
export const SITE_URL = "https://sirenvenue.sk";

export const LEGAL_NAME = "SirenVenue s. r. o.";

/** Slovak company registration number (IČO). */
export const ICO = "56302941";

export const CONTACT_EMAIL = "hello@sirenvenue.sk";

export const SEAT = {
  street: "Jakubovo námestie 2556/3",
  postalCode: "811 09",
  city: "Bratislava",
  country: "SK",
} as const;

/** Absolute URL for a locale's home page. */
export function localeUrl(locale: string): string {
  return `${SITE_URL}/${locale}`;
}
