export type Work = {
  /** Product name as it appears on the grid. */
  name: string;
  /** Short label — a few words, not a sentence. */
  role: string;
  /** Live URL. */
  href: string;
  /** Public repo only. Omit when private. */
  repo?: string;
  /** Real stack, one line. */
  stack?: string;
  /** in development / staging / live in production */
  status?: string;
  /** One or two factual sentences. No marketing. */
  note?: string;
};

export const works: Work[] = [
  {
    name: "SirenVenue.com",
    role: "Live venue",
    href: "https://www.sirenvenue.com",
  },
  {
    name: "BlinkLive",
    role: "Live camera",
    href: "https://blinklive.app",
  },
  {
    name: "DOT. Gallery",
    role: "Gallery systems",
    href: "https://dotgallery.sk",
  },
  {
    name: "DOT. sklad",
    role: "Staff warehouse",
    href: "https://sklad.dotgallery.sk",
    stack: "Next.js 15 · TypeScript · Postgres / Prisma",
    status: "Live in production",
    note: "One inventory for DOT. Gallery: artists, works, clients, where a work is, and the paper that hangs on it. Staff session-cookie auth, API under /api/v1.",
    // Repo is private: https://github.com/Sokar1984/dot-sklad — not linked.
  },
];
