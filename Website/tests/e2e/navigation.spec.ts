import { test, expect } from "@playwright/test";

// The marketing header deliberately keeps the compact dialog navigation
// through tablet widths; the full primary nav starts at Tailwind's lg
// breakpoint to avoid a cramped 768px header.
const desktopProjects = ["desktop-1440"];

test("primary navigation links all resolve", async ({ page }, testInfo) => {
  test.skip(!desktopProjects.includes(testInfo.project.name), "Desktop nav is hidden below md breakpoint.");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  const links = await nav.getByRole("link").all();
  expect(links.length).toBeGreaterThan(0);

  for (const link of links) {
    const href = await link.getAttribute("href");
    if (!href || href.startsWith("http")) continue;
    const response = await page.request.get(href);
    expect(response.ok(), `${href} should resolve`).toBeTruthy();
  }
});

test("services dropdown opens via keyboard and closes on Escape", async ({ page }, testInfo) => {
  test.skip(!desktopProjects.includes(testInfo.project.name), "Desktop services menu is hidden below md breakpoint.");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Services" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const servicesPanel = page.getByRole("link", { name: "All services", exact: true });
  await expect(servicesPanel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(servicesPanel).toBeHidden();
});

test("mobile menu opens via the hamburger button and all links resolve", async ({ page }, testInfo) => {
  test.skip(desktopProjects.includes(testInfo.project.name), "Mobile menu button is hidden at md and above.");
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav).toBeVisible();

  const links = await mobileNav.getByRole("link").all();
  expect(links.length).toBeGreaterThan(0);
  const hrefs = (await Promise.all(links.map((link) => link.getAttribute("href")))).filter(Boolean) as string[];
  const responses = await Promise.all(hrefs.map((href) => page.request.get(href)));
  responses.forEach((response, index) => expect(response.ok(), `${hrefs[index]} should resolve`).toBeTruthy());

  await page.getByRole("button", { name: /close menu/i }).click();
  await expect(mobileNav).toBeHidden();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: /skip to main content/i });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});
