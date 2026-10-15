/**
 * Typed message catalog - the only place the site's chrome and section labels
 * are written.
 *
 * What belongs here
 * -----------------
 * Short, structural strings: the colophon line, section labels, an `aria-label`
 * or two, and the 404 copy. Product names never belong here. `BlinkLive`
 * and `DOT. Gallery` are brands: they are spelled the same in every locale and
 * are translated by no one. (SirenVenue.com tile removed per SOK-350.)
 * Home page uses home.* keys (site v3: lead, identity, the Now index).
 *
 * Where the strings live at runtime
 * ---------------------------------
 * This module is the single runtime source for the chrome. It is also the
 * authored input `prisma/seed-content.ts` projects into the `messages` table
 * (`key`, `locale`, `value`, `reviewed`) for machine consumers, exactly as
 * `content/works.ts` seeds the `Work` table.
 *
 * The chrome deliberately reads this module and not that table. The shell must
 * render when Postgres is down (see the outage policy in `modules/content`), and
 * the render policy below - a declared-missing key renders nothing - is stated
 * only here: the table has no notion of a declaration, and the seed projects
 * rows without ever deleting one. `modules/content` owns the only Prisma client,
 * so the chrome cannot consult the table without opening a second one. Chosen:
 * one runtime source, this file. The table remains seed output, not a read path.
 *
 * The gate in `scripts/check-messages.mjs` reads this module directly so it
 * stays dependency-free and CI-runnable.
 *
 * The review flag
 * ---------------
 * `sk` and `en` are written by the project and seeded as reviewed. The other
 * seven locales (`de`, `es`, `es-ve`, `hu`, `cs`, `uk`, `ru`) are unreviewed
 * drafts awaiting a human who reads the language. An unreviewed, right-language
 * draft is worth more than an English one; a wrong-language string is worth
 * less than nothing.
 *
 * `es-ve` is Venezuelan Spanish and is its own locale. It is never flattened
 * into `es` and never seeded from it.
 *
 * Render policy - no silent English
 * ---------------------------------
 * A key that is absent for a locale and not declared in `declaredMissing` is a
 * defect: the completeness gate fails the build. At render time, `message()`
 * returns the value only for the exact locale asked for. A declared-missing key
 * renders nothing at all - the surface omits the element rather than showing a
 * string in the wrong language. There is no `defaultLocale` fallback, ever:
 * an English string shown to a Slovak visitor is exactly the failure the vision
 * forbids. (The one honest exception is that a *brand* is identical in every
 * locale; brands are not catalog entries.)
 *
 * Placeholders
 * ------------
 * Values may contain `{count}`. It is replaced by the caller after formatting;
 * a placeholder is never translated.
 */
import type { Locale } from "./locales";

/** Every translatable key. Keys are added only when a surface uses them. */
export const messageKeys = [
  "skip",
  "colophon",
  "nav.language",
  "notFound.lead",
  "notFound.note",
  "home.lead",
  "home.identity",
  "home.now",
  "home.client",
  "home.own",
  "home.dot",
  "home.comma",
  "home.blink",
  "home.next",
  "nav.pages",
  "nav.home",
  "nav.about",
  "nav.privacy",
  "home.how",
  "home.p1",
  "home.p2",
  "home.p3",
  "home.p4",
  "home.services",
  "home.s1",
  "home.s2",
  "home.s3",
  "home.s4",
  "about.title",
  "about.description",
  "about.h1",
  "about.p1",
  "about.p2",
  "about.p3",
  "about.company",
  "legal.name",
  "legal.seat",
  "legal.register",
  "legal.email",
  "privacy.title",
  "privacy.description",
  "privacy.h1",
  "privacy.updated",
  "privacy.controller.h",
  "privacy.controller",
  "privacy.data.h",
  "privacy.data",
  "privacy.cookies.h",
  "privacy.cookies",
  "privacy.basis.h",
  "privacy.basis",
  "privacy.retention.h",
  "privacy.retention",
  "privacy.processors.h",
  "privacy.processors",
  "privacy.rights.h",
  "privacy.rights",
] as const;

export type MessageKey = (typeof messageKeys)[number];

/**
 * A locale's values. `Partial` on purpose: a missing key is legal only when it
 * is declared in `declaredMissing`, and the gate is what proves it.
 */
export type MessageCatalog = Record<
  Locale,
  Partial<Record<MessageKey, string>>
>;

/**
 * The authored catalog, in canonical locale order (`sk` first). Object key
 * order is therefore the display order used by the gate and the seed.
 */
export const catalog: MessageCatalog = {
  sk: {
    skip: "Prejsť na hlavný obsah",
    colophon: "Riešenia na mieru pre ľudí a malé firmy.",
    "nav.language": "Jazyk",
    "notFound.lead": "Na tejto adrese nič nie je.",
    "notFound.note":
      "Odkaz je zastaraný alebo nikdy nebol náš. Každý produkt, ktorý vydávame, odkazuje späť na sirenvenue.sk. Toto je tá stránka.",
    "home.lead": "Každá úloha je iná. Aj odpoveď.",
    "home.identity": "Navrhujeme a staviame moderné riešenia na mieru. Pre jednotlivcov aj malé firmy. Z Bratislavy.",
    "home.now": "Teraz",
    "home.client": "Klient",
    "home.own": "Jeden z našich projektov",
    "home.dot": "Celá prevádzka, kúsok po kúsku.",
    "home.comma": "Rovnaký základ, vlastná tvár.",
    "home.blink": "Živá kamera pre miesta, ktoré potrebujú oči.",
    "home.next": "Ďalší riadok môže byť čokoľvek.",
    "nav.pages": "Stránky",
    "nav.home": "Domov",
    "nav.about": "O nás",
    "nav.privacy": "Ochrana súkromia",
    "home.how": "Ako pracujeme",
    "home.p1": "Väčšina toho, čo staviame, nezačína zadaním, ale rozhovorom. Niekto vedie obchod, ateliér, prax alebo len život, ktorý prerástol nástroje okolo seba. Počúvame, kým nerozumieme, ako vyzerá bežný deň.",
    "home.p2": "Potom postavíme to, čo sedí. Niekedy je to web. Častejšie tichá mašinéria za ním: sklad, ktorý vie, kde čo je, dokumenty, ktoré sa založia samy, rezervácie, malá súkromná aplikácia pre jedného človeka.",
    "home.p3": "Tím je malý a práca zostáva blízko. Tí istí ľudia ju navrhnú, napíšu kód, spustia ju a ozvú sa, keď treba niečo zmeniť. Nič nie je zo šablóny a nič nezostane napoly.",
    "home.p4": "Pracujeme z Bratislavy, po slovensky, anglicky a v niekoľkých ďalších jazykoch, pre ľudí kdekoľvek.",
    "home.services": "Čo to môže znamenať",
    "home.s1": "Weby a webové aplikácie",
    "home.s2": "Interné nástroje a automatizácia",
    "home.s3": "Živé video a kamerové systémy",
    "home.s4": "Hosting a starostlivosť po spustení",
    "about.title": "O nás",
    "about.description": "SirenVenue s. r. o. je malé štúdio z Bratislavy. Navrhujeme a staviame riešenia na mieru pre jednotlivcov a malé firmy.",
    "about.h1": "Malé štúdio. Široký záber.",
    "about.p1": "SirenVenue je slovenská spoločnosť, založená v roku 2024, so sídlom v Bratislave. Nie sme viazaní na jeden produkt ani jedno odvetvie. Každý projekt dostane vlastný tvar.",
    "about.p2": "Teraz pracujeme s DOT. Gallery a COMMA gallery a vedieme niekoľko vlastných projektov, medzi nimi BlinkLive. Čo príde ďalej, závisí od toho, kto príde.",
    "about.p3": "Záleží nám na častiach, ktoré nikto nevidí: čo sa stane, keď vypadne sieť, kto sa dostane k dátam, ako to vydrží v rušný deň, ako ľahko sa to dá o rok zmeniť.",
    "about.company": "Firma",
    "legal.name": "Názov",
    "legal.seat": "Sídlo",
    "legal.register": "Zápis",
    "legal.email": "E-mail",
    "privacy.title": "Ochrana osobných údajov",
    "privacy.description": "Ako SirenVenue s. r. o. spracúva osobné údaje na sirenvenue.sk.",
    "privacy.h1": "Ochrana osobných údajov",
    "privacy.updated": "Verzia z 15. októbra 2026",
    "privacy.controller.h": "Kto spracúva údaje",
    "privacy.controller": "Prevádzkovateľom je spoločnosť uvedená nižšie. S otázkami o vašich údajoch nám napíšte na uvedený e-mail.",
    "privacy.data.h": "Aké údaje",
    "privacy.data": "Táto stránka nemá formuláre, verejné účty ani analytiku tretích strán. Keď nám napíšete e-mail, spracúvame vašu adresu a obsah správy, aby sme mohli odpovedať. Pri návšteve server krátko zaznamená technické údaje, napríklad čas požiadavky a typ prehliadača. Naše vlastné systémy vašu IP adresu neukladajú, na ochranu pred zneužitím používame len jej jednosmerný hash.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Používame len cookies, ktoré stránka potrebuje. Cookie „locale“ si pamätá zvolený jazyk. Cookie „sv_admin“ sa nastaví iba pri prihlásení do administrácie. Žiadne reklamné ani sledovacie cookies.",
    "privacy.basis.h": "Právny základ",
    "privacy.basis": "Odpoveď na váš e-mail je náš oprávnený záujem a krok pred prípadnou zmluvou (čl. 6 ods. 1 písm. b) a f) GDPR). Technické záznamy a ochrana pred zneužitím sú náš oprávnený záujem na bezpečnej prevádzke (čl. 6 ods. 1 písm. f) GDPR).",
    "privacy.retention.h": "Ako dlho",
    "privacy.retention": "E-maily uchovávame, kým sú potrebné pre komunikáciu alebo zmluvu, potom ich vymažeme, ak zákon nevyžaduje dlhšie uchovanie. Technické záznamy sa mažú automaticky po krátkom čase.",
    "privacy.processors.h": "Kto ďalší",
    "privacy.processors": "Stránka beží na infraštruktúre Vercel (región Frankfurt, EÚ) s databázou u poskytovateľa hostingu. Títo dodávatelia spracúvajú údaje len podľa našich pokynov. Ak údaje opustia EÚ, prenos sa opiera o štandardné zmluvné doložky. Údaje nepredávame ani nezdieľame na marketing.",
    "privacy.rights.h": "Vaše práva",
    "privacy.rights": "Máte právo na prístup k svojim údajom, ich opravu, vymazanie, obmedzenie spracúvania a prenosnosť, a právo namietať. Stačí nám napísať. Sťažnosť môžete podať aj Úradu na ochranu osobných údajov Slovenskej republiky (dataprotection.gov.sk).",
  },
  en: {
    skip: "Skip to main content",
    colophon: "Made-to-measure solutions for people and small businesses.",
    "nav.language": "Language",
    "notFound.lead": "Nothing at this address.",
    "notFound.note":
      "The link is out of date, or it was never ours. Every product we ship links back to sirenvenue.sk. This is that page.",
    "home.lead": "Every problem is different. So is the answer.",
    "home.identity": "We design and build modern, made-to-measure solutions. For individuals and small businesses. From Bratislava.",
    "home.now": "Now",
    "home.client": "Client",
    "home.own": "One of our own",
    "home.dot": "The whole operation, one piece at a time.",
    "home.comma": "Same foundation, its own face.",
    "home.blink": "A live camera for places that need eyes.",
    "home.next": "The next line could be anything.",
    "nav.pages": "Pages",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.privacy": "Privacy",
    "home.how": "How we work",
    "home.p1": "Most of what we build starts with a conversation, not a brief. Someone runs a shop, a studio, a practice, or just a life that has outgrown the tools around it. We listen until we understand what an ordinary day looks like.",
    "home.p2": "Then we build what fits. Sometimes it is a website. More often it is the quiet machinery behind one: stock that knows where it is, documents that file themselves, a booking flow, a small private app for one person.",
    "home.p3": "The team is small and the work stays close. The people who design it also write the code, ship it and pick up when something needs to change. Nothing comes from a template and nothing is left half done.",
    "home.p4": "We work from Bratislava, in Slovak, English and a few other languages, for people wherever they are.",
    "home.services": "What that can mean",
    "home.s1": "Websites and web apps",
    "home.s2": "Internal tools and automation",
    "home.s3": "Live video and camera systems",
    "home.s4": "Hosting and care after launch",
    "about.title": "About",
    "about.description": "SirenVenue s. r. o. is a small studio in Bratislava. We design and build made-to-measure solutions for individuals and small businesses.",
    "about.h1": "A small studio. A wide reach.",
    "about.p1": "SirenVenue is a Slovak company, founded in 2024 and based in Bratislava. We are not tied to one product or one industry. Each project gets its own shape.",
    "about.p2": "Right now we work with DOT. Gallery and COMMA gallery, and we run several projects of our own, BlinkLive among them. What comes next depends on who walks in.",
    "about.p3": "We care about the parts nobody sees: what happens when the network drops, who can reach the data, how it holds up on a busy day, how easy it is to change a year from now.",
    "about.company": "Company",
    "legal.name": "Name",
    "legal.seat": "Registered seat",
    "legal.register": "Register",
    "legal.email": "Email",
    "privacy.title": "Privacy",
    "privacy.description": "How SirenVenue s. r. o. handles personal data on sirenvenue.sk.",
    "privacy.h1": "Privacy",
    "privacy.updated": "Version of 15 October 2026",
    "privacy.controller.h": "Who is responsible",
    "privacy.controller": "The controller is the company listed below. Write to the email below with any question about your data.",
    "privacy.data.h": "What we collect",
    "privacy.data": "This site has no forms, no public accounts and no third-party analytics. When you email us, we process your address and your message so we can reply. On each visit the server briefly logs technical data such as the time of the request and the browser type. Our own systems never store your IP address. To prevent abuse we only use a one-way hash of it.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "We only use cookies the site needs. The “locale” cookie remembers your language. The “sv_admin” cookie is set only when someone signs in to the admin. No advertising or tracking cookies.",
    "privacy.basis.h": "Legal basis",
    "privacy.basis": "Replying to your email is our legitimate interest and a step before a possible contract (Art. 6(1)(b) and (f) GDPR). Technical logs and abuse protection are our legitimate interest in running the site safely (Art. 6(1)(f) GDPR).",
    "privacy.retention.h": "How long",
    "privacy.retention": "We keep emails as long as the conversation or a contract needs them, then delete them unless the law requires longer. Technical logs are deleted automatically after a short time.",
    "privacy.processors.h": "Who else",
    "privacy.processors": "The site runs on Vercel infrastructure (Frankfurt region, EU) with a hosted database. These providers process data only on our instructions. Where data leaves the EU, the transfer relies on standard contractual clauses. We never sell data or share it for marketing.",
    "privacy.rights.h": "Your rights",
    "privacy.rights": "You have the right to access, correct, erase, restrict and port your data, and the right to object. Just write to us. You can also complain to the Office for Personal Data Protection of the Slovak Republic (dataprotection.gov.sk).",
  },
  de: {
    skip: "Zum Hauptinhalt springen",
    colophon: "Maßgeschneiderte Lösungen für Menschen und kleine Unternehmen.",
    "nav.language": "Sprache",
    "notFound.lead": "Unter dieser Adresse gibt es nichts.",
    "notFound.note":
      "Der Link ist veraltet, oder er war nie unserer. Jedes Produkt, das wir ausliefern, verweist zurück auf sirenvenue.sk. Das hier ist diese Seite.",
    "home.lead": "Jede Aufgabe ist anders. Die Antwort auch.",
    "home.identity": "Wir entwerfen und bauen moderne Lösungen nach Maß. Für Einzelpersonen und kleine Unternehmen. Aus Bratislava.",
    "home.now": "Jetzt",
    "home.client": "Kunde",
    "home.own": "Eines unserer Projekte",
    "home.dot": "Der ganze Betrieb, Stück für Stück.",
    "home.comma": "Gleiches Fundament, eigenes Gesicht.",
    "home.blink": "Eine Live-Kamera für Orte, die Augen brauchen.",
    "home.next": "Die nächste Zeile kann alles sein.",
    "nav.pages": "Seiten",
    "nav.home": "Start",
    "nav.about": "Über uns",
    "nav.privacy": "Datenschutz",
    "home.how": "Wie wir arbeiten",
    "home.p1": "Das meiste, was wir bauen, beginnt mit einem Gespräch, nicht mit einem Lastenheft. Jemand führt einen Laden, ein Atelier, eine Praxis oder einfach ein Leben, das seinen Werkzeugen entwachsen ist. Wir hören zu, bis wir verstehen, wie ein gewöhnlicher Tag aussieht.",
    "home.p2": "Dann bauen wir, was passt. Manchmal ist es eine Website. Öfter ist es die stille Maschinerie dahinter: ein Lager, das weiß, wo alles ist, Dokumente, die sich selbst ablegen, eine Buchung, eine kleine private App für eine Person.",
    "home.p3": "Das Team ist klein und die Arbeit bleibt nah. Dieselben Menschen entwerfen es, schreiben den Code, bringen es live und melden sich, wenn sich etwas ändern muss. Nichts kommt aus einer Vorlage und nichts bleibt halb fertig.",
    "home.p4": "Wir arbeiten aus Bratislava, auf Slowakisch, Englisch und in einigen weiteren Sprachen, für Menschen überall.",
    "home.services": "Was das heißen kann",
    "home.s1": "Websites und Web-Apps",
    "home.s2": "Interne Werkzeuge und Automatisierung",
    "home.s3": "Live-Video und Kamerasysteme",
    "home.s4": "Hosting und Pflege nach dem Start",
    "about.title": "Über uns",
    "about.description": "SirenVenue s. r. o. ist ein kleines Studio in Bratislava. Wir entwerfen und bauen Lösungen nach Maß für Einzelpersonen und kleine Unternehmen.",
    "about.h1": "Ein kleines Studio. Ein weiter Blick.",
    "about.p1": "SirenVenue ist ein slowakisches Unternehmen, gegründet 2024, mit Sitz in Bratislava. Wir sind an kein Produkt und keine Branche gebunden. Jedes Projekt bekommt seine eigene Form.",
    "about.p2": "Derzeit arbeiten wir mit DOT. Gallery und COMMA gallery und betreiben mehrere eigene Projekte, darunter BlinkLive. Was als Nächstes kommt, hängt davon ab, wer hereinkommt.",
    "about.p3": "Uns sind die Teile wichtig, die niemand sieht: was passiert, wenn das Netz ausfällt, wer an die Daten kommt, wie es einen vollen Tag aushält, wie leicht es sich in einem Jahr ändern lässt.",
    "about.company": "Unternehmen",
    "legal.name": "Name",
    "legal.seat": "Sitz",
    "legal.register": "Register",
    "legal.email": "E-Mail",
    "privacy.title": "Datenschutz",
    "privacy.description": "Wie SirenVenue s. r. o. personenbezogene Daten auf sirenvenue.sk verarbeitet.",
    "privacy.h1": "Datenschutz",
    "privacy.updated": "Fassung vom 15. Oktober 2026",
    "privacy.controller.h": "Verantwortlich",
    "privacy.controller": "Verantwortlich ist das unten genannte Unternehmen. Fragen zu Ihren Daten senden Sie bitte an die unten genannte E-Mail-Adresse.",
    "privacy.data.h": "Welche Daten",
    "privacy.data": "Diese Seite hat keine Formulare, keine öffentlichen Konten und keine Analyse durch Dritte. Wenn Sie uns schreiben, verarbeiten wir Ihre Adresse und Ihre Nachricht, um zu antworten. Bei jedem Besuch protokolliert der Server kurz technische Daten wie Zeitpunkt der Anfrage und Browsertyp. Unsere eigenen Systeme speichern Ihre IP-Adresse nie. Zum Schutz vor Missbrauch nutzen wir nur einen Einweg-Hash davon.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Wir verwenden nur Cookies, die die Seite braucht. Das Cookie „locale“ merkt sich Ihre Sprache. Das Cookie „sv_admin“ wird nur bei der Anmeldung in der Verwaltung gesetzt. Keine Werbe- oder Tracking-Cookies.",
    "privacy.basis.h": "Rechtsgrundlage",
    "privacy.basis": "Die Antwort auf Ihre E-Mail ist unser berechtigtes Interesse und ein Schritt vor einem möglichen Vertrag (Art. 6 Abs. 1 lit. b und f DSGVO). Technische Protokolle und Missbrauchsschutz sind unser berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).",
    "privacy.retention.h": "Wie lange",
    "privacy.retention": "E-Mails bewahren wir auf, solange das Gespräch oder ein Vertrag sie braucht, danach löschen wir sie, sofern das Gesetz nichts anderes verlangt. Technische Protokolle werden nach kurzer Zeit automatisch gelöscht.",
    "privacy.processors.h": "Wer noch",
    "privacy.processors": "Die Seite läuft auf Infrastruktur von Vercel (Region Frankfurt, EU) mit einer gehosteten Datenbank. Diese Dienstleister verarbeiten Daten nur nach unseren Weisungen. Verlassen Daten die EU, stützt sich die Übermittlung auf Standardvertragsklauseln. Wir verkaufen keine Daten und geben sie nicht für Werbung weiter.",
    "privacy.rights.h": "Ihre Rechte",
    "privacy.rights": "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Übertragbarkeit Ihrer Daten sowie das Recht auf Widerspruch. Schreiben Sie uns einfach. Sie können sich auch bei der slowakischen Datenschutzbehörde beschweren (dataprotection.gov.sk).",
  },
  es: {
    skip: "Saltar al contenido principal",
    colophon: "Soluciones a medida para personas y pequeñas empresas.",
    "nav.language": "Idioma",
    "notFound.lead": "En esta dirección no hay nada.",
    "notFound.note":
      "El enlace está desactualizado o nunca fue nuestro. Cada producto que publicamos enlaza de vuelta a sirenvenue.sk. Esta es esa página.",
    "home.lead": "Cada problema es distinto. La respuesta también.",
    "home.identity": "Diseñamos y construimos soluciones modernas a medida. Para particulares y pequeñas empresas. Desde Bratislava.",
    "home.now": "Ahora",
    "home.client": "Cliente",
    "home.own": "Uno de nuestros proyectos",
    "home.dot": "Toda la operación, pieza a pieza.",
    "home.comma": "La misma base, su propia cara.",
    "home.blink": "Una cámara en directo para lugares que necesitan ojos.",
    "home.next": "La próxima línea puede ser cualquier cosa.",
    "nav.pages": "Páginas",
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.privacy": "Privacidad",
    "home.how": "Cómo trabajamos",
    "home.p1": "Casi todo lo que construimos empieza con una conversación, no con un pliego. Alguien lleva una tienda, un estudio, una consulta o simplemente una vida que se le ha quedado grande a sus herramientas. Escuchamos hasta entender cómo es un día normal.",
    "home.p2": "Luego construimos lo que encaja. A veces es una web. Más a menudo es la maquinaria silenciosa que hay detrás: un inventario que sabe dónde está cada cosa, documentos que se archivan solos, un sistema de reservas, una pequeña app privada para una sola persona.",
    "home.p3": "El equipo es pequeño y el trabajo se queda cerca. Las mismas personas lo diseñan, escriben el código, lo publican y responden cuando algo tiene que cambiar. Nada sale de una plantilla y nada se queda a medias.",
    "home.p4": "Trabajamos desde Bratislava, en eslovaco, inglés y algunos idiomas más, para personas estén donde estén.",
    "home.services": "Qué puede significar",
    "home.s1": "Webs y aplicaciones web",
    "home.s2": "Herramientas internas y automatización",
    "home.s3": "Vídeo en directo y sistemas de cámaras",
    "home.s4": "Alojamiento y cuidado tras el lanzamiento",
    "about.title": "Nosotros",
    "about.description": "SirenVenue s. r. o. es un pequeño estudio en Bratislava. Diseñamos y construimos soluciones a medida para particulares y pequeñas empresas.",
    "about.h1": "Un estudio pequeño. Un alcance amplio.",
    "about.p1": "SirenVenue es una empresa eslovaca, fundada en 2024, con sede en Bratislava. No estamos atados a un producto ni a un sector. Cada proyecto tiene su propia forma.",
    "about.p2": "Ahora trabajamos con DOT. Gallery y COMMA gallery, y llevamos varios proyectos propios, entre ellos BlinkLive. Lo que venga después depende de quién entre por la puerta.",
    "about.p3": "Nos importan las partes que nadie ve: qué pasa cuando se cae la red, quién puede llegar a los datos, cómo aguanta un día de mucho trabajo, qué tan fácil será cambiarlo dentro de un año.",
    "about.company": "Empresa",
    "legal.name": "Nombre",
    "legal.seat": "Domicilio social",
    "legal.register": "Registro",
    "legal.email": "Correo",
    "privacy.title": "Privacidad",
    "privacy.description": "Cómo trata SirenVenue s. r. o. los datos personales en sirenvenue.sk.",
    "privacy.h1": "Privacidad",
    "privacy.updated": "Versión del 15 de octubre de 2026",
    "privacy.controller.h": "Responsable",
    "privacy.controller": "El responsable es la empresa indicada abajo. Escríbenos al correo indicado con cualquier pregunta sobre tus datos.",
    "privacy.data.h": "Qué datos",
    "privacy.data": "Este sitio no tiene formularios, cuentas públicas ni analítica de terceros. Si nos escribes, tratamos tu dirección y tu mensaje para poder responder. En cada visita el servidor registra brevemente datos técnicos como la hora de la petición y el tipo de navegador. Nuestros propios sistemas nunca guardan tu dirección IP. Para evitar abusos solo usamos un hash unidireccional de ella.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Solo usamos las cookies que el sitio necesita. La cookie “locale” recuerda tu idioma. La cookie “sv_admin” solo se crea al iniciar sesión en la administración. Ninguna cookie publicitaria ni de seguimiento.",
    "privacy.basis.h": "Base legal",
    "privacy.basis": "Responder a tu correo es nuestro interés legítimo y un paso previo a un posible contrato (art. 6.1.b y 6.1.f RGPD). Los registros técnicos y la protección contra abusos son nuestro interés legítimo en un funcionamiento seguro (art. 6.1.f RGPD).",
    "privacy.retention.h": "Cuánto tiempo",
    "privacy.retention": "Guardamos los correos mientras la conversación o un contrato los necesiten y después los borramos, salvo que la ley exija más. Los registros técnicos se borran automáticamente al poco tiempo.",
    "privacy.processors.h": "Quién más",
    "privacy.processors": "El sitio funciona sobre la infraestructura de Vercel (región Fráncfort, UE) con una base de datos alojada. Estos proveedores solo tratan datos según nuestras instrucciones. Si los datos salen de la UE, la transferencia se basa en cláusulas contractuales tipo. Nunca vendemos datos ni los compartimos con fines de marketing.",
    "privacy.rights.h": "Tus derechos",
    "privacy.rights": "Tienes derecho a acceder, rectificar, suprimir, limitar y portar tus datos, y a oponerte. Basta con escribirnos. También puedes reclamar ante la Oficina de Protección de Datos Personales de la República Eslovaca (dataprotection.gov.sk).",
  },
  "es-ve": {
    skip: "Saltar al contenido principal",
    colophon: "Soluciones a la medida para personas y pequeños negocios.",
    "nav.language": "Idioma",
    "notFound.lead": "No hay nada en esta dirección.",
    "notFound.note":
      "El enlace está vencido o nunca fue nuestro. Cada producto que lanzamos enlaza de vuelta a sirenvenue.sk. Esta es esa página.",
    "home.lead": "Cada problema es distinto. La respuesta también.",
    "home.identity": "Diseñamos y construimos soluciones modernas a la medida. Para personas y pequeños negocios. Desde Bratislava.",
    "home.now": "Ahora",
    "home.client": "Cliente",
    "home.own": "Uno de nuestros proyectos",
    "home.dot": "Toda la operación, pieza por pieza.",
    "home.comma": "La misma base, su propia cara.",
    "home.blink": "Una cámara en vivo para lugares que necesitan ojos.",
    "home.next": "La próxima línea puede ser cualquier cosa.",
    "nav.pages": "Páginas",
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.privacy": "Privacidad",
    "home.how": "Cómo trabajamos",
    "home.p1": "Casi todo lo que construimos empieza con una conversación, no con un encargo cerrado. Alguien tiene una tienda, un estudio, una consulta o simplemente una vida que se le ha quedado grande a sus herramientas. Escuchamos hasta entender cómo es un día normal.",
    "home.p2": "Luego construimos lo que encaja. A veces es una página web. Más a menudo es la maquinaria silenciosa que hay detrás: un inventario que sabe dónde está cada cosa, documentos que se archivan solos, un sistema de reservas, una pequeña aplicación privada para una sola persona.",
    "home.p3": "El equipo es pequeño y el trabajo se queda cerca. Las mismas personas lo diseñan, escriben el código, lo publican y responden cuando algo tiene que cambiar. Nada sale de una plantilla y nada se queda a medias.",
    "home.p4": "Trabajamos desde Bratislava, en eslovaco, inglés y algunos idiomas más, para personas estén donde estén.",
    "home.services": "Qué puede significar",
    "home.s1": "Webs y aplicaciones web",
    "home.s2": "Herramientas internas y automatización",
    "home.s3": "Video en vivo y sistemas de cámaras",
    "home.s4": "Hosting y mantenimiento después del lanzamiento",
    "about.title": "Nosotros",
    "about.description": "SirenVenue s. r. o. es un pequeño estudio en Bratislava. Diseñamos y construimos soluciones a la medida para personas y pequeños negocios.",
    "about.h1": "Un estudio pequeño. Un alcance amplio.",
    "about.p1": "SirenVenue es una empresa eslovaca, fundada en 2024, con sede en Bratislava. No estamos atados a un producto ni a un sector. Cada proyecto tiene su propia forma.",
    "about.p2": "Ahora trabajamos con DOT. Gallery y COMMA gallery, y llevamos varios proyectos propios, entre ellos BlinkLive. Lo que venga después depende de quién entre por la puerta.",
    "about.p3": "Nos importan las partes que nadie ve: qué pasa cuando se cae la red, quién puede llegar a los datos, cómo aguanta un día de mucho trabajo, qué tan fácil será cambiarlo dentro de un año.",
    "about.company": "Empresa",
    "legal.name": "Nombre",
    "legal.seat": "Domicilio social",
    "legal.register": "Registro",
    "legal.email": "Correo",
    "privacy.title": "Privacidad",
    "privacy.description": "Cómo trata SirenVenue s. r. o. los datos personales en sirenvenue.sk.",
    "privacy.h1": "Privacidad",
    "privacy.updated": "Versión del 15 de octubre de 2026",
    "privacy.controller.h": "Responsable",
    "privacy.controller": "El responsable es la empresa indicada abajo. Escríbenos al correo indicado con cualquier pregunta sobre tus datos.",
    "privacy.data.h": "Qué datos",
    "privacy.data": "Este sitio no tiene formularios, cuentas públicas ni analítica de terceros. Si nos escribes, tratamos tu dirección y tu mensaje para poder responder. En cada visita el servidor registra brevemente datos técnicos como la hora de la petición y el tipo de navegador. Nuestros propios sistemas nunca guardan tu dirección IP. Para evitar abusos solo usamos un hash unidireccional de ella.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Solo usamos las cookies que el sitio necesita. La cookie “locale” recuerda tu idioma. La cookie “sv_admin” solo se crea al iniciar sesión en la administración. Ninguna cookie publicitaria ni de seguimiento.",
    "privacy.basis.h": "Base legal",
    "privacy.basis": "Responder a tu correo es nuestro interés legítimo y un paso previo a un posible contrato (art. 6.1.b y 6.1.f RGPD). Los registros técnicos y la protección contra abusos son nuestro interés legítimo en un funcionamiento seguro (art. 6.1.f RGPD).",
    "privacy.retention.h": "Cuánto tiempo",
    "privacy.retention": "Guardamos los correos mientras la conversación o un contrato los necesiten y después los borramos, salvo que la ley exija más. Los registros técnicos se borran automáticamente al poco tiempo.",
    "privacy.processors.h": "Quién más",
    "privacy.processors": "El sitio funciona sobre la infraestructura de Vercel (región Fráncfort, UE) con una base de datos alojada. Estos proveedores solo tratan datos según nuestras instrucciones. Si los datos salen de la UE, la transferencia se basa en cláusulas contractuales tipo. Nunca vendemos datos ni los compartimos con fines de marketing.",
    "privacy.rights.h": "Tus derechos",
    "privacy.rights": "Tienes derecho a acceder, rectificar, suprimir, limitar y portar tus datos, y a oponerte. Basta con escribirnos. También puedes reclamar ante la Oficina de Protección de Datos Personales de la República Eslovaca (dataprotection.gov.sk).",
  },
  hu: {
    skip: "Ugrás a fő tartalomra",
    colophon: "Személyre szabott megoldások embereknek és kisvállalkozásoknak.",
    "nav.language": "Nyelv",
    "notFound.lead": "Ezen a címen nincs semmi.",
    "notFound.note":
      "A link elavult, vagy soha nem is a miénk volt. Minden termék, amit kiadunk, visszamutat a sirenvenue.sk-ra. Ez az az oldal.",
    "home.lead": "Minden feladat más. A válasz is.",
    "home.identity": "Modern, személyre szabott megoldásokat tervezünk és építünk. Magánszemélyeknek és kisvállalkozásoknak. Pozsonyból.",
    "home.now": "Most",
    "home.client": "Ügyfél",
    "home.own": "Egyik saját projektünk",
    "home.dot": "Az egész működés, darabról darabra.",
    "home.comma": "Ugyanaz az alap, saját arc.",
    "home.blink": "Élő kamera olyan helyekre, ahol szem kell.",
    "home.next": "A következő sor bármi lehet.",
    "nav.pages": "Oldalak",
    "nav.home": "Kezdőlap",
    "nav.about": "Rólunk",
    "nav.privacy": "Adatvédelem",
    "home.how": "Hogyan dolgozunk",
    "home.p1": "Amit építünk, az többnyire beszélgetéssel kezdődik, nem specifikációval. Valaki üzletet, műtermet, rendelőt visz, vagy egyszerűen olyan életet él, amelyet kinőttek a körülötte lévő eszközök. Addig hallgatunk, amíg meg nem értjük, milyen egy átlagos nap.",
    "home.p2": "Aztán megépítjük, ami illik. Néha ez egy weboldal. Gyakrabban a mögötte dolgozó csendes gépezet: raktár, amely tudja, mi hol van, dokumentumok, amelyek maguktól iktatódnak, foglalási rendszer, egy kis privát alkalmazás egyetlen embernek.",
    "home.p3": "A csapat kicsi, a munka közel marad. Ugyanazok tervezik, írják a kódot, élesítik, és ők jelentkeznek, ha valamit változtatni kell. Semmi sem sablonból jön, és semmi sem marad félbe.",
    "home.p4": "Pozsonyból dolgozunk, szlovákul, angolul és néhány további nyelven, bárhol élő embereknek.",
    "home.services": "Mit jelenthet ez",
    "home.s1": "Weboldalak és webalkalmazások",
    "home.s2": "Belső eszközök és automatizálás",
    "home.s3": "Élő videó és kamerarendszerek",
    "home.s4": "Üzemeltetés és gondozás indulás után",
    "about.title": "Rólunk",
    "about.description": "A SirenVenue s. r. o. kis pozsonyi stúdió. Személyre szabott megoldásokat tervezünk és építünk magánszemélyeknek és kisvállalkozásoknak.",
    "about.h1": "Kis stúdió. Széles látókör.",
    "about.p1": "A SirenVenue szlovák cég, 2024-ben alapították, székhelye Pozsony. Nem kötődünk egyetlen termékhez vagy iparághoz sem. Minden projekt saját formát kap.",
    "about.p2": "Jelenleg a DOT. Gallery és a COMMA gallery számára dolgozunk, és több saját projektet is viszünk, köztük a BlinkLive-ot. Hogy mi jön ezután, attól függ, ki lép be az ajtón.",
    "about.p3": "Azok a részek fontosak nekünk, amelyeket senki sem lát: mi történik, ha elmegy a hálózat, ki fér hozzá az adatokhoz, hogyan bírja a zsúfolt napokat, mennyire könnyű egy év múlva változtatni rajta.",
    "about.company": "Cég",
    "legal.name": "Név",
    "legal.seat": "Székhely",
    "legal.register": "Nyilvántartás",
    "legal.email": "E-mail",
    "privacy.title": "Adatvédelem",
    "privacy.description": "Hogyan kezeli a SirenVenue s. r. o. a személyes adatokat a sirenvenue.sk oldalon.",
    "privacy.h1": "Adatvédelmi tájékoztató",
    "privacy.updated": "2026. október 15-i változat",
    "privacy.controller.h": "Ki az adatkezelő",
    "privacy.controller": "Az adatkezelő az alább megnevezett cég. Az adataival kapcsolatos kérdéseit küldje az alábbi e-mail-címre.",
    "privacy.data.h": "Milyen adatok",
    "privacy.data": "Ezen az oldalon nincs űrlap, nyilvános fiók és harmadik féltől származó analitika. Ha e-mailt ír nekünk, a címét és az üzenetét a válaszadáshoz kezeljük. Minden látogatáskor a szerver röviden naplóz technikai adatokat, például a kérés idejét és a böngésző típusát. Saját rendszereink soha nem tárolják az IP-címét. A visszaélések ellen csak annak egyirányú hash-ét használjuk.",
    "privacy.cookies.h": "Sütik",
    "privacy.cookies": "Csak az oldal működéséhez szükséges sütiket használjuk. A „locale” süti megjegyzi a választott nyelvet. Az „sv_admin” süti csak az adminisztrációba való bejelentkezéskor jön létre. Nincs reklám- vagy követő süti.",
    "privacy.basis.h": "Jogalap",
    "privacy.basis": "Az e-mailjére adott válasz jogos érdekünk és egy esetleges szerződés előtti lépés (GDPR 6. cikk (1) b) és f) pont). A technikai naplók és a visszaélés elleni védelem a biztonságos működéshez fűződő jogos érdekünk (GDPR 6. cikk (1) f) pont).",
    "privacy.retention.h": "Meddig",
    "privacy.retention": "Az e-maileket addig őrizzük, amíg a beszélgetéshez vagy szerződéshez szükségesek, utána töröljük őket, hacsak jogszabály hosszabb megőrzést nem ír elő. A technikai naplók rövid idő után automatikusan törlődnek.",
    "privacy.processors.h": "Ki más",
    "privacy.processors": "Az oldal a Vercel infrastruktúráján fut (frankfurti régió, EU), hosztolt adatbázissal. Ezek a szolgáltatók csak a mi utasításaink szerint kezelnek adatot. Ha adat elhagyja az EU-t, a továbbítás általános szerződési feltételeken alapul. Adatot soha nem adunk el és nem osztunk meg marketingcélra.",
    "privacy.rights.h": "Az Ön jogai",
    "privacy.rights": "Joga van adataihoz hozzáférni, azokat helyesbíteni, töröltetni, kezelésüket korlátozni, hordozni, és joga van tiltakozni. Elég írnia nekünk. Panasszal a Szlovák Köztársaság Személyesadat-védelmi Hivatalához is fordulhat (dataprotection.gov.sk).",
  },
  cs: {
    skip: "Přeskočit na hlavní obsah",
    colophon: "Řešení na míru pro lidi a malé firmy.",
    "nav.language": "Jazyk",
    "notFound.lead": "Na této adrese nic není.",
    "notFound.note":
      "Odkaz je zastaralý, nebo nikdy nebyl náš. Každý produkt, který vydáváme, odkazuje zpět na sirenvenue.sk. Tohle je ta stránka.",
    "home.lead": "Každý úkol je jiný. I odpověď.",
    "home.identity": "Navrhujeme a stavíme moderní řešení na míru. Pro jednotlivce i malé firmy. Z Bratislavy.",
    "home.now": "Teď",
    "home.client": "Klient",
    "home.own": "Jeden z našich projektů",
    "home.dot": "Celý provoz, kousek po kousku.",
    "home.comma": "Stejný základ, vlastní tvář.",
    "home.blink": "Živá kamera pro místa, která potřebují oči.",
    "home.next": "Další řádek může být cokoli.",
    "nav.pages": "Stránky",
    "nav.home": "Domů",
    "nav.about": "O nás",
    "nav.privacy": "Ochrana soukromí",
    "home.how": "Jak pracujeme",
    "home.p1": "Většina toho, co stavíme, nezačíná zadáním, ale rozhovorem. Někdo vede obchod, ateliér, praxi nebo jen život, který přerostl nástroje kolem sebe. Posloucháme, dokud nerozumíme, jak vypadá běžný den.",
    "home.p2": "Pak postavíme to, co sedí. Někdy je to web. Častěji tichá mašinérie za ním: sklad, který ví, kde co je, dokumenty, které se založí samy, rezervace, malá soukromá aplikace pro jednoho člověka.",
    "home.p3": "Tým je malý a práce zůstává blízko. Titíž lidé ji navrhnou, napíšou kód, spustí ji a ozvou se, když je třeba něco změnit. Nic není ze šablony a nic nezůstane napůl.",
    "home.p4": "Pracujeme z Bratislavy, slovensky, anglicky a v několika dalších jazycích, pro lidi kdekoli.",
    "home.services": "Co to může znamenat",
    "home.s1": "Weby a webové aplikace",
    "home.s2": "Interní nástroje a automatizace",
    "home.s3": "Živé video a kamerové systémy",
    "home.s4": "Hosting a péče po spuštění",
    "about.title": "O nás",
    "about.description": "SirenVenue s. r. o. je malé studio z Bratislavy. Navrhujeme a stavíme řešení na míru pro jednotlivce a malé firmy.",
    "about.h1": "Malé studio. Široký záběr.",
    "about.p1": "SirenVenue je slovenská společnost, založená v roce 2024, se sídlem v Bratislavě. Nejsme vázáni na jeden produkt ani jedno odvětví. Každý projekt dostane vlastní tvar.",
    "about.p2": "Teď pracujeme s DOT. Gallery a COMMA gallery a vedeme několik vlastních projektů, mezi nimi BlinkLive. Co přijde dál, závisí na tom, kdo přijde.",
    "about.p3": "Záleží nám na částech, které nikdo nevidí: co se stane, když vypadne síť, kdo se dostane k datům, jak to vydrží v rušný den, jak snadno se to dá za rok změnit.",
    "about.company": "Firma",
    "legal.name": "Název",
    "legal.seat": "Sídlo",
    "legal.register": "Zápis",
    "legal.email": "E-mail",
    "privacy.title": "Ochrana osobních údajů",
    "privacy.description": "Jak SirenVenue s. r. o. zpracovává osobní údaje na sirenvenue.sk.",
    "privacy.h1": "Ochrana osobních údajů",
    "privacy.updated": "Verze z 15. října 2026",
    "privacy.controller.h": "Kdo údaje zpracovává",
    "privacy.controller": "Správcem je společnost uvedená níže. S dotazy k vašim údajům nám napište na uvedený e-mail.",
    "privacy.data.h": "Jaké údaje",
    "privacy.data": "Tato stránka nemá formuláře, veřejné účty ani analytiku třetích stran. Když nám napíšete e-mail, zpracováváme vaši adresu a obsah zprávy, abychom mohli odpovědět. Při návštěvě server krátce zaznamená technické údaje, například čas požadavku a typ prohlížeče. Naše vlastní systémy vaši IP adresu neukládají, k ochraně před zneužitím používáme jen její jednosměrný hash.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Používáme jen cookies, které stránka potřebuje. Cookie „locale“ si pamatuje zvolený jazyk. Cookie „sv_admin“ se nastaví jen při přihlášení do administrace. Žádné reklamní ani sledovací cookies.",
    "privacy.basis.h": "Právní základ",
    "privacy.basis": "Odpověď na váš e-mail je náš oprávněný zájem a krok před případnou smlouvou (čl. 6 odst. 1 písm. b) a f) GDPR). Technické záznamy a ochrana před zneužitím jsou náš oprávněný zájem na bezpečném provozu (čl. 6 odst. 1 písm. f) GDPR).",
    "privacy.retention.h": "Jak dlouho",
    "privacy.retention": "E-maily uchováváme, dokud jsou potřeba pro komunikaci nebo smlouvu, potom je smažeme, pokud zákon nevyžaduje delší uchování. Technické záznamy se mažou automaticky po krátké době.",
    "privacy.processors.h": "Kdo další",
    "privacy.processors": "Stránka běží na infrastruktuře Vercel (region Frankfurt, EU) s databází u poskytovatele hostingu. Tito dodavatelé zpracovávají údaje jen podle našich pokynů. Pokud údaje opustí EU, přenos se opírá o standardní smluvní doložky. Údaje neprodáváme ani nesdílíme pro marketing.",
    "privacy.rights.h": "Vaše práva",
    "privacy.rights": "Máte právo na přístup ke svým údajům, jejich opravu, výmaz, omezení zpracování a přenositelnost a právo vznést námitku. Stačí nám napsat. Stížnost můžete podat také Úřadu na ochranu osobních údajů Slovenské republiky (dataprotection.gov.sk).",
  },
  uk: {
    skip: "Перейти до основного вмісту",
    colophon: "Рішення на замовлення для людей і малого бізнесу.",
    "nav.language": "Мова",
    "notFound.lead": "За цією адресою нічого немає.",
    "notFound.note":
      "Посилання застаріло, або ніколи не було нашим. Кожен продукт, який ми випускаємо, веде назад на sirenvenue.sk. Це та сторінка.",
    "home.lead": "Кожне завдання інше. І відповідь теж.",
    "home.identity": "Ми проєктуємо й будуємо сучасні рішення на замовлення. Для людей і малого бізнесу. З Братислави.",
    "home.now": "Зараз",
    "home.client": "Клієнт",
    "home.own": "Один із наших проєктів",
    "home.dot": "Уся робота, крок за кроком.",
    "home.comma": "Та сама основа, власне обличчя.",
    "home.blink": "Жива камера для місць, яким потрібні очі.",
    "home.next": "Наступний рядок може бути будь-чим.",
    "nav.pages": "Сторінки",
    "nav.home": "Головна",
    "nav.about": "Про нас",
    "nav.privacy": "Конфіденційність",
    "home.how": "Як ми працюємо",
    "home.p1": "Більшість того, що ми будуємо, починається з розмови, а не з технічного завдання. Хтось веде крамницю, студію, практику або просто живе життям, яке переросло свої інструменти. Ми слухаємо, доки не зрозуміємо, який вигляд має звичайний день.",
    "home.p2": "Потім будуємо те, що пасує. Іноді це вебсайт. Частіше тиха механіка за ним: склад, який знає, де що лежить, документи, що розкладаються самі, бронювання, маленький приватний застосунок для однієї людини.",
    "home.p3": "Команда невелика, і робота лишається поруч. Ті самі люди її проєктують, пишуть код, запускають і відгукуються, коли щось треба змінити. Нічого не береться з шаблону і нічого не лишається недоробленим.",
    "home.p4": "Ми працюємо з Братислави, словацькою, англійською та кількома іншими мовами, для людей будь-де.",
    "home.services": "Що це може означати",
    "home.s1": "Сайти та вебзастосунки",
    "home.s2": "Внутрішні інструменти та автоматизація",
    "home.s3": "Живе відео та системи камер",
    "home.s4": "Хостинг і супровід після запуску",
    "about.title": "Про нас",
    "about.description": "SirenVenue s. r. o. це мала студія в Братиславі. Ми проєктуємо й будуємо рішення на замовлення для людей і малого бізнесу.",
    "about.h1": "Мала студія. Широкий погляд.",
    "about.p1": "SirenVenue це словацька компанія, заснована 2024 року, з осідком у Братиславі. Ми не прив'язані до одного продукту чи галузі. Кожен проєкт отримує власну форму.",
    "about.p2": "Зараз ми працюємо з DOT. Gallery та COMMA gallery і ведемо кілька власних проєктів, серед них BlinkLive. Що буде далі, залежить від того, хто прийде.",
    "about.p3": "Нам важливі частини, яких ніхто не бачить: що станеться, коли зникне мережа, хто має доступ до даних, як усе витримає напружений день, як легко буде щось змінити за рік.",
    "about.company": "Компанія",
    "legal.name": "Назва",
    "legal.seat": "Юридична адреса",
    "legal.register": "Реєстр",
    "legal.email": "Пошта",
    "privacy.title": "Конфіденційність",
    "privacy.description": "Як SirenVenue s. r. o. обробляє персональні дані на sirenvenue.sk.",
    "privacy.h1": "Захист персональних даних",
    "privacy.updated": "Версія від 15 жовтня 2026",
    "privacy.controller.h": "Хто відповідає",
    "privacy.controller": "Контролер даних це компанія, зазначена нижче. З питаннями щодо ваших даних пишіть на вказану пошту.",
    "privacy.data.h": "Які дані",
    "privacy.data": "На цьому сайті немає форм, публічних акаунтів та аналітики третіх сторін. Коли ви пишете нам, ми обробляємо вашу адресу й повідомлення, щоб відповісти. Під час кожного візиту сервер коротко записує технічні дані, наприклад час запиту й тип браузера. Наші власні системи ніколи не зберігають вашу IP-адресу. Для захисту від зловживань ми використовуємо лише її односторонній хеш.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Ми використовуємо лише ті cookies, які потрібні сайту. Cookie «locale» запам'ятовує вашу мову. Cookie «sv_admin» з'являється лише під час входу до адміністрування. Жодних рекламних чи відстежувальних cookies.",
    "privacy.basis.h": "Правова підстава",
    "privacy.basis": "Відповідь на ваш лист це наш законний інтерес і крок перед можливим договором (ст. 6(1)(b) і (f) GDPR). Технічні журнали й захист від зловживань це наш законний інтерес у безпечній роботі сайту (ст. 6(1)(f) GDPR).",
    "privacy.retention.h": "Як довго",
    "privacy.retention": "Листи ми зберігаємо, доки вони потрібні для розмови чи договору, потім видаляємо, якщо закон не вимагає довшого зберігання. Технічні журнали видаляються автоматично через короткий час.",
    "privacy.processors.h": "Хто ще",
    "privacy.processors": "Сайт працює на інфраструктурі Vercel (регіон Франкфурт, ЄС) з хостингом бази даних. Ці постачальники обробляють дані лише за нашими вказівками. Якщо дані залишають ЄС, передача спирається на стандартні договірні положення. Ми ніколи не продаємо дані й не передаємо їх для маркетингу.",
    "privacy.rights.h": "Ваші права",
    "privacy.rights": "Ви маєте право на доступ, виправлення, видалення, обмеження обробки та перенесення своїх даних, а також право заперечити. Просто напишіть нам. Скаргу можна подати й до Управління із захисту персональних даних Словацької Республіки (dataprotection.gov.sk).",
  },
  ru: {
    skip: "Перейти к основному содержанию",
    colophon: "Решения на заказ для людей и малого бизнеса.",
    "nav.language": "Язык",
    "notFound.lead": "По этому адресу ничего нет.",
    "notFound.note":
      "Ссылка устарела или никогда не была нашей. Каждый продукт, который мы выпускаем, ведёт обратно на sirenvenue.sk. Это та самая страница.",
    "home.lead": "Каждая задача другая. И ответ тоже.",
    "home.identity": "Мы проектируем и создаём современные решения на заказ. Для частных лиц и малого бизнеса. Из Братиславы.",
    "home.now": "Сейчас",
    "home.client": "Клиент",
    "home.own": "Один из наших проектов",
    "home.dot": "Вся работа, шаг за шагом.",
    "home.comma": "Та же основа, своё лицо.",
    "home.blink": "Живая камера для мест, которым нужны глаза.",
    "home.next": "Следующая строка может быть чем угодно.",
    "nav.pages": "Страницы",
    "nav.home": "Главная",
    "nav.about": "О нас",
    "nav.privacy": "Конфиденциальность",
    "home.how": "Как мы работаем",
    "home.p1": "Почти всё, что мы строим, начинается с разговора, а не с технического задания. Кто-то ведёт магазин, студию, практику или просто живёт жизнью, которая переросла свои инструменты. Мы слушаем, пока не поймём, как выглядит обычный день.",
    "home.p2": "Потом строим то, что подходит. Иногда это сайт. Чаще тихая механика за ним: склад, который знает, где что лежит, документы, которые раскладываются сами, бронирование, небольшое частное приложение для одного человека.",
    "home.p3": "Команда маленькая, и работа остаётся рядом. Одни и те же люди её проектируют, пишут код, запускают и откликаются, когда что-то нужно изменить. Ничего не берётся из шаблона и ничего не остаётся недоделанным.",
    "home.p4": "Мы работаем из Братиславы, на словацком, английском и ещё нескольких языках, для людей где угодно.",
    "home.services": "Что это может значить",
    "home.s1": "Сайты и веб-приложения",
    "home.s2": "Внутренние инструменты и автоматизация",
    "home.s3": "Живое видео и системы камер",
    "home.s4": "Хостинг и поддержка после запуска",
    "about.title": "О нас",
    "about.description": "SirenVenue s. r. o. это небольшая студия в Братиславе. Мы проектируем и создаём решения на заказ для частных лиц и малого бизнеса.",
    "about.h1": "Маленькая студия. Широкий взгляд.",
    "about.p1": "SirenVenue это словацкая компания, основанная в 2024 году, с юридическим адресом в Братиславе. Мы не привязаны к одному продукту или отрасли. Каждый проект получает свою форму.",
    "about.p2": "Сейчас мы работаем с DOT. Gallery и COMMA gallery и ведём несколько собственных проектов, среди них BlinkLive. Что будет дальше, зависит от того, кто придёт.",
    "about.p3": "Нам важны части, которых никто не видит: что будет, если пропадёт сеть, кто получит доступ к данным, как всё выдержит напряжённый день, насколько легко будет что-то изменить через год.",
    "about.company": "Компания",
    "legal.name": "Название",
    "legal.seat": "Юридический адрес",
    "legal.register": "Реестр",
    "legal.email": "Почта",
    "privacy.title": "Конфиденциальность",
    "privacy.description": "Как SirenVenue s. r. o. обрабатывает персональные данные на sirenvenue.sk.",
    "privacy.h1": "Защита персональных данных",
    "privacy.updated": "Версия от 15 октября 2026",
    "privacy.controller.h": "Кто отвечает",
    "privacy.controller": "Оператор данных это компания, указанная ниже. С вопросами о ваших данных пишите на указанную почту.",
    "privacy.data.h": "Какие данные",
    "privacy.data": "На этом сайте нет форм, публичных аккаунтов и аналитики третьих сторон. Когда вы пишете нам, мы обрабатываем ваш адрес и сообщение, чтобы ответить. При каждом визите сервер кратко записывает технические данные, например время запроса и тип браузера. Наши собственные системы никогда не хранят ваш IP-адрес. Для защиты от злоупотреблений мы используем только его односторонний хеш.",
    "privacy.cookies.h": "Cookies",
    "privacy.cookies": "Мы используем только те cookies, которые нужны сайту. Cookie «locale» запоминает ваш язык. Cookie «sv_admin» появляется только при входе в администрирование. Никаких рекламных или отслеживающих cookies.",
    "privacy.basis.h": "Правовое основание",
    "privacy.basis": "Ответ на ваше письмо это наш законный интерес и шаг перед возможным договором (ст. 6(1)(b) и (f) GDPR). Технические журналы и защита от злоупотреблений это наш законный интерес в безопасной работе сайта (ст. 6(1)(f) GDPR).",
    "privacy.retention.h": "Как долго",
    "privacy.retention": "Письма мы храним, пока они нужны для переписки или договора, затем удаляем, если закон не требует более долгого хранения. Технические журналы удаляются автоматически через короткое время.",
    "privacy.processors.h": "Кто ещё",
    "privacy.processors": "Сайт работает на инфраструктуре Vercel (регион Франкфурт, ЕС) с размещённой базой данных. Эти поставщики обрабатывают данные только по нашим указаниям. Если данные покидают ЕС, передача опирается на стандартные договорные положения. Мы никогда не продаём данные и не передаём их для маркетинга.",
    "privacy.rights.h": "Ваши права",
    "privacy.rights": "Вы имеете право на доступ, исправление, удаление, ограничение обработки и перенос своих данных, а также право возразить. Просто напишите нам. Жалобу можно подать и в Управление по защите персональных данных Словацкой Республики (dataprotection.gov.sk).",
  },
};

/**
 * Locales in canonical order, derived from the catalog literal. Typed as
 * `Locale` because `catalog` is a `Record<Locale, …>`, so this is exhaustive.
 */
export const messageLocales = Object.keys(catalog) as Locale[];

/** A key a locale intentionally does not carry. Rendered as nothing, never English. */
export type DeclaredMissing = {
  locale: Locale;
  key: MessageKey;
};

/**
 * Keys that are deliberately not translated for a locale. Empty today: every
 * locale carries a draft of every key. When a surface ships a label that no
 * translator can vouch for in a given language, name it here and the gate stays
 * honest instead of failing - or worse, falling back to English.
 */
export const declaredMissing: readonly DeclaredMissing[] = [];

/** True when `(locale, key)` is an explicit, accepted omission. */
export function isDeclaredMissing(locale: Locale, key: MessageKey): boolean {
  return declaredMissing.some(
    (entry) => entry.locale === locale && entry.key === key,
  );
}

/**
 * Values a placeholder can be filled with. The catalog carries exactly one
 * placeholder, `{count}`; a value is a template, never a formatted number.
 */
export type MessageParams = {
  count?: number;
};

/**
 * Fill a message template's placeholders. The only placeholder is `{count}`,
 * replaced with `params.count`. A placeholder with no value collapses to the
 * empty string rather than leaking `{count}` to the page. Placeholders are never
 * translated; only the words around them are.
 */
export function format(value: string, params: MessageParams = {}): string {
  return value.replace(/\{count\}/g, () =>
    params.count === undefined ? "" : String(params.count),
  );
}

/**
 * Resolve one message for one locale. Returns the formatted value, or `null`
 * when the key is missing or declared missing. It never falls back to another
 * locale.
 *
 * This is the documented render policy: `null` means the caller renders
 * nothing - not English, not Slovak, not a placeholder. A declaration beats a
 * stale value: if `(locale, key)` is declared missing, nothing is returned even
 * if a value is still present.
 */
export function message(
  locale: Locale,
  key: MessageKey,
  params: MessageParams = {},
): string | null {
  if (isDeclaredMissing(locale, key)) return null;
  const value = catalog[locale]?.[key];
  return typeof value === "string" && value.length > 0
    ? format(value, params)
    : null;
}

/** A flattened row shaped exactly like the `Message` table. */
export type MessageRow = {
  key: MessageKey;
  locale: Locale;
  value: string;
  reviewed: boolean;
};

/**
 * `sk` and `en` are authored by the project and count as reviewed; the other
 * seven locales are drafts that a human who reads the language must still
 * approve.
 */
function isReviewed(locale: Locale): boolean {
  return locale === "sk" || locale === "en";
}

/**
 * Every present value as a seedable row, in canonical order. Declared-missing
 * entries produce no row - their absence in the table is the declaration.
 */
export function messageRows(): MessageRow[] {
  const rows: MessageRow[] = [];
  for (const locale of messageLocales) {
    for (const key of messageKeys) {
      const value = catalog[locale]?.[key];
      if (typeof value !== "string" || value.length === 0) continue;
      rows.push({ key, locale, value, reviewed: isReviewed(locale) });
    }
  }
  return rows;
}
