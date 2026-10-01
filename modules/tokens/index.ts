/**
 * Public entry for the tokens module.
 *
 * Mirrors modules/tokens/tokens.css so TypeScript code can reason about the
 * same values the browser consumes. This is the only file other modules may
 * import from.
 */
/** Re-exported so the family is declared once, in modules/tokens/font.ts. */
export { geist } from "./font";

export const tokens = {
  color: {
    bg: "#08080a",
    fg: "#f4f4f5",
    muted: "#9898a0",
    dim: "#7a7a82",
    line: "#232329",
    lift: "rgba(255, 255, 255, 0.035)",
  },
  font: {
    family: "var(--font-sans)",
    body: "16px",
    markName: "1rem",
    markLegal: "0.78rem",
    locales: "0.72rem",
    colophon: "clamp(1.75rem, 3.2vw, 2.5rem)",
    note: "0.9rem",
    label: "0.7rem",
    rowNo: "0.72rem",
    rowName: "clamp(1.25rem, 2vw, 1.6rem)",
    rowRole: "0.84rem",
    rowDescriptor: "0.7rem",
    rowArrow: "0.8rem",
    foot: "0.82rem",
    rowRoleNarrow: "0.78rem",
  },
  space: {
    pad: "clamp(1.25rem, 5vw, 3.5rem)",
    maxw: "68rem",
    shellGap: "clamp(1.5rem, 3.5vw, 3rem)",
  },
  motion: {
    fast: "0.18s ease",
  },
} as const;

export type Tokens = typeof tokens;

export default tokens;
