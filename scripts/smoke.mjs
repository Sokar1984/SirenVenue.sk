#!/usr/bin/env node
/**
 * Home-page smoke test.
 *
 * Builds the app, starts the production server on a free port, and asserts the
 * things a plaque cannot get wrong: the bare root redirects to a locale, both
 * served locales render, the work names (from seed) and the company's IČO are on the
 * page, and every locale-switcher entry leads somewhere valid.
 *
 * Dependency-free: Node's global `fetch` and the built `next start` are enough.
 * The expected names and legal facts come from the authored source
 * (`content/works.ts`, `content/legal.ts`) and the locale list from the i18n
 * module, so the smoke test fails when the shipped page drifts from the
 * declared content rather than carrying its own copy.
 *
 * The server is torn down on success, on failure, and on SIGINT/SIGTERM.
 */
import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import { fileURLToPath } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

import { works } from "../content/works.ts";
import { company } from "../content/legal.ts";
import { locales } from "../modules/i18n/locales.ts";

const root = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");

let server = null;
let serverLog = "";

function getFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function stopServer() {
  const child = server;
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGTERM");
  const force = setTimeout(() => {
    try {
      child.kill("SIGKILL");
    } catch {
      // already gone
    }
  }, 5000);
  await exited;
  clearTimeout(force);
  server = null;
}

async function waitForServer(base, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${base}/sk`, { redirect: "manual" });
      if (response.status >= 200) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`server did not become ready: ${lastError?.message ?? "timeout"}`);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopServer().finally(() =>
      process.exit(signal === "SIGINT" ? 130 : 143),
    );
  });
}

let failures = 0;
function assert(name, condition, detail) {
  if (condition) {
    console.log(`PASS  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}${detail ? `: ${detail}` : ""}`);
  }
}

async function main() {
  if (process.env.SMOKE_SKIP_BUILD === "1") {
    console.log("SMOKE_SKIP_BUILD=1 \u2014 reusing the existing .next build");
  } else {
    console.log("building\u2026");
    const build = spawnSync("npm", ["run", "build"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    if (build.status !== 0) {
      throw new Error(`build failed with exit code ${build.status}`);
    }
  }

  const port = await getFreePort();
  const base = `http://127.0.0.1:${port}`;
  console.log(`starting next start on ${base}\n`);

  const nextBin = resolvePath(root, "node_modules/next/dist/bin/next");
  server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: process.env,
  });
  server.stdout.on("data", (chunk) => {
    serverLog += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverLog += chunk.toString();
  });

  await waitForServer(base);

  const rootRedirect = await fetch(`${base}/`, { redirect: "manual" });
  const location = rootRedirect.headers.get("location") ?? "";
  let localeTarget = null;
  try {
    localeTarget = new URL(location, base).pathname.replace(/^\//, "");
  } catch {
    localeTarget = null;
  }
  assert(
    "/ redirects with 308",
    rootRedirect.status === 308,
    `status ${rootRedirect.status}`,
  );
  assert(
    "/ 308s to a locale",
    localeTarget !== null && locales.includes(localeTarget),
    `Location ${location || "(none)"}`,
  );

  const skResponse = await fetch(`${base}/sk`, { redirect: "manual" });
  assert("/sk returns 200", skResponse.status === 200, `status ${skResponse.status}`);
  const enResponse = await fetch(`${base}/en`, { redirect: "manual" });
  assert("/en returns 200", enResponse.status === 200, `status ${enResponse.status}`);
  const skBody = await skResponse.text();

  for (const work of works) {
    assert(
      `home page contains work name "${work.name}"`,
      skBody.includes(work.name),
      "not found",
    );
  }

  assert(
    `legal footer contains IČO ${company.ico}`,
    skBody.includes(company.ico),
    "not found",
  );

  for (const locale of locales) {
    const response = await fetch(`${base}/${locale}`, { redirect: "manual" });
    if (response.status === 200) {
      assert(`locale switcher /${locale} returns 200`, true);
      continue;
    }
    if (response.status >= 300 && response.status < 400) {
      const target = response.headers.get("location");
      if (target) {
        const followed = await fetch(new URL(target, base), { redirect: "manual" });
        assert(
          `locale switcher /${locale} redirects to a valid page`,
          followed.status === 200,
          `${response.status} -> ${target} (${followed.status})`,
        );
        continue;
      }
    }
    assert(
      `locale switcher /${locale} returns 200 or a valid redirect`,
      false,
      `status ${response.status}`,
    );
  }
}

try {
  await main();
} catch (error) {
  failures += 1;
  console.error(`\nsmoke run error: ${error?.message ?? error}`);
  if (serverLog) console.error(`\n--- server output ---\n${serverLog}`);
} finally {
  await stopServer();
}

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed.`);
  process.exit(1);
}

console.log("\nHome page smoke test passed.");
process.exit(0);
