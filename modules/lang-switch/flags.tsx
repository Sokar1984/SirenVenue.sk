import type { Locale } from "@/modules/i18n";

/*
 * Drawn flags — every one is inline `<svg>` geometry, never an image file and
 * never an emoji. SOK-239 banned the *emoji* globe/flag glyph because an emoji
 * renders as whatever the visitor's OS ships and cannot be controlled; a drawn
 * SVG is authored here, styled from modules/tokens, and is exactly what the ban
 * was protecting. Do not "simplify" one of these into an emoji or a remote
 * image.
 *
 * `es-ve` copies the eight-star Venezuelan band and star geometry verbatim from
 * the dot-sklad reference (`language-control.tsx`) — it was already correct and
 * is deliberately not redrawn by eye.
 */

/** Shared box: 24×16 viewBox, small fixed size, slightly rounded, clipped. */
const FLAG_CLASS = "lang-flag";

/** One five-pointed star, centred on the origin. */
const STAR_PATH =
  "M0 -0.9 L0.212 -0.291 L0.856 -0.278 L0.342 0.111 L0.529 0.728 L0 0.36 L-0.529 0.728 L-0.342 0.111 L-0.856 -0.278 L-0.212 -0.291 Z";

/** The eight stars on Venezuela's arc, copied from dot-sklad unchanged. */
const VENEZUELA_STARS: Array<[number, number]> = [
  [5.4, 9.1],
  [7.3, 8],
  [9.2, 7],
  [11.2, 6.5],
  [12.8, 6.5],
  [14.8, 7],
  [16.7, 8],
  [18.6, 9.1],
];

/**
 * The current locale's flag, or the flag for any option in the list. Purely
 * presentational: no state, no client-only API, safe to render on the server.
 */
export function Flag({ code }: { code: Locale }) {
  switch (code) {
    case "sk":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="5.333" fill="#ffffff" />
          <rect y="5.333" width="24" height="5.334" fill="#0B4EA2" />
          <rect y="10.667" width="24" height="5.333" fill="#EE1C25" />
          <path
            d="M1.5 1.8h6.4v6.6c0 2.8-3.2 4.8-3.2 4.8s-3.2-2-3.2-4.8z"
            fill="#EE1C25"
            stroke="#ffffff"
            strokeWidth="0.45"
          />
          <rect x="4.35" y="2.7" width="0.7" height="5.5" fill="#ffffff" />
          <rect x="3.45" y="3.55" width="2.5" height="0.62" fill="#ffffff" />
          <rect x="2.95" y="4.85" width="3.5" height="0.62" fill="#ffffff" />
          <path
            d="M2.05 8.7c.55-.85 1.15-.15 1.35.45.45-1.35 1.55-.35 1.75.55.5-.85 1.15-.1 1.4.5v.55c0 1.15-2.25 2.05-2.25 2.05S2.05 11.35 2.05 10.2z"
            fill="#0B4EA2"
          />
        </svg>
      );
    case "en":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="16" fill="#012169" />
          <path
            d="M0 0 24 16 M24 0 0 16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
          />
          <path
            d="M0 0 24 16 M24 0 0 16"
            fill="none"
            stroke="#c8102e"
            strokeWidth="1.2"
          />
          <path
            d="M12 0 V16 M0 8 H24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5.33"
          />
          <path
            d="M12 0 V16 M0 8 H24"
            fill="none"
            stroke="#c8102e"
            strokeWidth="3.2"
          />
        </svg>
      );
    case "de":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="5.333" fill="#000000" />
          <rect y="5.333" width="24" height="5.334" fill="#DD0000" />
          <rect y="10.667" width="24" height="5.333" fill="#FFCE00" />
        </svg>
      );
    case "es":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="16" fill="#AA151B" />
          <rect y="4" width="24" height="8" fill="#F1BF00" />
          <path
            d="M5.6 6h3.4v2.3c0 1.5-1.7 2.6-1.7 2.6S5.6 9.8 5.6 8.3z"
            fill="#AA151B"
            stroke="#8a7a3a"
            strokeWidth="0.28"
          />
          <rect
            x="5.95"
            y="6.45"
            width="2.7"
            height="1.2"
            fill="#F1BF00"
            stroke="#8a7a3a"
            strokeWidth="0.2"
          />
        </svg>
      );
    case "es-ve":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="5.34" fill="#fcd116" />
          <rect y="5.34" width="24" height="5.33" fill="#0033a0" />
          <rect y="10.67" width="24" height="5.33" fill="#ce1126" />
          {VENEZUELA_STARS.map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={STAR_PATH}
              transform={`translate(${x} ${y})`}
              fill="#ffffff"
            />
          ))}
        </svg>
      );
    case "hu":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="5.333" fill="#CE2939" />
          <rect y="5.333" width="24" height="5.334" fill="#FFFFFF" />
          <rect y="10.667" width="24" height="5.333" fill="#477050" />
        </svg>
      );
    case "cs":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="8" fill="#ffffff" />
          <rect y="8" width="24" height="8" fill="#d7141a" />
          <path d="M0 0 10 8 0 16Z" fill="#11457e" />
        </svg>
      );
    case "uk":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="8" fill="#0057B7" />
          <rect y="8" width="24" height="8" fill="#FFD700" />
        </svg>
      );
    case "ru":
      return (
        <svg viewBox="0 0 24 16" aria-hidden="true" className={FLAG_CLASS}>
          <rect width="24" height="5.333" fill="#ffffff" />
          <rect y="5.333" width="24" height="5.334" fill="#0039a6" />
          <rect y="10.667" width="24" height="5.333" fill="#d52b1e" />
        </svg>
      );
  }
}
