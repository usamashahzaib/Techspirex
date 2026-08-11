import { test, expect } from "@playwright/test";

test("contact form shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: /send project brief/i }).click();
  // Native required-field validation blocks submission before the server
  // action runs; assert the browser caught it rather than the form
  // silently doing nothing.
  const invalidCount = await page.locator(":invalid").count();
  expect(invalidCount).toBeGreaterThan(0);
});

test("contact form shows a loading state while submitting", async ({ page }) => {
  // The server action normally resolves faster than Playwright can observe
  // the transient pending state, so slow down just the form's POST to make
  // the pending UI reliably observable.
  await page.route("**/contact", async (route) => {
    if (route.request().method() === "POST") {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await route.continue();
  });

  await page.goto("/contact");
  await page.getByLabel("Project type").selectOption("Web development");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Work email").fill("test@example.com");
  await page.getByLabel(/what are you trying to achieve/i).fill("A real project goal, long enough to pass validation.");

  const submit = page.getByRole("button", { name: /send project brief/i });
  await submit.click();
  await expect(page.getByRole("button", { name: /sending/i })).toBeVisible();
});

test("newsletter form validates email", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Email address");
  await input.fill("not-an-email");
  await page.getByRole("button", { name: /subscribe/i }).click();
  const isInvalid = await input.evaluate((el: HTMLInputElement) => !el.validity.valid);
  expect(isInvalid).toBeTruthy();
});
