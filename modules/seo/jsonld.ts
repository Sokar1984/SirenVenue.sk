import {
  CONTACT_EMAIL,
  FOUNDING_DATE,
  ICO,
  LEGAL_NAME,
  SEAT,
  SITE_URL,
} from "./site";

type PostalAddress = {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
};

type OrganizationNode = {
  "@type": "Organization";
  "@id": string;
  name: string;
  legalName: string;
  alternateName: string;
  url: string;
  logo: { "@type": "ImageObject"; url: string; width: number; height: number };
  image: string;
  email: string;
  taxID: string;
  identifier: { "@type": "PropertyValue"; propertyID: string; value: string };
  foundingDate: string;
  address: PostalAddress;
  areaServed: string;
  contactPoint: {
    "@type": "ContactPoint";
    contactType: string;
    email: string;
    availableLanguage: string[];
  };
};

type WebSiteNode = {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  inLanguage: string[];
  publisher: { "@id": string };
};

/** schema.org graph: one Organization and the WebSite it publishes. */
export type OrganizationJsonLd = {
  "@context": "https://schema.org";
  "@graph": [OrganizationNode, WebSiteNode];
};

/**
 * Machine-readable identity for the company.
 *
 * Only verified facts from `content/legal.ts`: legal name, IČO, registered
 * seat, registration date, domain and contact email. The logo is our own
 * monogram. No `sameAs`: there are no verified social profiles to list, and an
 * invented one is worse than none. No SearchAction: the site has no search.
 */
export function organizationJsonLd(): OrganizationJsonLd {
  const orgId = `${SITE_URL}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "SirenVenue",
        legalName: LEGAL_NAME,
        alternateName: LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/brand/sv-monogram.png`,
          width: 512,
          height: 512,
        },
        image: `${SITE_URL}/sk/opengraph-image`,
        email: CONTACT_EMAIL,
        taxID: ICO,
        identifier: { "@type": "PropertyValue", propertyID: "IČO", value: ICO },
        foundingDate: FOUNDING_DATE,
        address: {
          "@type": "PostalAddress",
          streetAddress: SEAT.street,
          addressLocality: SEAT.city,
          postalCode: SEAT.postalCode,
          addressCountry: SEAT.country,
        },
        areaServed: "SK",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: CONTACT_EMAIL,
          availableLanguage: ["sk", "en"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "SirenVenue",
        inLanguage: ["sk", "en", "de-AT", "es", "hu", "cs", "uk", "ru"],
        publisher: { "@id": orgId },
      },
    ],
  };
}
