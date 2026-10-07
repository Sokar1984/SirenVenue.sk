#!/usr/bin/env node
/**
 * Link-integrity check for the plaque.
 *
 * The works on this page are other teams' apps. (SirenVenue.com tile and
 * warehouse framing dropped per SOK-350; see content/works.ts.) A tile that
 * points at a dead URL is the loudest possible failure here, so this check
 * reads every published work's `href` through the content module (never a raw
 * query), adds the contact email and the footer links, probes each over the
 * network, and prints the final resolved URL and status.
 *
 * Dependency-free: Node's global `fetch` does the HTTP and the only imports are
 * built-ins. The content module is reached through its public entry, exactly
 * like the surface does — no parallel copy of the query lives here.
 *
 * Notes
 * -----
 *   - Redirects are followed by hand so the final status, the final URL, and
 *     every hop are visible.
 *   - A redirect that lands on a different host is *reported*, never silently
 *     accepted: an apex -> www move is still news about our own product.
 *   - 404 and 5xx responses (and any other 4xx, and network errors) fail the
 *     check and set a non-zero exit code.
 *
 * Why the resolve hook
 * --------------------
 * `modules/content/index.ts` uses extensionless relative imports (`./db`,
 * `../i18n`) and the extensionless `next/cache` subpath. Those resolve under
 * Next's bundler and under tsx, but not under Node's ESM resolver, which
 * requires explicit extensions and package `exports`. Rather than bypass the
 * module with a hand-written Prisma query, this script registers a tiny,
 * dependency-free resolver that teaches Node those two things and then imports
 * the real public entry.
 */
import module from "node:module";
import { loadEnvFile } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

const root = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

/** Teach Node the extensionless resolution Next and tsx provide. */
module.registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const attempts = [];
      if (specifier.startsWith(".")) {
        attempts.push(
          specifier + ".ts",
          specifier + ".tsx",
          specifier + "/index.ts",
          specifier + "/index.tsx",
        );
      }
      attempts.push(specifier + ".js");
      for (const attempt of attempts) {
        try {
          return nextResolve(attempt, context);
        } catch {
          // try the next candidate
        }
      }
      throw error;
    }
  },
});

try {
  loadEnvFile(resolvePath(root, ".env.local"));
} catch {
  // CI and Vercel supply the environment; a missing local file is not an error.
}

const REQUEST_TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 10;

function withTimeout() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return { controller, done: () => clearTimeout(timer) };
}

/** Probe one HTTP URL, following redirects by hand and recording every hop. */
async function probeHttp(startUrl) {
  const hops = [];
  let current = startUrl;
  const originalHost = new URL(startUrl).host;
  let crossHost = false;

  try {
    for (let i = 0; i <= MAX_REDIRECTS; i += 1) {
      const { controller, done } = withTimeout();
      let response;
      try {
        response = await fetch(current, {
          redirect: "manual",
          signal: controller.signal,
          headers: { "user-agent": "sirenvenue-link-check/1.0" },
        });
      } finally {
        done();
      }

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) {
          return {
            finalUrl: current,
            status: response.status,
            hops,
            crossHost,
            ok: false,
            error: "redirect without a Location header",
          };
        }
        const next = new URL(location, current).toString();
        hops.push({ from: current, status: response.status, to: next });
        if (new URL(next).host !== originalHost) crossHost = true;
        if (next === current) {
          return {
            finalUrl: current,
            status: response.status,
            hops,
            crossHost,
            ok: false,
            error: "redirect loop",
          };
        }
        current = next;
        continue;
      }

      if (response.body) {
        try {
          await response.body.cancel();
        } catch {
          // body already consumed or unavailable
        }
      }

      return {
        finalUrl: current,
        status: response.status,
        hops,
        crossHost,
        ok: response.status >= 200 && response.status < 300,
        error: null,
      };
    }

    return {
      finalUrl: current,
      status: null,
      hops,
      crossHost,
      ok: false,
      error: `more than ${MAX_REDIRECTS} redirects`,
    };
  } catch (error) {
    return {
      finalUrl: current,
      status: null,
      hops,
      crossHost,
      ok: false,
      error: error?.name === "AbortError" ? "timed out" : error?.message ?? "fetch failed",
    };
  }
}

/** A `mailto:` link cannot be fetched; validate the address and move on. */
function probeMailto(url) {
  const address = url.slice("mailto:".length).split("?")[0];
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
  return {
    finalUrl: url,
    status: null,
    hops: [],
    crossHost: false,
    ok: valid,
    error: valid ? null : "not a valid email address",
  };
}

async function collectLinks() {
  const entry = pathToFileURL(
    resolvePath(root, "modules/content/index.ts"),
  ).href;
  const { getWorks, getLegal } = await import(entry);

  const works = await getWorks("sk");
  const legal = await getLegal();

  const links = works.map((work) => ({
    label: `work: ${work.name}`,
    url: work.href,
  }));

  // The footer's only link is the contact email; the legal facts are text.
  links.push({ label: "contact email", url: `mailto:${legal.contact.email}` });

  return links;
}

function pad(text, width) {
  return String(text).padEnd(width, " ");
}

function renderTable(rows) {
  const headers = ["LINK", "URL", "STATUS", "FINAL URL", "NOTE"];
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => String(row[i]).length)),
  );

  const lines = [];
  lines.push(headers.map((h, i) => pad(h, widths[i])).join("  "));
  lines.push(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of rows) {
    lines.push(row.map((cell, i) => pad(cell, widths[i])).join("  "));
  }
  return lines.join("\n");
}

try {
  const links = await collectLinks();
  const results = [];

  for (const link of links) {
    const result = link.url.startsWith("mailto:")
      ? probeMailto(link.url)
      : await probeHttp(link.url);
    results.push({ ...link, ...result });
  }

  console.log("link integrity \u2014 external surfaces on the plaque\n");

  const rows = results.map((result) => {
    const status =
      result.status === null
        ? result.url.startsWith("mailto:")
          ? "mailto"
          : "ERR"
        : String(result.status);

    const notes = [];
    if (result.status !== null && result.status >= 400) {
      notes.push(`HTTP ${result.status}`);
    }
    if (result.error) notes.push(result.error);
    if (result.hops.length > 0) {
      notes.push(`${result.hops.length} redirect(s)`);
    }
    if (result.crossHost) {
      const from = new URL(result.url).host;
      const to = new URL(result.finalUrl).host;
      notes.push(`HOST CHANGE ${from} -> ${to}`);
    }

    return [
      result.label,
      result.url,
      status,
      result.finalUrl,
      notes.join("; ") || "ok",
    ];
  });

  console.log(renderTable(rows));

  const crossHost = results.filter((result) => result.crossHost);
  if (crossHost.length > 0) {
    console.log("\nHost changes (reported, not an error):");
    for (const result of crossHost) {
      for (const hop of result.hops) {
        if (new URL(hop.to).host !== new URL(hop.from).host) {
          console.log(
            `  ${result.label}: ${hop.from} -> ${hop.to} (${hop.status})`,
          );
        }
      }
    }
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} broken link(s):`);
    for (const result of failed) {
      console.error(
        `  - ${result.label} (${result.url}): ${
          result.error ?? `status ${result.status}`
        }`,
      );
    }
    process.exit(1);
  }

  console.log(`\nAll ${results.length} link(s) resolved.`);
} catch (error) {
  console.error(`link check could not run: ${error?.message ?? error}`);
  process.exit(1);
}
