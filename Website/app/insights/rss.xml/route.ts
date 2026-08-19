import { getAllInsights } from "@/lib/content/insights";
import { cdata, escapeXml } from "@/lib/seo/xml";

const SITE_URL = "https://techspirex.com";

// Regenerate at most hourly instead of re-reading the filesystem on every hit.
export const revalidate = 3600;

export async function GET() {
  const insights = getAllInsights();

  const items = insights
    .map((insight) => {
      const url = escapeXml(`${SITE_URL}/insights/${encodeURIComponent(insight.slug)}`);
      // An unparseable date renders as "Invalid Date"; fall back to now so one
      // bad frontmatter value cannot poison the whole feed.
      const published = new Date(insight.publishedAt);
      const pubDate = (Number.isNaN(published.getTime()) ? new Date() : published).toUTCString();

      return `
    <item>
      <title>${cdata(insight.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdata(insight.summary)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Techspirex Insights</title>
    <link>${SITE_URL}/insights</link>
    <description>Engineering and delivery notes from the Techspirex team.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
