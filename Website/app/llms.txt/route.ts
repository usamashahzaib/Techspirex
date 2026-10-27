import { allServices } from "@/content/services";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllInsights } from "@/lib/content/insights";
import { SITE_URL } from "@/lib/env";
import { insightItem, routes, siteContact, workItem } from "@/lib/routes";

export const dynamic = "force-static";

// Everything here is read from the same content files the site renders, so the
// file cannot claim a service, case study or article the site does not show.
export function GET() {
  const staffAugmentation = allServices.find((service) => service.slug === "staff-augmentation");

  const body = [
    "# Techspirex",
    "",
    "> Techspirex is a software development company in Lahore, Pakistan. It builds web products, SaaS, AI automation, cloud infrastructure and ecommerce for clients in the US, UK and EU, and supplies dedicated developers and teams.",
    "",
    `- Website: ${SITE_URL}`,
    `- Email: ${siteContact.email}`,
    `- Location: ${siteContact.address}`,
    `- Contact page: ${SITE_URL}${routes.contact}`,
    "- Pricing: not published. Monthly capacity, duration and notice are agreed before work starts.",
    "",
    "## Services",
    "",
    ...allServices.map((service) => `- [${service.name}](${SITE_URL}${routes.services}/${service.slug}): ${service.heroSummary}`),
    "",
    ...(staffAugmentation
      ? [
          "## Ways to engage a dedicated team",
          "",
          ...staffAugmentation.scope.map((item) => `- ${item.model}: ${item.detail}`),
          "",
        ]
      : []),
    "## Work",
    "",
    "Outcome type tells you how to read each entry. A concept build is a self-initiated project, not a client result.",
    "",
    ...getAllCaseStudies().map((study) => `- [${study.title}](${SITE_URL}${workItem(study.slug)}) (${study.outcomeType}): ${study.summary}`),
    "",
    "## Insights",
    "",
    ...getAllInsights().map((insight) => `- [${insight.title}](${SITE_URL}${insightItem(insight.slug)})`),
    "",
    "## Sitemap",
    "",
    `- ${SITE_URL}/sitemap.xml`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
