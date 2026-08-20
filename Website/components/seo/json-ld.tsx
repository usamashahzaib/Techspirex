/*
  The single place structured data is written into the document.

  Two things went wrong when each call site hand-rolled this (audit D1-5, D1-7):

  1. `JSON.stringify` does not escape `<`, so a `</script>` anywhere in a string
     field closes the tag early and everything after it is parsed as HTML. The
     data is repository-authored today, but lib/content/mdx.ts documents a
     planned move to a CMS - at which point that is stored XSS. Escaping the
     three sequences that matter as JSON unicode escapes keeps the JSON
     semantically identical while making tag breakout impossible.

  2. Half the call sites forgot the CSP nonce, so the old per-request policy
     (script-src with no 'unsafe-inline') silently blocked them and the
     structured data never reached crawlers. The nonce is gone now - the site
     prerenders statically and the CSP is static too (see next.config.ts) - but
     centralizing emission here is what stops that class of bug recurring.

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

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
