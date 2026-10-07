import { notFound } from "next/navigation";
import { isLocale, message } from "@/modules/i18n";
import { Chrome } from "./layout";
import { getHomepageCopy } from "@/modules/content";
import { AdminCopyEditor } from "./AdminCopyEditor";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const copy = await getHomepageCopy(locale);
  const identity = copy.identity ?? message(locale, "home.identity");
  const client = copy.client ?? message(locale, "home.client");
  const blink = copy.blink ?? message(locale, "home.blink");

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
        <AdminCopyEditor
          locale={locale}
          initialIdentity={identity}
          initialClient={client}
          initialBlink={blink}
        />
      </main>
    </Chrome>
  );
}
