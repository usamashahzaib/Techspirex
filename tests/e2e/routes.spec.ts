import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/services",
  "/services/web-development",
  "/services/ai-automation",
  "/services/ui-ux-design",
  "/services/devops-cloud",
  "/services/digital-marketing",
  "/services/ecommerce",
  "/work",
  "/about",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
];

for (const route of routes) {
  test(`${route} returns 200, has no console errors, and has no horizontal overflow`, async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    const [scrollWidth, clientWidth] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    expect(consoleErrors, `console errors on ${route}: ${consoleErrors.join(", ")}`).toEqual([]);
  });
}

test("unknown route returns a custom 404 with recovery links", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /doesn't exist/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
});

test("sitemap.xml and robots.txt are served", async ({ page, baseURL }) => {
  const sitemap = await page.request.get(`${baseURL}/sitemap.xml`);
  expect(sitemap.ok()).toBeTruthy();
  const robots = await page.request.get(`${baseURL}/robots.txt`);
  expect(robots.ok()).toBeTruthy();
});
