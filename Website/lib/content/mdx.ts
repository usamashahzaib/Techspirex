import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

/*
  Minimal local-MDX content adapter (per docs/CONTENT-STRATEGY.md: MDX now,
  swappable to a headless CMS later without route/component changes).
  Directories start empty and stay empty until real, client-approved
  content exists - see content/work/README.md and content/insights/README.md.

  TRUST BOUNDARY (docs/DEEP-AUDIT M-4): rawContent is rendered with
  next-mdx-remote/rsc, which COMPILES AND EXECUTES the MDX as JSX. That is safe
  only because these files are repository-authored (reviewed via PR). If this
  adapter is ever pointed at a headless CMS or any source where non-committers
  can author content, MDX execution becomes a stored-XSS/RCE vector - at that
  point switch untrusted authors to sanitized plain Markdown (remark + rehype-
  sanitize) or a strict allowlist of MDX components. Do not feed untrusted
  content into MDXRemote.
*/
export type ContentMeta<T> = T & {
  slug: string;
  readingTimeMinutes: number;
  rawContent: string;
};

export function readMdxDirectory<T extends Record<string, unknown>>(dir: string): ContentMeta<T>[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const source = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(source);
      return {
        ...(data as T),
        slug,
        readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
        rawContent: content,
      };
    });
}

export function readMdxEntry<T extends Record<string, unknown>>(
  dir: string,
  slug: string
): ContentMeta<T> | null {
  const filePath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);
  return {
    ...(data as T),
    slug,
    readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    rawContent: content,
  };
}
