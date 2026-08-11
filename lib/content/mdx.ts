import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

/*
  Minimal local-MDX content adapter (per docs/CONTENT-STRATEGY.md: MDX now,
  swappable to a headless CMS later without route/component changes).
  Directories start empty and stay empty until real, client-approved
  content exists — see content/work/README.md and content/insights/README.md.
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
