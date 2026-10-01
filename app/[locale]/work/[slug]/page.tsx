import { notFound } from "next/navigation";
import { getWork, getWorks } from "@/modules/content";
import { enabledLocales, isLocale } from "@/modules/i18n";
import { Chrome } from "../../layout";

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

  // `work.name` is a product brand, identical in every locale, so it is the
  // colophon and the section's accessible name, not a catalog entry.
  return (
    <Chrome locale={locale} path={`/work/${work.slug}`}>
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
    </Chrome>
  );
}
