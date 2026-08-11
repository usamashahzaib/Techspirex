import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllInsights } from "@/lib/content/insights";

const SITE_URL = "https://techspirex.com";

// A stable release date for static pages. Using `new Date()` here would stamp
// every static route as "changed" on every crawl, training crawlers to ignore
// our lastmod signal (docs/DEEP-AUDIT M-6). Bump this only when the static
// pages genuinely change.
const STATIC_LASTMOD = new Date("2026-08-11");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.values(routes).map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: STATIC_LASTMOD,
  }));

  const caseStudyRoutes = getAllCaseStudies().map((study) => ({
    url: `${SITE_URL}/work/${study.slug}`,
    lastModified: new Date(study.publishedAt),
  }));

  const insightRoutes = getAllInsights().map((insight) => ({
    url: `${SITE_URL}/insights/${insight.slug}`,
    lastModified: new Date(insight.updatedAt ?? insight.publishedAt),
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...insightRoutes];
}
