/**
 * Portfolio works shown on the plaque grid.
 *
 * `role` uses the vocabulary the CEO vision specifies for work/case entries:
 * **product / live / gallery ops / systems**. Do not invent descriptive labels
 * here — the vision names the terms.
 *
 * `href` values are probed before being added; a dead one is a bug, not a detail.
 */
export type Work = {
  /** Product name as it appears on the grid. */
  name: string;
  /** One of: product | live | gallery ops | systems */
  role: "product" | "live" | "gallery ops" | "systems";
  /** Live URL that answers. Probed before adding. */
  href: string;
  /** Public repo only. Omit when private. */
  repo?: string;
  /** Real stack, one line, taken from package.json. */
  stack?: string;
  /** Live / staging / in development */
  status?: string;
  /** One or two factual sentences. No marketing. */
  note?: string;
};

export const works: Work[] = [
  {
    name: "SirenVenue.com",
    role: "product",
    href: "https://sirenvenue.com",
    stack: "Next.js · Prisma · Vercel Blob",
    status: "Live",
  },
  {
    name: "BlinkLive",
    role: "live",
    href: "https://blinklive.app",
    stack: "Next.js · LiveKit",
    status: "Live",
    note: "Portable live webcam media plane. Consumed by SirenVenue and DOT. AMB; no reverse dependencies on the host apps.",
  },
  {
    name: "DOT. Gallery",
    role: "gallery ops",
    href: "https://dotgallery.sk",
    repo: "https://github.com/Sokar1984/dot-contemporary",
    stack: "Next.js · TypeScript",
    status: "Live",
  },
  {
    name: "DOT. sklad",
    role: "gallery ops",
    href: "https://sklad.dotgallery.sk",
    stack: "Next.js 15 · TypeScript · Postgres / Prisma",
    status: "Live in production",
    note: "One inventory for DOT. Gallery: artists, works, clients, where a work is, and the paper that hangs on it. Staff session-cookie auth, API under /api/v1.",
    // Repo is private: https://github.com/Sokar1984/dot-sklad — not linked.
  },
  {
    name: "DOT. AMB 2026",
    role: "gallery ops",
    href: "https://dotgallery.sk/art-market-budapest",
    stack: "Next.js",
    status: "Live",
    note: "Fair landing page for DOT. Contemporary at Art Market Budapest 2026.",
    // Repo dot-amb-2026 is private; the old dot-amb-2026.vercel.app deploy is gone (404).
  },
];
