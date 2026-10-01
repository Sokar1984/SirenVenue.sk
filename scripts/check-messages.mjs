#!/usr/bin/env node
/**
 * Completeness gate for the message catalog.
 *
 * Dependency-free and CI-runnable: it imports the authored catalog directly, so
 * it needs no database, no build step, and no i18n library.
 *
 * Rules
 * -----
 *   1. `sk` is the primary locale. Every key must be present in `sk`.
 *   2. For every other locale, a key must either be translated or explicitly
 *      declared in `declaredMissing`. A silently absent key is a failure.
 *   3. A declaration that points at a key which is actually present is stale
 *      and also fails, so the catalog and its omissions cannot drift apart.
 *
 * `declaredMissing` is not a loophole: it is the written admission that a
 * surface must render nothing for that locale, because English is never an
 * acceptable fallback.
 *
 * Exits non-zero when any key is neither translated nor declared.
 */
import {
  messageKeys,
  messageLocales,
  catalog,
  declaredMissing,
} from "../modules/i18n/messages.ts";

const PRIMARY = "sk";
const locales = messageLocales;

const TRANSLATED = "translated";
const DECLARED = "declared";
const MISSING = "missing";

const declared = new Set(
  declaredMissing.map((entry) => `${entry.locale}\u0000${entry.key}`),
);

const failures = [];

function fail(message) {
  failures.push(message);
}

/** Classify one (locale, key) cell. */
function statusOf(locale, key) {
  const value = catalog[locale]?.[key];
  if (typeof value === "string" && value.length > 0) return TRANSLATED;
  if (declared.has(`${locale}\u0000${key}`)) return DECLARED;
  return MISSING;
}

// 3. Declarations must point at real keys and must not shadow a real value.
for (const entry of declaredMissing) {
  if (!locales.includes(entry.locale)) {
    fail(`declaredMissing references unknown locale "${entry.locale}"`);
    continue;
  }
  if (!messageKeys.includes(entry.key)) {
    fail(`declaredMissing references unknown key "${entry.key}"`);
    continue;
  }
  if (statusOf(entry.locale, entry.key) === TRANSLATED) {
    fail(
      `"${entry.key}" is declared missing for "${entry.locale}" but is present`,
    );
  }
}

// 1 + 2. Walk the matrix.
const rows = [];
for (const key of messageKeys) {
  const cells = locales.map((locale) => {
    const status = statusOf(locale, key);

    if (locale === PRIMARY) {
      // The primary can never be missing, and a declaration here does not help.
      if (status !== TRANSLATED) {
        fail(`primary locale "${PRIMARY}" is missing key "${key}"`);
      }
      return status === TRANSLATED ? TRANSLATED : MISSING;
    }

    if (status === MISSING) {
      fail(`"${key}" is missing for "${locale}" and is not declared`);
    }
    return status;
  });
  rows.push({ key, cells });
}

const covered = {};
const declaredCount = {};
const missingCount = {};
for (const locale of locales) {
  covered[locale] = 0;
  declaredCount[locale] = 0;
  missingCount[locale] = 0;
}
for (const { cells } of rows) {
  locales.forEach((locale, i) => {
    if (cells[i] === TRANSLATED) covered[locale] += 1;
    else if (cells[i] === DECLARED) declaredCount[locale] += 1;
    else missingCount[locale] += 1;
  });
}

function pad(text, width) {
  return String(text).padEnd(width, " ");
}

const mark = { [TRANSLATED]: "\u2713", [DECLARED]: "\u00b7", [MISSING]: "\u2717" };
const keyWidth = Math.max(4, ...messageKeys.map((key) => key.length));
const localeWidths = locales.map((locale) => Math.max(locale.length, 1));

console.log("message catalog \u2014 completeness gate");
console.log(
  `${messageKeys.length} keys \u00d7 ${locales.length} locales (primary: ${PRIMARY})\n`,
);
console.log(
  `${pad("key", keyWidth)}  ${locales
    .map((locale, i) => pad(locale, localeWidths[i]))
    .join("  ")}`,
);
for (const { key, cells } of rows) {
  console.log(
    `${pad(key, keyWidth)}  ${cells
      .map((status, i) => pad(mark[status], localeWidths[i]))
      .join("  ")}`,
  );
}
console.log("");
console.log(
  `${pad("coverage", keyWidth)}  ${locales
    .map((locale, i) => pad(`${covered[locale]}/${messageKeys.length}`, localeWidths[i]))
    .join("  ")}`,
);
console.log("");
console.log("legend  \u2713 translated   \u00b7 declared missing   \u2717 MISSING");

for (const locale of locales) {
  console.log(
    `${pad(locale, 6)} ${pad(`${covered[locale]}/${messageKeys.length}`, 6)} translated  ` +
      `${pad(`${declaredCount[locale]}`, 2)} declared  ${missingCount[locale]} missing`,
  );
}

if (declaredMissing.length > 0) {
  console.log("");
  for (const entry of declaredMissing) {
    console.log(`declared missing: ${entry.locale} / ${entry.key}`);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} completeness failure(s):`);
  for (const message of failures) {
    console.error(`  - ${message}`);
  }
  process.exit(1);
}

console.log("\nAll keys translated or declared missing. Gate passed.");
