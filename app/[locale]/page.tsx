import { notFound } from "next/navigation";
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

  // Every string comes from the catalog. A `null` result for absent or
  // declared-missing key omits the element. English never appears instead.
  // Product names like BlinkLive and DOT. Gallery are brands, not catalog keys.
  const identity = message(locale, "home.identity");
  const client = message(locale, "home.client");
  const blink = message(locale, "home.blink");

  return (
    <Chrome locale={locale} path="" home>
      <main id="main" tabIndex={-1}>
        {/* 1. Company identity */}
        <section className="plaque" aria-label="company">
          <img
            src="/brand/sv-monogram.svg"
            alt=""
            className="sv-monogram"
            width={48}
            height={60}
          />
          {identity ? <p className="colophon">{identity}</p> : null}
        </section>

        {/* 2. DOT. Gallery + COMMA client work strip */}
        <section className="plaque" aria-label="client work">
          {client ? <p className="note client-strip">{client}</p> : null}
        </section>

        {/* 3. BlinkLive alone */}
        <section className="plaque" aria-label="BlinkLive">
          <p className="brand">BlinkLive</p>
          {blink ? <p className="note">{blink}</p> : null}
        </section>
      </main>
    </Chrome>
  );
}
