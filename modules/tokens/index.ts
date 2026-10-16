/**
 * Public entry for the tokens module.
 *
 * Mirrors modules/tokens/tokens.css so TypeScript code can reason about the
 * same values the browser consumes. This is the only file other modules may
 * import from.
 */
/** Re-exported so the family is declared once, in modules/tokens/font.ts. */
export { geist, serif } from "./font";

export const tokens = {
  color: {
    bg: "#0e0d0b",
    fg: "#e8e4dc",
    muted: "#bfb9ae",
    dim: "#8a847b",
    line: "#2a2723",
    lift: "rgba(232, 228, 220, 0.04)",
    signal: "#e2553b",
  },
  font: {
    family: "var(--font-sans)",
    text: "1.0625rem",
    small: "0.8125rem",
    serif: "var(--font-serif)",
    lead: "clamp(2.5rem, 5vw, 4.5rem)",
    identity: "1.0625rem",
    entry: "clamp(1.5rem, 2.3vw, 2.1rem)",
    body: "1.0625rem",
    markName: "1.0625rem",
    markLegal: "0.8125rem",
    locales: "0.8125rem",
    colophon: "clamp(1.5rem, 2.3vw, 2.1rem)",
    note: "1.0625rem",
    label: "0.8125rem",
    rowNo: "0.8125rem",
    rowName: "clamp(1.5rem, 2.3vw, 2.1rem)",
    rowMeta: "0.8125rem",
    rowArrow: "0.8125rem",
    foot: "0.8125rem",
  },
  space: {
    pad: "clamp(1.25rem, 5vw, 3.5rem)",
    maxw: "68rem",
    shellGap: "clamp(1.25rem, 2.5vw, 2rem)",
    sectionGap: "clamp(2.25rem, 5vw, 3.5rem)",
    measure: "34ch",
  },
  motion: {
    fast: "0.18s ease",
    reveal: "0.9s cubic-bezier(0.16, 1, 0.3, 1)",
    pulse: "2.4s ease-in-out",
  },
} as const;

export type Tokens = typeof tokens;

export default tokens;
