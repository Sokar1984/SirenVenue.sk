import { readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { getWork, getWorks } from "@/modules/content";
import { enabledLocales, isLocale } from "@/modules/i18n";
import { Chrome } from "../../layout";

/**
 * A case page exists only to hold what the index row cannot: the work's own
 * title, role, and descriptor, with the outbound link to the live system still
 * one click away. DOT. Gallery is the one work with an asset, so it is the one
 * page that draws a mark; the others stay text-only rather than inventing one.
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

  // Only DOT. Gallery has an asset. The file is inlined rather than served as
  // an <img>: its leading XML comment contains "--" (in "--fg"), which is
  // illegal in XML, so every conformant SVG parser rejects it as an image —
  // but the HTML parser tolerates it inlined, and the artwork is unchanged.
  // The mark is decorative: the colophon directly beneath it already names the
  // work, so announcing it would repeat "DOT." to assistive tech.
  const hasMark = work.slug === "dot-gallery";
  const mark = hasMark
    ? readFileSync(
        join(process.cwd(), "public/brand/dot-gallery.svg"),
        "utf8",
      )
    : null;

  // `work.name` is a product brand, identical in every locale, so it is the
  // colophon and the section's accessible name, not a catalog entry.
  return (
    <Chrome locale={locale} path={`/work/${work.slug}`}>
      {mark ? (
        <span
          className="work-mark"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: mark }}
        />
      ) : null}

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
