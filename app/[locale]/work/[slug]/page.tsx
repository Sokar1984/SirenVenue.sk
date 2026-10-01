import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork, getWorks } from "@/modules/content";
import { company, contact } from "@/content/legal";
import { enabledLocales, isLocale, localeLabel } from "@/modules/i18n";
import { geist } from "@/modules/tokens";

/**
 * A case page exists only to hold what the index row cannot: the work's own
 * title, role, and descriptor, with the outbound link to the live system still
 * one click away. There are no stills yet, so nothing is drawn in their place.
 */
export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of enabledLocales) {
    const works = await getWorks(locale);
    for (const work of works) {
      params.push({ locale, slug: work.slug });
    }
  }
  return params;
}

export default async function Work({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const work = await getWork(locale, slug);
  if (!work) {
    notFound();
  }

  const role = work.role.replace(/_/g, " ");

  return (
    <div className={`shell ${geist.variable}`}>
      <a className="skip" href="#main">
        Skip to main content
      </a>

      <header className="head">
        <div className="mark">
          <Link className="mark-name" href={`/${locale}`}>
            SirenVenue
          </Link>
          <span className="mark-legal">s.r.o.</span>
        </div>

        <nav className="locales" aria-label="Language">
          {enabledLocales.map((candidate) => {
            const active = candidate === locale;
            return (
              <Link
                key={candidate}
                href={`/${candidate}/work/${work.slug}`}
                className={active ? "locale is-active" : "locale"}
                aria-current={active ? "page" : undefined}
              >
                {localeLabel(candidate)}
              </Link>
            );
          })}
        </nav>
      </header>

      <p className="colophon">{work.name}</p>

      <main id="main" tabIndex={-1}>
        <section aria-label={work.name}>
          <div className="index-head">
            <span className="label">{role}</span>
          </div>
          {work.descriptor ? <p className="note">{work.descriptor}</p> : null}
          <p className="note">
            <a href={work.href} target="_blank" rel="noreferrer">
              {work.href}
            </a>
          </p>
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
