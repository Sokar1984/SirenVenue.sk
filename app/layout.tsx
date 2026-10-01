import type { ReactNode } from "react";

/**
 * Outer root boundary.
 *
 * The document itself (`<html lang>` / `<body>`) is owned by
 * `app/[locale]/layout.tsx`, so the `lang` attribute can come from the locale
 * segment. Next.js still requires a layout at the app root for routes that sit
 * outside `[locale]` (the not-found boundary), so this forwards children.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
