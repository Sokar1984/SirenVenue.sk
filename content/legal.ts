/**
 * Legal identity for the house plaque footer — the single source of truth for
 * every fact the site publishes about the company.
 *
 * `modules/seo/site.ts` derives `LEGAL_NAME`, `ICO`, `CONTACT_EMAIL`, and
 * `SEAT` from this file, so the IČO, name, seat, and email are defined exactly
 * once. Do not restate them anywhere else.
 *
 * Source: Slovak Commercial Register via the RPO register (rpo.statistics.sk),
 * read through its public mirror at register.peniaze.sk. Verified 2026-10-01.
 * finstat.sk carries the same record but blocks automated reads.
 *
 * Vision note (Notion, CRE / SirenVenue): registration sits under the current
 * konateľ for personal reasons. List the entity cleanly; do not narrate it.
 * A konateľ change is a one-line update here.
 */

/**
 * Registered seat, split for machine-readable consumers (JSON-LD's
 * `PostalAddress`). `company.seat` below composes the human-readable string so
 * the address pieces still appear exactly once.
 */
export const registeredSeat = {
  street: "Jakubovo námestie 2556/3",
  postalCode: "811 09",
  city: "Bratislava",
  country: "SK",
} as const;

export const company = {
  name: "SirenVenue s. r. o.",
  ico: "56302941",
  seat: `${registeredSeat.street}, ${registeredSeat.postalCode} ${registeredSeat.city}`,
  country: "Slovakia",
  registered: "31 May 2024",
  court: "Mestský súd Bratislava III",
  file: "Sro/178935/B",
} as const;

export const contact = {
  email: "hello@sirenvenue.sk",
  city: "Bratislava, Slovakia",
} as const;
