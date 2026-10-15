import { company, contact } from "@/content/legal";
import { message, type Locale } from "@/modules/i18n";

/** The company's verified facts, from content/legal.ts only. */
export function LegalFacts({ locale }: { locale: Locale }) {
  const rows: Array<[string | null, React.ReactNode]> = [
    [message(locale, "legal.name"), company.name],
    ["IČO", company.ico],
    [message(locale, "legal.seat"), company.seat],
    [message(locale, "legal.register"), `${company.court}, ${company.file}`],
    [
      message(locale, "legal.email"),
      <a key="email" href={`mailto:${contact.email}`}>
        {contact.email}
      </a>,
    ],
  ];
  return (
    <dl className="facts">
      {rows.map(([term, value]) =>
        term ? (
          <div key={term} className="fact">
            <dt className="label">{term}</dt>
            <dd>{value}</dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}
