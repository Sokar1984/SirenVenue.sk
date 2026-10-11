import type { Metadata } from "next";
import { headers } from "next/headers";
import { geist, serif } from "@/modules/tokens";
import "../globals.css";

/**
 * Admin document. Served at admin.sirenvenue.sk (middleware rewrites that host
 * onto /admin) and at /admin directly for local work. Its own document because
 * it sits outside the [locale] segment. Never indexed.
 */
export const metadata: Metadata = {
  title: "SirenVenue admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Reading the nonce keeps this route dynamic so the CSP nonce is fresh.
  await headers();
  return (
    <html lang="sk">
      <body>
        <div className={`admin ${geist.variable} ${serif.variable}`}>{children}</div>
      </body>
    </html>
  );
}
