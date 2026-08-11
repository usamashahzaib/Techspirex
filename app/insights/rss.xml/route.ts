import { getAllInsights } from "@/lib/content/insights";

const SITE_URL = "https://techspirex.com";

export async function GET() {
  const insights = getAllInsights();

  const items = insights
    .map(
      (insight) => `
    <item>
      <title><![CDATA[${insight.title}]]></title>
      <link>${SITE_URL}/insights/${insight.slug}</link>
      <guid>${SITE_URL}/insights/${insight.slug}</guid>
      <pubDate>${new Date(insight.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${insight.summary}]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TechSpireX Insights</title>
    <link>${SITE_URL}/insights</link>
    <description>Engineering and delivery notes from the TechSpireX team.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
