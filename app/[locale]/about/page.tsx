import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, message } from "@/modules/i18n";
import { pageMetadata } from "@/modules/seo";
import { Chrome } from "../layout";
import { LegalFacts } from "../legal-facts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, {
    path: "/about",
    title: message(locale, "about.title"),
    description: message(locale, "about.description"),
  });
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const h1 = message(locale, "about.h1");
  const paragraphs = (["about.p1", "about.p2", "about.p3"] as const)
    .map((key) => message(locale, key))
    .filter((text): text is string => Boolean(text));
  const company = message(locale, "about.company");

  return (
    <Chrome locale={locale} path="/about">
      <main id="main" tabIndex={-1} className="page">
        <article className="prose">
          {h1 ? <h1 className="page-title">{h1}</h1> : null}
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </article>
        <section className="page-aside" aria-labelledby="company-label">
          {company ? (
            <h2 id="company-label" className="label">
              {company}
            </h2>
          ) : null}
          <LegalFacts locale={locale} />
        </section>
      </main>
    </Chrome>
  );
}
