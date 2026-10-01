import Link from "next/link";
import { company, contact } from "@/content/legal";

/**
 * A stranger can arrive here from a stale footer link on a product that ships
 * faster than this site. The page must still say what the company is and how to
 * reach it — a default framework 404 would undo the impression the rest of the
 * visit builds.
 */
export default function NotFound() {
  return (
    <div className="shell">
      <header className="head">
        <div className="mark">
          <span className="mark-name">SirenVenue</span>
          <span className="mark-legal">s.r.o.</span>
        </div>
      </header>

      <p className="colophon">Nothing at this address.</p>

      <main>
        <p className="note">
          The link is out of date, or it was never ours. Every product we ship
          links back to{" "}
          <Link href="/">sirenvenue.sk</Link> — this is that page.
        </p>
      </main>

      <footer className="foot">
        <div className="strip">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <span>{contact.city}</span>
        </div>
        <div className="strip legal">
          <span>{company.name}</span>
          <span>{company.seat}</span>
          <span>IČO {company.ico}</span>
        </div>
      </footer>
    </div>
  );
}
