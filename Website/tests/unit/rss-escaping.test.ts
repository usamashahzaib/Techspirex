import { describe, expect, it, vi } from "vitest";
import { cdata, escapeXml } from "../../lib/seo/xml";

describe("escapeXml", () => {
  it("escapes the five XML metacharacters", () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;"
    );
  });

  it("escapes & first so entities are not double-broken", () => {
    expect(escapeXml("a & <b>")).toBe("a &amp; &lt;b&gt;");
    expect(escapeXml("&amp;")).toBe("&amp;amp;");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeXml("Shipping a design system")).toBe("Shipping a design system");
  });
});

/*
  Read a run of adjacent CDATA sections the way a parser would, and return the
  text it yields - or throw if anything lands *outside* a section, which is
  exactly what a successful breakout looks like. Asserting on the parsed text
  (rather than on the raw string) is the real property: the split idiom must
  emit an interior `]]>`, so "contains no ]]>" would be the wrong invariant.
*/
function parseCdataRun(input: string): string {
  let rest = input;
  let text = "";

  while (rest.length > 0) {
    if (!rest.startsWith("<![CDATA[")) {
      throw new Error(`escaped CDATA at: ${JSON.stringify(rest.slice(0, 40))}`);
    }
    const end = rest.indexOf("]]>", "<![CDATA[".length);
    if (end === -1) throw new Error("unterminated CDATA section");
    text += rest.slice("<![CDATA[".length, end);
    rest = rest.slice(end + "]]>".length);
  }

  return text;
}

describe("cdata", () => {
  it("wraps ordinary text", () => {
    expect(cdata("hello")).toBe("<![CDATA[hello]]>");
  });

  /*
    The core regression: `]]>` is the one sequence CDATA cannot contain. Left
    raw it terminates the section early and everything after it is parsed as
    markup - a feed-reader-side injection.
  */
  it("neutralises a CDATA breakout", () => {
    const payload = "safe]]><script>alert(1)</script><![CDATA[";
    const out = cdata(payload);

    // Nothing escapes into markup position, and the payload survives verbatim
    // as inert text.
    expect(parseCdataRun(out)).toBe(payload);
  });

  it("handles repeated breakout attempts", () => {
    expect(parseCdataRun(cdata("]]>]]>]]>"))).toBe("]]>]]>]]>");
  });

  it("handles a payload that is only a terminator", () => {
    expect(parseCdataRun(cdata("]]>"))).toBe("]]>");
  });

  it("strips control characters that would make the document unparseable", () => {
    expect(cdata("a\x00b\x08c")).toBe("<![CDATA[abc]]>");
  });

  it("preserves legal whitespace", () => {
    expect(cdata("line\nnext\ttab\r\n")).toBe("<![CDATA[line\nnext\ttab\r\n]]>");
  });
});

/*
  End-to-end check on the actual route, with the content layer stubbed so we can
  feed it hostile frontmatter.
*/
vi.mock("../../lib/content/insights", () => ({
  getAllInsights: () => [
    {
      slug: "normal-post",
      title: "A & B <are> fine",
      summary: "Summary with an ampersand & a <tag>",
      publishedAt: "2026-01-15",
    },
    {
      slug: "hostile-post",
      title: "Breakout]]><injected/>",
      summary: "Also]]><injected/>",
      publishedAt: "not-a-real-date",
    },
  ],
}));

describe("GET /insights/rss.xml", () => {
  it("emits a feed no interpolated value can break out of", async () => {
    const { GET } = await import("../../app/insights/rss.xml/route");
    const xml = await (await GET()).text();

    // No injected element ever reaches markup position: every `]]>` in the body
    // is one we emitted to close a section we opened.
    expect(xml).not.toContain("]]><injected/>");
    expect(xml.match(/<!\[CDATA\[/g)?.length).toBe(xml.match(/\]\]>/g)?.length);

    // Raw metacharacters in element text are escaped. (`<` is excluded from the
    // class because it legitimately begins the closing </link> tag.)
    expect(xml).toContain("<link>https://techspirex.com/insights/normal-post</link>");
    expect(xml).not.toMatch(/<link>[^<]*[&>]/);
    expect(xml).not.toMatch(/<guid[^>]*>[^<]*[&>]/);

    // A malformed date degrades to a valid one instead of "Invalid Date".
    expect(xml).not.toContain("Invalid Date");
    expect(xml.match(/<pubDate>/g)?.length).toBe(2);
  });

  it("serves the feed with the right content type", async () => {
    const { GET } = await import("../../app/insights/rss.xml/route");
    const res = await GET();
    expect(res.headers.get("Content-Type")).toBe("application/xml; charset=utf-8");
  });
});
