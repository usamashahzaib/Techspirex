/*
  XML escaping for hand-built feeds (audit D1-4).

  The RSS route previously interpolated content straight into `<![CDATA[...]]>`
  and into element text. CDATA is not an escape mechanism - it is a *delimiter*,
  and the one sequence it cannot contain is its own terminator, so a `]]>` in a
  title or summary closes the section early and everything after it is parsed as
  markup. Element text interpolated raw has the same problem with `&` and `<`.

  Today the source is repository-authored MDX, so this is a content-integrity
  and feed-validity issue rather than a live injection. It becomes a real
  injection the moment content comes from a CMS, which is an explicitly planned
  migration (see lib/content/mdx.ts) - so escape at the boundary now.
*/

/** Escape a value for use as XML element text or an attribute value. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/*
  XML 1.0 forbids most control characters outright; a stray \x00-\x08 makes the
  whole feed unparseable, so strip them rather than emit a broken document.
*/
const INVALID_XML_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

/**
 * Wrap a value in CDATA safely. A literal `]]>` inside the payload is split
 * across two CDATA sections - the standard idiom - so it can never terminate
 * the section it appears in.
 */
export function cdata(value: string): string {
  const safe = value.replace(INVALID_XML_CHARS, "").split("]]>").join("]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}
