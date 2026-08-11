import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllInsights } from "@/lib/content/insights";

const SITE_URL = "https://techspirex.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.values(routes).map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
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
