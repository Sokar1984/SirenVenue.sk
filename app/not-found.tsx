import type { Metadata } from "next";
import { defaultLocale, message } from "@/modules/i18n";
import { pageMetadata } from "@/modules/seo";
import { Chrome } from "./[locale]/layout";
import { NotFoundNote } from "./[locale]/not-found";
import "./globals.css";

/**
 * The document a stranger lands on when a footer link has gone stale.
 *
 * A path that matches no route never reaches `app/[locale]/layout.tsx`: the
 * locale layout owns the document, but this boundary sits outside it. The root
 * layout is a pass-through with no `<html>`/`<body>`, so this file must be a
 * complete document in its own right — its own `<html lang>`, `<title>`,
 * description, and the legal footer.
 *
 * FAIL-OFF, named: an unmatched path carries no locale, and an invalid locale
 * makes the locale layout call `notFound()` before it can render its document.
 * Neither can be rendered inside the locale layout, so this root document is the
 * best complete document achievable there. For a valid locale with a missing
 * child the document is served in the first-byte HTML; for an invalid locale
 * Next delivers the same tree through its error-path RSC stream.
 *
 * A `notFound()` thrown inside a valid locale is caught by
 * `app/[locale]/not-found.tsx`, which renders the same copy inside the locale's
 * own document.
 */

export const metadata: Metadata = pageMetadata(defaultLocale);

export default function NotFound() {
  const lead = message(defaultLocale, "notFound.lead");

  return (
    <html lang={defaultLocale}>
      <body>
        <Chrome locale={defaultLocale} path="">
          {lead ? <p className="colophon">{lead}</p> : null}

          <main id="main" tabIndex={-1}>
            <NotFoundNote locale={defaultLocale} />
          </main>
        </Chrome>
      </body>
    </html>
  );
}
