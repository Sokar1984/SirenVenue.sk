import { notFound } from "next/navigation";
import { getWorks } from "@/modules/content";
import { isLocale, message } from "@/modules/i18n";
import { Chrome } from "./layout";

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

  // Every chrome string comes from the catalog. A `null` result — an absent or
  // declared-missing key — omits the element; English is never rendered in its
  // place. Product names (`SirenVenue.com`, `BlinkLive`, `DOT. Gallery`) are
  // brands and are not catalog entries.
  const colophon = message(locale, "colophon");
  const workLabel = message(locale, "work.label");
  const workCount = message(locale, "work.count", { count: works.length });
  const workAria = message(locale, "work.aria");

  return (
    <Chrome locale={locale} path="" home>
      {colophon ? <p className="colophon">{colophon}</p> : null}

      <main id="main" tabIndex={-1}>
        <section className="index" aria-label={workAria ?? undefined}>
          <div className="index-head">
            {workLabel ? <span className="label">{workLabel}</span> : null}
            {workCount ? <span className="label">{workCount}</span> : null}
          </div>

          <ol className="rows" role="list">
            {works.map((work, i) => {
              const role = work.role.replace(/_/g, " ");
              const descriptor = work.descriptor?.replace(/_/g, " ") ?? null;
              // The descriptor repeats the role when it contains it (after a
              // case-insensitive trim), not only when the two are identical:
              // "Live venue product" carries "product". Containment is the
              // repeat; an unrelated descriptor keeps its role.
              const repeatsRole =
                descriptor !== null &&
                descriptor
                  .trim()
                  .toLowerCase()
                  .includes(role.trim().toLowerCase());
              return (
                <li className="row" key={work.slug} role="listitem">
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
                      {repeatsRole ? null : (
                        <span className="row-role">{role}</span>
                      )}
                      {work.descriptor ? (
                        <span className="row-descriptor">
                          {work.descriptor}
                        </span>
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
    </Chrome>
  );
}
