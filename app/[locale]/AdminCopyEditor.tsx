"use client";

import { useEffect, useState } from "react";

type CopyField = "identity" | "client" | "blink";

type Props = {
  locale: string;
  initialIdentity?: string | null;
  initialClient?: string | null;
  initialBlink?: string | null;
};

export function AdminCopyEditor({
  locale,
  initialIdentity = "",
  initialClient = "",
  initialBlink = "",
}: Props) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState<CopyField | null>(null);
  const [editing, setEditing] = useState<CopyField | null>(null);
  const [values, setValues] = useState<Record<CopyField, string>>({
    identity: initialIdentity || "",
    client: initialClient || "",
    blink: initialBlink || "",
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/admin/me", { cache: "no-store" })
      .then(async (r) => {
        if (cancelled) return;
        if (r.ok) {
          setAuthed(true);
        }
        setChecking(false);
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!pw) {
      setMsg("Password required.");
      return;
    }
    const res = await fetch("/api/v1/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setAuthed(true);
      setPw("");
      setMsg(null);
    } else {
      const data = await res.json().catch(() => ({} as any));
      setMsg(data?.error?.message || "Login failed.");
    }
  }

  async function doLogout() {
    setMsg(null);
    await fetch("/api/v1/admin/logout", { method: "POST" }).catch(() => {});
    setAuthed(false);
    setEditing(null);
  }

  function startEdit(f: CopyField) {
    setEditing(f);
    setMsg(null);
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function doSave(f: CopyField) {
    const val = values[f];
    setSaving(f);
    setMsg(null);
    const body: Record<string, unknown> = { locale, [f]: val };
    const res = await fetch("/api/v1/admin/copy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(null);
    if (res.ok) {
      setEditing(null);
    } else {
      const data = await res.json().catch(() => ({} as any));
      setMsg(data?.error?.message || "Save failed.");
    }
  }

  function updateVal(f: CopyField, v: string) {
    setValues((prev) => ({ ...prev, [f]: v }));
  }

  if (checking) {
    return null;
  }

  const fieldLabel: Record<CopyField, string> = {
    identity: "identity",
    client: "client",
    blink: "blink",
  };

  return (
    <div style={{ fontSize: "var(--fs-note)", color: "var(--dim)" }}>
      {!authed ? (
        <form
          onSubmit={doLogin}
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="password"
            style={{
              font: "inherit",
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--line)",
              padding: "0.2rem 0.4rem",
              maxWidth: "12ch",
            }}
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="lang-trigger"
            style={{ fontSize: "var(--fs-locales)", padding: "0.2rem 0.5rem" }}
          >
            enter
          </button>
          {msg && <span style={{ color: "var(--muted)" }}>{msg}</span>}
        </form>
      ) : (
        <>
          {(["identity", "client", "blink"] as CopyField[]).map((f) => (
            <div
              key={f}
              style={{
                margin: "0.25rem 0",
                display: "flex",
                gap: "0.5rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  width: "4.5em",
                  flex: "none",
                  fontSize: "0.75em",
                  paddingTop: "0.15rem",
                }}
              >
                {fieldLabel[f]}
              </span>
              {editing === f ? (
                <div style={{ flex: 1 }}>
                  <textarea
                    value={values[f]}
                    onChange={(e) => updateVal(f, e.target.value)}
                    rows={f === "client" ? 2 : 3}
                    style={{
                      font: "inherit",
                      color: "var(--fg)",
                      background: "transparent",
                      border: "1px solid var(--line)",
                      padding: "0.25rem",
                      width: "100%",
                      maxWidth: "46ch",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      marginTop: "0.25rem",
                      display: "inline-flex",
                      gap: "0.35rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => doSave(f)}
                      disabled={!!saving}
                      className="lang-trigger"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {saving === f ? "..." : "save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={!!saving}
                      style={{
                        font: "inherit",
                        fontSize: "0.7rem",
                        background: "transparent",
                        color: "var(--muted)",
                        border: "1px solid var(--line)",
                        padding: "0.1rem 0.3rem",
                        cursor: "pointer",
                      }}
                    >
                      cancel
                    </button>
                  </div>
                </div>
              ) : (
                <span
                  onClick={() => startEdit(f)}
                  style={{
                    flex: 1,
                    cursor: "pointer",
                    color: values[f] ? "var(--muted)" : "var(--dim)",
                  }}
                  title="click to edit"
                >
                  {values[f] ? values[f] : <em style={{ opacity: 0.6 }}>empty</em>}{" "}
                  <small style={{ color: "var(--dim)" }}>edit</small>
                </span>
              )}
            </div>
          ))}
          <div style={{ marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={doLogout}
              className="lang-trigger"
              style={{ fontSize: "0.7rem" }}
            >
              logout
            </button>
            {msg && (
              <span
                style={{
                  marginLeft: "0.5rem",
                  color: "var(--muted)",
                  fontSize: "0.75rem",
                }}
              >
                {msg}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
