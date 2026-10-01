import { Geist } from "next/font/google";

/**
 * The site's one typeface.
 *
 * Declared through `next/font` so the woff2 files are pulled and fingerprinted
 * at build time, served from our own origin, and preloaded with a metrics-matched
 * fallback — no runtime request to Google, no layout shift. This is the only
 * place the family is chosen; the variable `--font-sans` is consumed by
 * app/globals.css and mirrored by `tokens.font.family`.
 */
export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
