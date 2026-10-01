import { works } from "@/content/works";
import { company, contact } from "@/content/legal";

/** Locale order is deliberate: SK first, Venezuelan Spanish kept as its own code. */
const LOCALES = ["SK", "EN", "DE", "ES", "VE", "HU", "CS", "UK", "RU"];
const ACTIVE_LOCALE = "SK";

export default function Home() {
  return (
    <div className="shell">
      <header className="head">
        <div className="mark">
          <span className="mark-name">SirenVenue</span>
          <span className="mark-legal">s.r.o.</span>
        </div>

        {/* Visual only for now — i18n routing lands with the locale batch. */}
        <nav className="locales" aria-label="Language">
          {LOCALES.map((locale) => (
            <span
              key={locale}
              className={locale === ACTIVE_LOCALE ? "locale is-active" : "locale"}
            >
              {locale}
            </span>
          ))}
        </nav>
      </header>

      <p className="colophon">Software &amp; systems for live, venue, and gallery.</p>

      <main>
        <section className="index" aria-label="Work">
          <div className="index-head">
            <span className="label">Work</span>
            <span className="label">{works.length} systems</span>
          </div>

          <ol className="rows">
            {works.map((work, i) => (
              <li className="row" key={work.name}>
                <a
                  className="row-link"
                  href={work.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="row-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="row-name">{work.name}</span>
                  <span className="row-role">{work.role}</span>
                  <span className="row-descriptor">{work.descriptor}</span>
                  <span className="row-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
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
