import { notFound } from "next/navigation";
import { isLocale, message } from "@/modules/i18n";
import { getHomepageCopy } from "@/modules/content";
import { Chrome } from "./layout";

type Entry = {
  name: string;
  role: string | null;
  note: string | null;
  href?: string;
  live?: boolean;
};

/**
 * Site v3 home. Four moves, nothing else:
 *   1. the lead (serif, the page's one loud thing) and a quiet identity line,
 *   2. "Now": a typeset index of what is on the bench today,
 *   3. an open, unnumbered last line that implies the list has no edge,
 *   4. "How we work": a few paragraphs of plain prose and what that can mean.
 * No cards, no frames, no call to action. The work and the open line say it.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  // Database overrides (admin copy API) win for identity and BlinkLive.
  const copy = await getHomepageCopy(locale);
  const lead = message(locale, "home.lead");
  const identity = copy.identity ?? message(locale, "home.identity");
  const now = message(locale, "home.now");
  const client = message(locale, "home.client");
  const own = message(locale, "home.own");
  const next = message(locale, "home.next");
  const how = message(locale, "home.how");
  const studio = (["home.p1", "home.p2", "home.p3", "home.p4"] as const)
    .map((key) => message(locale, key))
    .filter((text): text is string => Boolean(text));
  const servicesLabel = message(locale, "home.services");
  const services = (["home.s1", "home.s2", "home.s3", "home.s4"] as const)
    .map((key) => message(locale, key))
    .filter((text): text is string => Boolean(text));

  const entries: Entry[] = [
    {
      name: "DOT. Gallery",
      role: client,
      note: message(locale, "home.dot"),
      href: "https://dotgallery.sk",
    },
    { name: "COMMA gallery", role: client, note: message(locale, "home.comma") },
    {
      name: "BlinkLive",
      role: own,
      note: copy.blink ?? message(locale, "home.blink"),
      href: "https://blinklive.app",
      live: true,
    },
  ];

  // The lead is split on sentence ends so each sentence gets its own line and
  // its own reveal. Works for every locale because every lead is two sentences.
  const leadLines = lead ? lead.split(/(?<=\.)\s+/) : [];

  return (
    <Chrome locale={locale} path="" home>
      <main id="main" tabIndex={-1} className="home">
        <section className="opening" aria-label="SirenVenue">
          {leadLines.length > 0 ? (
            <h1 className="lead">
              {leadLines.map((line, i) => (
                <span key={line} className={`lead-line lead-line-${i + 1}`}>
                  {line}
                </span>
              ))}
            </h1>
          ) : null}
          {identity ? <p className="identity">{identity}</p> : null}
        </section>

        <section className="now" aria-labelledby="now-label">
          {now ? (
            <h2 id="now-label" className="label now-label">
              {now}
            </h2>
          ) : null}
          <ol className="ledger">
            {entries.map((entry, i) => {
              const inner = (
                <>
                  <span className="ledger-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ledger-name">
                    {entry.name}
                    {entry.live ? (
                      <span className="live-point" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="ledger-meta">
                    {entry.role ? (
                      <span className="ledger-role">{entry.role}</span>
                    ) : null}
                    {entry.note ? (
                      <span className="ledger-note">{entry.note}</span>
                    ) : null}
                  </span>
                  {entry.href ? (
                    <span className="ledger-arrow" aria-hidden="true">
                      ↗
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={entry.name} className="ledger-row">
                  {entry.href ? (
                    <a
                      className="ledger-entry is-link"
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="ledger-entry">{inner}</div>
                  )}
                </li>
              );
            })}
            {next ? (
              <li className="ledger-row is-open">
                <div className="ledger-entry">
                  <span className="ledger-no" aria-hidden="true">
                    {String(entries.length + 1).padStart(2, "0")}
                  </span>
                  <span className="ledger-name ledger-next">{next}</span>
                </div>
              </li>
            ) : null}
          </ol>
        </section>

        {/* How we work: plain reading text in the same two-column rhythm as
            the ledger. Label left, measure-width prose right, then the short
            list of what that can mean, set as a quiet run of words. */}
        <section className="now how" aria-labelledby="how-label">
          {how ? (
            <h2 id="how-label" className="label now-label">
              {how}
            </h2>
          ) : null}
          <div className="how-body">
            {studio.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {services.length > 0 ? (
              <div className="how-services">
                {servicesLabel ? <h3 className="label">{servicesLabel}</h3> : null}
                <ul>
                  {services.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </Chrome>
  );
}
