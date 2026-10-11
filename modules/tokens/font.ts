import { Geist, Instrument_Serif } from "next/font/google";

/**
 * The site's two typefaces, both self-hosted through `next/font` (fetched and
 * fingerprinted at build time, no runtime request to Google, metrics-matched
 * fallback, no layout shift). This is the only place families are chosen.
 *
 * Geist carries everything functional: chrome, labels, body.
 * Instrument Serif carries the voice: the lead line and the names in the index.
 * Two families, two jobs, never mixed inside one element.
 */
export const geist = Geist({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});
