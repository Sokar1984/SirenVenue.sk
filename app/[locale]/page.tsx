import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorks } from "@/modules/content";
import { company, contact } from "@/content/legal";
import { enabledLocales, isLocale, localeLabel } from "@/modules/i18n";
import { geist } from "@/modules/tokens";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  // The index is a shell. If the content database is unreachable we render it
  // empty rather than failing the page or reaching for the seed file; see the
  // outage policy documented in `modules/content`.
  const works = await getWorks(locale).catch(() => []);

  return (
    <div className={`shell ${geist.variable}`}>
      <header className="head">
        <div className="mark">
          <span className="mark-name">SirenVenue</span>
          <span className="mark-legal">s.r.o.</span>
        </div>

        <nav className="locales" aria-label="Language">
          {enabledLocales.map((candidate) => {
            const active = candidate === locale;
            return (
              <Link
                key={candidate}
                href={`/${candidate}`}
                className={active ? "locale is-active" : "locale"}
                aria-current={active ? "true" : undefined}
              >
                {localeLabel(candidate)}
              </Link>
            );
          })}
        </nav>
      </header>

      <p className="colophon">
        Software &amp; systems for live, venue, and&nbsp;gallery.
      </p>

      <main>
        <section className="index" aria-label="Work">
          <div className="index-head">
            <span className="label">Work</span>
            <span className="label">{works.length} systems</span>
          </div>

          <ol className="rows">
            {works.map((work, i) => {
              const role = work.role.replace(/_/g, " ");
              const repeatsRole =
                work.descriptor !== null &&
                work.descriptor.replace(/_/g, " ").trim().toLowerCase() ===
                  role.trim().toLowerCase();
              return (
                <li className="row" key={work.slug}>
                  <a
                    className="row-link"
                    href={work.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="row-no">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="row-name">{work.name}</span>
                    <span className="row-meta">
                      <span className="row-role">{role}</span>
                      {work.descriptor && !repeatsRole ? (
                        <span className="row-descriptor">{work.descriptor}</span>
                      ) : null}
                    </span>
                    <span className="row-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
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
