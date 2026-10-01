/**
 * SEO site facts.
 *
 * The legal identity (`LEGAL_NAME`, `ICO`, `CONTACT_EMAIL`, `SEAT`) is derived
 * from `content/legal.ts` — the single source of truth — so it is never
 * restated here. Only `SITE_URL`, which is not legal identity, is owned by this
 * module and lives in exactly this one place.
 */
import { company, contact, registeredSeat } from "@/content/legal";

export const SITE_URL = "https://sirenvenue.sk";

export const LEGAL_NAME = company.name;

/** Slovak company registration number (IČO). */
export const ICO = company.ico;

export const CONTACT_EMAIL = contact.email;

export const SEAT = registeredSeat;

/** Absolute URL for a locale's home page. */
export function localeUrl(locale: string): string {
  return `${SITE_URL}/${locale}`;
}
