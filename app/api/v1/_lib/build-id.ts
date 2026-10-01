/**
 * Resolves the running build's id for `/api/v1/health`.
 *
 * Next exposes the build id server-side as `process.env.__NEXT_BUILD_ID`. When
 * that is unavailable (e.g. a bare `next start` where the variable was not
 * injected) we fall back to the `BUILD_ID` file Next writes into `.next`. If
 * neither exists we report `unknown` rather than inventing a value.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export function getBuildId(): string {
  const injected = process.env.NEXT_BUILD_ID ?? process.env.__NEXT_BUILD_ID;
  if (injected) return injected;

  try {
    return readFileSync(join(process.cwd(), ".next", "BUILD_ID"), "utf8").trim();
  } catch {
    return "unknown";
  }
}
