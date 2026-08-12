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
      "Techspirex is a software development company providing product design, web and SaaS development, AI automation, cloud, QA, ecommerce, growth engineering, and dedicated technical teams worldwide.",
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
      "Software quality assurance",
      "Staff augmentation",
      "Dedicated software teams",
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

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Techspirex",
    publisher: { "@id": ORG_ID },
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

export function serviceCatalogSchema(services: { name: string; slug: string; heroSummary: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Techspirex software development services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.heroSummary,
        url: `${SITE_URL}/services/${service.slug}`,
        provider: { "@id": ORG_ID },
      },
    })),
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
