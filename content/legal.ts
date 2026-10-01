/**
 * Legal identity for the house plaque footer.
 *
 * Source: Slovak Commercial Register via the RPO register (rpo.statistics.sk),
 * read through its public mirror at register.peniaze.sk. Verified 2026-10-01.
 * finstat.sk carries the same record but blocks automated reads.
 *
 * Vision note (Notion, CRE / SirenVenue): registration sits under the current
 * konateľ for personal reasons. List the entity cleanly; do not narrate it.
 * A konateľ change is a one-line update here.
 */
export const company = {
  name: "SirenVenue s. r. o.",
  ico: "56302941",
  seat: "Jakubovo námestie 2556/3, 811 09 Bratislava",
  country: "Slovakia",
  registered: "31 May 2024",
  court: "Mestský súd Bratislava III",
  file: "Sro/178935/B",
} as const;

export const contact = {
  email: "hello@sirenvenue.sk",
  city: "Bratislava, Slovakia",
} as const;
