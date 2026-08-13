import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "../../components/seo/json-ld";

describe("serializeJsonLd", () => {
  /*
    The core regression: JSON.stringify leaves `<` untouched, so a `</script>`
    in any string field closes the tag and everything after it becomes HTML.
  */
  it("neutralises a </script> breakout", () => {
    const out = serializeJsonLd({
      "@type": "Article",
      headline: "Pwned</script><img src=x onerror=alert(1)>",
    });

    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    expect(out).toContain("\\u003c");
  });

  it("escapes every character that can start markup", () => {
    const out = serializeJsonLd({ v: "<>&" });
    expect(out).toBe('{"v":"\\u003c\\u003e\\u0026"}');
    expect(out).not.toMatch(/[<>&]/);
  });

  /*
    Escaping must be lossless: crawlers parse this as JSON, so the decoded value
    has to be byte-identical to the input or we have silently corrupted the
    structured data we are trying to publish.
  */
  it("round-trips to the identical object", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      name: "Q & A <with> \"quotes\" and 'apostrophes'",
      nested: { list: ["a<b", "c&d", "e>f"], n: 42, ok: true, missing: null },
    };

    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });

  it("leaves ordinary structured data unchanged", () => {
    const data = { "@type": "Organization", name: "Techspirex" };
    expect(serializeJsonLd(data)).toBe(JSON.stringify(data));
  });

  it("escapes inside keys as well as values", () => {
    const out = serializeJsonLd({ "</script>": 1 });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toEqual({ "</script>": 1 });
  });

  it("handles arrays at the top level", () => {
    const out = serializeJsonLd([{ a: "<b>" }]);
    expect(out).not.toMatch(/[<>]/);
    expect(JSON.parse(out)).toEqual([{ a: "<b>" }]);
  });
});
