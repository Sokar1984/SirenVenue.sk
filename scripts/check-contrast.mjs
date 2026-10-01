#!/usr/bin/env node
/**
 * Dependency-free guard against contrast drift.
 *
 * Reads the palette straight from modules/tokens/tokens.css (the single source
 * of truth) and asserts, using WCAG 2.1 relative luminance, that every text
 * colour reaches 4.5:1 against --bg. Prints the measured ratios and exits
 * non-zero on failure.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const REQUIRED = 4.5;
const TEXT_TOKENS = ["fg", "muted", "dim"];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(resolve(root, "modules/tokens/tokens.css"), "utf8");

function readToken(name) {
  const match = css.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  if (!match) {
    throw new Error(`token --${name} not found in modules/tokens/tokens.css`);
  }
  return match[1].trim();
}

function parseColor(value) {
  const hex = value.match(/^#([0-9a-fA-F]{6})$/);
  if (!hex) {
    throw new Error(`only 6-digit hex colours are supported, got "${value}"`);
  }
  const n = Number.parseInt(hex[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function relativeLuminance([r, g, b]) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (hi + 0.05) / (lo + 0.05);
}

const bg = parseColor(readToken("bg"));
let failed = false;

for (const name of TEXT_TOKENS) {
  const ratio = contrastRatio(parseColor(readToken(name)), bg);
  const pass = ratio >= REQUIRED;
  if (!pass) failed = true;
  console.log(
    `--${name} ${ratio.toFixed(2)}:1 against --bg (min ${REQUIRED}:1) ${
      pass ? "PASS" : "FAIL"
    }`,
  );
}

if (failed) {
  console.error("Contrast check failed.");
  process.exit(1);
}
