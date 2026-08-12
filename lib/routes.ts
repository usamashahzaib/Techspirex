export const routes = {
  home: "/",
  services: "/services",
  serviceWebDevelopment: "/services/web-development",
  serviceAiAutomation: "/services/ai-automation",
  serviceUiUxDesign: "/services/ui-ux-design",
  serviceDevopsCloud: "/services/devops-cloud",
  serviceDigitalMarketing: "/services/digital-marketing",
  serviceEcommerce: "/services/ecommerce",
  serviceStaffAugmentation: "/services/staff-augmentation",
  work: "/work",
  about: "/about",
  insights: "/insights",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type RouteKey = keyof typeof routes;

export function workItem(slug: string) {
  return `/work/${slug}`;
}

export function insightItem(slug: string) {
  return `/insights/${slug}`;
}

export const serviceNavItems = [
  { label: "Web development", href: routes.serviceWebDevelopment, flagship: true },
  { label: "AI & automation", href: routes.serviceAiAutomation, flagship: false },
  { label: "UI/UX design", href: routes.serviceUiUxDesign, flagship: false },
  { label: "DevOps & cloud", href: routes.serviceDevopsCloud, flagship: false },
  { label: "Digital marketing", href: routes.serviceDigitalMarketing, flagship: false },
  { label: "Ecommerce", href: routes.serviceEcommerce, flagship: false },
  { label: "Staff augmentation", href: routes.serviceStaffAugmentation, flagship: false },
] as const;

export const primaryNavItems = [
  { label: "Work", href: routes.work },
  { label: "About", href: routes.about },
  { label: "Insights", href: routes.insights },
] as const;

export const footerLegalItems = [
  { label: "Privacy", href: routes.privacy },
  { label: "Terms", href: routes.terms },
] as const;

export const verifiedSocialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/company/techspirex/" },
  { label: "Facebook", href: "https://facebook.com/techspirex" },
] as const;

export const siteContact = {
  email: "info@techspirex.com",
  phoneUk: "+44 7708 626539",
  phonePk: "+92 371 4156567",
  address: "Park View Society, Lahore, Pakistan",
} as const;
