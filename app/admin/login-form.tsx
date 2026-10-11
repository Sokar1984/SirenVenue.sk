"use client";

import { useState } from "react";

type State = "idle" | "busy" | "ok" | "error";

/** Posts to the existing /api/v1/admin/login. Nothing else. */
export function LoginForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    setState("busy");
    setError(null);
    try {
      const response = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setState("ok");
        return;
      }
      const body = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      setError(body?.error?.message ?? `Prihlásenie zlyhalo (${response.status}).`);
      setState("error");
    } catch {
      setError("Server nie je dostupný.");
      setState("error");
    }
  }

  if (state === "ok") {
    return <p className="admin-status">Prihlásený.</p>;
  }

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <label className="label" htmlFor="admin-password">
        Heslo
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="admin-input"
      />
      <button type="submit" className="admin-button" disabled={state === "busy"}>
        {state === "busy" ? "…" : "Prihlásiť"}
      </button>
      {error ? (
        <p className="admin-status" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
