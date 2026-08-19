// Submit every live URL to IndexNow (Bing, Yandex, Seznam, Naver).
//
// Run after a production deploy, once the new sitemap is live:
//   node scripts/submit-indexnow.mjs
//
// It reads the deployed sitemap.xml as the single source of truth for URLs, so
// it never drifts from the routes/content the site actually ships. Google is not
// an IndexNow consumer — submit the sitemap in Search Console separately.
//
// Env overrides (optional):
//   SITE_URL       default https://techspirex.com
//   INDEXNOW_KEY   default matches public/<key>.txt committed in the repo

const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://techspirex.com").replace(/\/$/, "");
const KEY = process.env.INDEXNOW_KEY || "19508e750a743d11d13c921771d055b4";
const HOST = new URL(SITE_URL).host;

async function main() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    console.error(`Failed to fetch ${sitemapUrl}: HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  if (urls.length === 0) {
    console.error("No <loc> URLs found in sitemap — nothing to submit.");
    process.exit(1);
  }

  // Verify the key file is reachable before submitting; IndexNow rejects the
  // batch otherwise, and a silent 403 is worse than a loud pre-check.
  const keyRes = await fetch(`${SITE_URL}/${KEY}.txt`);
  if (!keyRes.ok) {
    console.error(`Key file not reachable at ${SITE_URL}/${KEY}.txt (HTTP ${keyRes.status}). Deploy it first.`);
    process.exit(1);
  }

  const submitRes = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList: urls }),
  });

  // 200 = accepted, 202 = accepted/pending. Both are success.
  if (submitRes.ok) {
    console.log(`Submitted ${urls.length} URL(s) to IndexNow (HTTP ${submitRes.status}).`);
  } else {
    console.error(`IndexNow rejected the batch: HTTP ${submitRes.status}`);
    console.error(await submitRes.text());
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("IndexNow submission failed:", err);
  process.exit(1);
});
