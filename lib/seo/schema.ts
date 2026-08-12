const SITE_URL = "https://techspirex.com";

/**
 * A single, stable @id for the organization so every other schema node
 * (LocalBusiness, Service.provider, Article.publisher) can reference the same
 * entity instead of describing a new one. This is what lets Google build one
 * coherent knowledge-graph node for Techspirex rather than several fragments.
 */
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Techspirex",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-mark.svg`,
    image: `${SITE_URL}/logo-mark.svg`,
    email: "info@techspirex.com",
    description:
      "Techspirex is a product engineering studio building web systems, AI automation, design, DevOps, marketing, and ecommerce for founders and teams worldwide. Headquartered in Lahore, Pakistan.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Park View Society",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    sameAs: ["https://linkedin.com/company/techspirex/", "https://facebook.com/techspirex"],
  };
}

/**
 * ProfessionalService (a LocalBusiness subtype) is the schema that surfaces a
 * firm for "web development agency in Lahore"-style local + commercial queries.
 * It carries geo, service area, contact points, and price range - the fields
 * Google's local ranking systems actually read.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: "Techspirex",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-mark.svg`,
    image: `${SITE_URL}/logo-mark.svg`,
    email: "info@techspirex.com",
    telephone: "+92 371 4156567",
    priceRange: "$$",
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Park View Society",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Pakistan" },
      { "@type": "AdministrativeArea", name: "European Union" },
    ],
    knowsAbout: [
      "Web development",
      "SaaS development",
      "AI automation",
      "UI/UX design",
      "DevOps",
      "Cloud infrastructure",
      "Ecommerce development",
      "Digital marketing",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "info@techspirex.com",
        telephone: "+44 7708 626539",
        areaServed: ["US", "GB", "EU"],
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+92 371 4156567",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
    ],
    sameAs: ["https://linkedin.com/company/techspirex/", "https://facebook.com/techspirex"],
  };
}

/**
 * WebSite node - establishes the site as a distinct entity and declares the
 * site search endpoint, which is a prerequisite for a Google sitelinks
 * search box.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Techspirex",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/insights?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE_URL}${path}`,
    provider: { "@type": "Organization", "@id": ORG_ID, name: "Techspirex", url: SITE_URL },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "AdministrativeArea", name: "European Union" },
    ],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * FAQPage schema - makes a page eligible for FAQ rich results and, just as
 * importantly, captures the long-tail question queries ("is it safe to hire
 * an offshore dev team", "how much does a SaaS build cost") that a young firm
 * can realistically rank for before it has domain authority for the head terms.
 */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
