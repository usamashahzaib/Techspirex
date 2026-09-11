import { describe, expect, it } from "vitest";
import { pageSocialMetadata } from "../../lib/seo/metadata";
import { SITE_URL } from "../../lib/env";

describe("page social metadata", () => {
  it("identifies the shared page and includes a complete preview", () => {
    const result = pageSocialMetadata("AI automation", "Automation services", "/services/ai-automation");
    expect(result.openGraph).toMatchObject({
      title: "AI automation | Techspirex",
      description: "Automation services",
      url: `${SITE_URL}/services/ai-automation`,
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Techspirex" }],
    });
    expect(result.twitter).toMatchObject({ title: "AI automation | Techspirex", card: "summary_large_image" });
  });
});
