import { headers } from "next/headers";

/*
  The single place structured data is written into the document.

  Two things went wrong when each call site hand-rolled this (audit D1-5, D1-7):

  1. `JSON.stringify` does not escape `<`, so a `</script>` anywhere in a string
     field closes the tag early and everything after it is parsed as HTML. The
     data is repository-authored today, but lib/content/mdx.ts documents a
     planned move to a CMS - at which point that is stored XSS. Escaping the
     three sequences that matter as JSON unicode escapes keeps the JSON
     semantically identical while making tag breakout impossible.

  2. Half the call sites forgot the CSP nonce, so proxy.ts's production policy
     (script-src with no 'unsafe-inline') silently blocked them and the
     structured data never reached crawlers. Sourcing the nonce here means a
     call site cannot forget it.

  Note on scope: this is for `application/ld+json` only, which browsers parse as
  data and never as JavaScript. It deliberately does not handle the JS-specific
  hazards (U+2028/U+2029 line terminators) that would matter if you were
  inlining JSON into an executable <script>. Do not reuse it for that.
*/

/** Serialize for embedding in a <script> body. Never produces `<`, `>` or `&`. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export async function JsonLd({ data }: { data: unknown }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
