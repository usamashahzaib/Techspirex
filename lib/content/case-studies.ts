import path from "node:path";
import { readMdxDirectory, readMdxEntry, type ContentMeta } from "./mdx";

export type CaseStudyFrontmatter = {
  title: string;
  clientOrIndustry: string;
  service: string;
  summary: string;
  outcomeType: "measured" | "client-supplied" | "inferred" | "concept";
  outcome: string;
  publishedAt: string;
};

export type CaseStudy = ContentMeta<CaseStudyFrontmatter>;

const CONTENT_DIR = path.join(process.cwd(), "content", "work");

export function getAllCaseStudies(): CaseStudy[] {
  return readMdxDirectory<CaseStudyFrontmatter>(CONTENT_DIR).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  return readMdxEntry<CaseStudyFrontmatter>(CONTENT_DIR, slug);
}
