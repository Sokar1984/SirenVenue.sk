import Image, { type StaticImageData } from "next/image";
import { notFound } from "next/navigation";
import { isLocale, message } from "@/modules/i18n";
import { getHomepageCopy } from "@/modules/content";
import { Chrome } from "./layout";
// Real stills, bundled at build time (static imports, never a runtime read of
// public/). DOT. Gallery: a crop of the current exhibition visual from
// dotgallery.sk. BlinkLive: its own published brand image (og.png).
import dotStill from "./img/dot-gallery-still.jpg";
import blinkStill from "./img/blinklive-still.jpg";

type Entry = {
  name: string;
  role: string | null;
  note: string | null;
  href?: string;
  live?: boolean;
  still?: StaticImageData;
  /** No real picture exists: a typographic mark stands in, never a fake. */
  glyph?: string;
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
      still: dotStill,
    },
    {
      name: "COMMA gallery",
      role: client,
      note: message(locale, "home.comma"),
      glyph: ",",
    },
    {
      name: "BlinkLive",
      role: own,
      note: copy.blink ?? message(locale, "home.blink"),
      href: "https://blinklive.app",
      live: true,
      still: blinkStill,
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

        {/* The Now list. No numbers, no rules, no tracked caps: space and the
            serif names carry the rhythm. The role is a quiet sentence-case
            word ahead of the note. A still sits in its own column so every
            name shares one left edge, with or without a picture. */}
        <section className="now" aria-labelledby="now-label">
          {now ? (
            <h2 id="now-label" className="visually-hidden">
              {now}
            </h2>
          ) : null}
          <ul className="ledger">
            {entries.map((entry, i) => {
              const inner = (
                <>
                  <span
                    className={entry.still || entry.glyph ? "ledger-still has-mark" : "ledger-still"}
                    aria-hidden="true"
                  >
                    {entry.glyph ? <span className="ledger-glyph">{entry.glyph}</span> : null}
                    {entry.still ? (
                      <Image
                        src={entry.still}
                        alt=""
                        sizes="(min-width: 1024px) 7rem, 5rem"
                        priority={i === 0}
                        placeholder="blur"
                      />
                    ) : null}
                  </span>
                  <span className="ledger-text">
                    <span className="ledger-name">
                      {entry.name}
                      {entry.live ? (
                        <span className="live-point" aria-hidden="true" />
                      ) : null}
                    </span>
                    <span className="ledger-meta">
                      {entry.role ? <span className="ledger-role">{entry.role}.</span> : null}{" "}
                      {entry.note ? <span className="ledger-note">{entry.note}</span> : null}
                    </span>
                  </span>
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
                  <span className="ledger-still" aria-hidden="true" />
                  <span className="ledger-text">
                    <span className="ledger-name ledger-next">{next}</span>
                  </span>
                </div>
              </li>
            ) : null}
          </ul>
        </section>

        {/* How we work: a serif section head at entry size, then plain prose
            at text size. The services follow as a short sentence-case list. */}
        <section className="how" aria-labelledby="how-label">
          {how ? (
            <h2 id="how-label" className="how-title">
              {how}
            </h2>
          ) : null}
          <div className="how-body">
            {studio.map((text) => (
              <p key={text}>{text}</p>
            ))}
            {services.length > 0 ? (
              <div className="how-services">
                {servicesLabel ? <h3 className="how-services-title">{servicesLabel}</h3> : null}
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
