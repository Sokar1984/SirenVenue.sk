import {
  CONTACT_EMAIL,
  ICO,
  LEGAL_NAME,
  SEAT,
  SITE_URL,
} from "./site";

/** schema.org `Organization` shape, narrowed to the fields we actually emit. */
export type OrganizationJsonLd = {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  name: string;
  legalName: string;
  url: string;
  taxID: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    contactType: string;
    email: string;
  };
};

/**
 * Machine-readable identity for the company.
 *
 * Uses only the published facts: legal name, IČO, registered seat, domain, and
 * contact email. The email lives under `contactPoint` so consumers can route
 * enquiries without the address being mistaken for a person.
 */
export function organizationJsonLd(): OrganizationJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: LEGAL_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    taxID: ICO,
    address: {
      "@type": "PostalAddress",
      streetAddress: SEAT.street,
      addressLocality: SEAT.city,
      postalCode: SEAT.postalCode,
      addressCountry: SEAT.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAIL,
    },
  };
}
