/**
 * Portfolio works on the plaque grid.
 *
 * SOURCE OF TRUTH - Notion: CRE / SirenVenue -> "sirenvenue.sk - CEO vision
 * (company site)". Entries here must come from that page and nowhere else.
 *
 * NOT sources: GitHub repos and package.json files, the sirenvenue.com
 * project's Linear board, other projects' Notion pages, other agents' messages.
 * Scraping those once put fields in this file describing other people's
 * projects, and mis-stated what this company site is.
 *
 * The vision's own portfolio list, verbatim (SirenVenue.com tile dropped per
 * content policy SOK-350; DOT. Sklad kept out of public tiles):
 *   - BlinkLive - live camera / LiveKit stack
 *   - DOT. Gallery / AMB - inventory, staff UI, redesign
 *   - AI / ops systems - only if we want "systems" on the shelf without
 *     selling agency hours
 *
 * `role` vocabulary is fixed by the vision: product | live | gallery ops | systems.
 */
export type Work = {
  /** Name exactly as the vision lists it. */
  name: string;
   /** product | live | gallery ops | systems - the vision's terms, not ours. */
  role: "product" | "live" | "gallery ops" | "systems";
  /** Live URL, supplied or approved by Matus. Probed before use. */
  href: string;
  /** The vision's own words for this work. Omit rather than invent one. */
  descriptor?: string;
};

export const works: Work[] = [
  {
    name: "BlinkLive",
    role: "live",
    href: "https://blinklive.app",
    descriptor: "Live camera / LiveKit stack",
  },
  {
    name: "DOT. Gallery",
    role: "gallery ops",
    href: "https://dotgallery.sk",
    descriptor: "Inventory, staff UI, redesign",
  },
  // Deliberately NOT added (per content policy; no warehouse / Sklad tile):
   //   - DOT. sklad and the AMB 2026 page - the vision folds them into
   //     "DOT. Gallery / AMB" above.
   //   - "AI / ops systems" - the vision lists it as optional ("only if we want").
   //   - SirenVenue.com - removed per SOK-350.
];
