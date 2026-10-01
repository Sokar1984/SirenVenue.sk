import { works } from "@/content/works";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "4rem 1.5rem 3rem",
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
        minHeight: "100vh",
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
          SirenVenue
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", maxWidth: "36ch", lineHeight: 1.5 }}>
          Software &amp; systems for live, venue, and gallery.
        </p>
      </header>

      <section aria-label="Selected work">
        <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: "1px solid var(--line)" }}>
          {works.map((w) => (
            <li
              key={w.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "1rem 0",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <a href={w.href} target="_blank" rel="noreferrer">
                {w.name}
              </a>
              <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{w.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer
        style={{
          marginTop: "auto",
          color: "var(--muted)",
          fontSize: "0.85rem",
          lineHeight: 1.6,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <a href="mailto:hello@sirenvenue.sk">hello@sirenvenue.sk</a>
        <span>Bratislava, Slovakia</span>
        <span>SirenVenue s.r.o.</span>
      </footer>
    </main>
  );
}
