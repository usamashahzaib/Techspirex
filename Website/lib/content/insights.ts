import path from "node:path";
import { readMdxDirectory, readMdxEntry, type ContentMeta } from "./mdx";

export type InsightFrontmatter = {
  title: string;
  summary: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
};

export type Insight = ContentMeta<InsightFrontmatter>;

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

export function getAllInsights(): Insight[] {
  return readMdxDirectory<InsightFrontmatter>(CONTENT_DIR).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getInsightBySlug(slug: string): Insight | null {
  return readMdxEntry<InsightFrontmatter>(CONTENT_DIR, slug);
}

export function getInsightCategories(): string[] {
  const categories = new Set(getAllInsights().map((insight) => insight.category));
  return Array.from(categories);
}
