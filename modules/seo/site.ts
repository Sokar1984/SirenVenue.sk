/**
 * SEO site facts.
 *
 * The legal identity (`LEGAL_NAME`, `ICO`, `CONTACT_EMAIL`, `SEAT`) is derived
 * from `content/legal.ts`, the single source of truth, so it is never restated
 * here. Only `SITE_URL`, the page list and the content date, which are not
 * legal identity, are owned by this module.
 */
import { company, contact, registeredSeat } from "@/content/legal";

export const SITE_URL = "https://sirenvenue.sk";

export const LEGAL_NAME = company.name;

/** Slovak company registration number (IČO). */
export const ICO = company.ico;

export const CONTACT_EMAIL = contact.email;

export const SEAT = registeredSeat;

/** ISO date of company registration, from `company.registered` (31 May 2024). */
export const FOUNDING_DATE = "2024-05-31";

/**
 * Last real content change of the public pages. Bump it when copy changes; it
 * feeds sitemap `<lastmod>`, so it must never be set to "now" on every build.
 */
export const CONTENT_UPDATED = "2026-10-15";

/** Public pages under each locale, "" being the index. */
export const PAGES = ["", "/about", "/privacy"] as const;
export type PagePath = (typeof PAGES)[number];

/** Absolute URL for a locale's page (index when `path` is empty). */
export function localeUrl(locale: string, path: string = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}
