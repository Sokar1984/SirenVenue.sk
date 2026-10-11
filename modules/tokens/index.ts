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
    muted: "#a8a299",
    dim: "#8a847b",
    line: "#2a2723",
    lift: "rgba(232, 228, 220, 0.04)",
    signal: "#e2553b",
  },
  font: {
    family: "var(--font-sans)",
    serif: "var(--font-serif)",
    lead: "clamp(2.75rem, 7.2vw, 6.25rem)",
    identity: "clamp(1.05rem, 1.45vw, 1.25rem)",
    entry: "clamp(1.9rem, 3.6vw, 3rem)",
    body: "16px",
    markName: "1rem",
    markLegal: "0.78rem",
    locales: "0.72rem",
    colophon: "clamp(1.75rem, 3.2vw, 2.5rem)",
    note: "0.9rem",
    label: "0.7rem",
    rowNo: "0.72rem",
    rowName: "clamp(1.5rem, 2.8vw, 2.25rem)",
    rowMeta: "0.8125rem",
    rowArrow: "0.8rem",
    foot: "0.82rem",
  },
  space: {
    pad: "clamp(1.25rem, 5vw, 3.5rem)",
    maxw: "68rem",
    shellGap: "clamp(1.5rem, 3.5vw, 3rem)",
    sectionGap: "clamp(4.5rem, 12vw, 9rem)",
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
