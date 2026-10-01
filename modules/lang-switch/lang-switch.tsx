"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { enabledLocales, localeLabel, message, type Locale } from "@/modules/i18n";
import { Flag } from "./flags";

/**
 * The one locale switcher — a trigger showing the current locale's drawn flag
 * and label, opening a keyboard-navigable list of every enabled locale.
 *
 * SOK-259 deliberately reverses two constraints from SOK-239: the flat row of
 * nine codes is replaced by a dropdown, and the trigger carries a flag. The
 * flag ban was on *emoji* (and image files); these flags are drawn inline SVG,
 * authored in `./flags`, so the constraint is honoured, not forgotten.
 *
 * Persistence is unchanged: the pick is written to the same `locale` cookie the
 * root redirect (`middleware.ts`) already honours — no second store, no API
 * call. Navigation lands on the same `path` in the chosen locale.
 */

/** Matches the cookie the root redirect reads in `middleware.ts`. */
const LOCALE_COOKIE = "locale";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Records the visitor's pick so `/` sends them here next time. */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

type LangSwitchProps = {
  /** The locale the current document is rendered in. */
  locale: Locale;
  /**
   * Path after the locale segment, e.g. `""` for the index or
   * `"/work/sirenvenue-com"` for a case page. Each entry opens the same path in
   * the target locale.
   */
  path?: string;
  /**
   * Optional accessible label for the control, already resolved by the caller
   * (the chrome passes `nav.language`). Falls back to the catalog value for
   * `locale` so a caller that omits it still names the control correctly.
   * Additive prop: `locale` and `path` are unchanged.
   */
  label?: string;
};

export function LangSwitch({ locale, path = "", label }: LangSwitchProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, enabledLocales.indexOf(locale)),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const controlLabel = label ?? message(locale, "nav.language");

  function openList() {
    setActiveIndex(Math.max(0, enabledLocales.indexOf(locale)));
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function choose(next: Locale) {
    if (next === locale) {
      closeList();
      return;
    }
    remember(next);
    setOpen(false);
    triggerRef.current?.focus();
    window.location.assign(`/${next}${path}`);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeList();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // `closeList` only touches refs and state setters, so it is stable enough
    // for the open lifetime; re-subscribing on every render would churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();
    }
  }

  function onListKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const count = enabledLocales.length;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + delta + count) % count);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(count - 1);
      return;
    }
    if (event.key === "Tab") {
      // Let focus leave naturally, but do not leave a stranded open list.
      setOpen(false);
    }
  }

  return (
    <div className="lang-switch" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          controlLabel ? `${controlLabel}: ${localeLabel(locale)}` : undefined
        }
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={onTriggerKeyDown}
      >
        <Flag code={locale} />
        <span className="lang-code">{localeLabel(locale)}</span>
        <svg
          className={open ? "lang-chevron is-open" : "lang-chevron"}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={controlLabel ?? undefined}
          className="lang-list"
          onKeyDown={onListKeyDown}
        >
          {enabledLocales.map((code, index) => {
            const selected = code === locale;
            return (
              <button
                key={code}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={index === activeIndex ? 0 : -1}
                className="lang-option"
                onClick={() => choose(code)}
              >
                <Flag code={code} />
                <span className="lang-code">{localeLabel(code)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
