import { env, SITE_URL } from "@/lib/env";

/**
 * IndexNow lets us instantly notify Bing, Yandex, Seznam, and Naver when URLs
 * are added or changed, instead of waiting for a crawl. Google does not consume
 * IndexNow today, so Search Console sitemap submission is still required there.
 *
 * The key is public by design (it is served at `/{key}.txt` to prove ownership),
 * so committing a default is safe. A developer can rotate it by setting
 * INDEXNOW_KEY and renaming the file in `public/` to match.
 */
export const DEFAULT_INDEXNOW_KEY = "19508e750a743d11d13c921771d055b4";

export const INDEXNOW_KEY = env.INDEXNOW_KEY ?? DEFAULT_INDEXNOW_KEY;

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Submit a batch of absolute URLs to IndexNow. Returns the HTTP status, or
 * throws on network failure. Callers decide whether a non-2xx is fatal - a
 * marketing deploy should log and continue, not fail the pipeline.
 */
export async function submitUrls(urls: string[], key: string = INDEXNOW_KEY): Promise<number> {
  const host = new URL(SITE_URL).host;
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${SITE_URL}/${key}.txt`,
      urlList: urls,
    }),
  });
  return response.status;
}
