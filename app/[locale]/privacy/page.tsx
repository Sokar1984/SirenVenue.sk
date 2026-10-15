/**
 * Privacy notice.
 *
 * DRAFT FOR MATUS REVIEW. The text (modules/i18n/messages.ts, privacy.* keys)
 * is a plain-language GDPR notice written from what the code actually does:
 * no forms, no analytics, `locale` and `sv_admin` cookies, IP only as a hash in
 * modules/ratelimit, hosting on Vercel fra1. Unverified and to confirm before
 * relying on it: log retention ("after a short time"), the database provider
 * and its region, and whether a DPA/SCCs are in place with each provider.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, message, type MessageKey } from "@/modules/i18n";
import { pageMetadata } from "@/modules/seo";
import { Chrome } from "../layout";
import { LegalFacts } from "../legal-facts";

const SECTIONS = [
  "controller",
  "data",
  "cookies",
  "basis",
  "retention",
  "processors",
  "rights",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, {
    path: "/privacy",
    title: message(locale, "privacy.title"),
    description: message(locale, "privacy.description"),
  });
}

export default async function Privacy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const h1 = message(locale, "privacy.h1");
  const updated = message(locale, "privacy.updated");

  return (
    <Chrome locale={locale} path="/privacy">
      <main id="main" tabIndex={-1} className="page">
        <article className="prose">
          {h1 ? <h1 className="page-title">{h1}</h1> : null}
          {updated ? (
            <p className="label">
              <time dateTime="2026-10-15">{updated}</time>
            </p>
          ) : null}
          {SECTIONS.map((id) => {
            const heading = message(locale, `privacy.${id}.h` as MessageKey);
            const body = message(locale, `privacy.${id}` as MessageKey);
            return (
              <section key={id} aria-labelledby={`privacy-${id}`}>
                {heading ? <h2 id={`privacy-${id}`}>{heading}</h2> : null}
                {body ? <p>{body}</p> : null}
                {id === "controller" ? <LegalFacts locale={locale} /> : null}
              </section>
            );
          })}
        </article>
      </main>
    </Chrome>
  );
}
