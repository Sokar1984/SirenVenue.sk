/**
 * The AI door's kill switch.
 *
 * `AI_DOOR_DISABLED` is read from the process environment on every request, so
 * the door can be shut off (or brought back) by changing a deployment variable
 * and letting the platform restart the functions — no code change, no redeploy.
 *
 * Enabled values, case-insensitively, are `1`, `true`, `yes`, and `on`. Anything
 * else — unset, empty, `0`, `false` — leaves the door open. The set is closed
 * rather than "any non-empty string" so a typo like `AI_DOOR_DISABLED=nope`
 * does not silently take the door down.
 */
export const AI_DOOR_DISABLED_ENV = "AI_DOOR_DISABLED";

const DISABLED_VALUES = new Set(["1", "true", "yes", "on"]);

export function isAiDoorDisabled(
  env: Readonly<Record<string, string | undefined>> = process.env,
): boolean {
  const raw = env[AI_DOOR_DISABLED_ENV];
  return typeof raw === "string" && DISABLED_VALUES.has(raw.trim().toLowerCase());
}
