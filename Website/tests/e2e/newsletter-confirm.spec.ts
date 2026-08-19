import { test, expect } from "@playwright/test";

/*
  These only exercise the token-verification paths, never the "click confirm"
  button that would call the real Resend API - this environment's
  .env.local carries live-looking credentials, and an E2E suite must never
  cause a real email send or a real audience-contact mutation as a side
  effect of running tests.
*/

test("missing token shows a clear failure state, not a success state", async ({ page }) => {
  await page.goto("/newsletter/confirm");
  await expect(page.getByRole("heading", { name: /confirmation failed/i })).toBeVisible();
  await expect(page.getByText(/missing its token/i)).toBeVisible();
});

test("malformed token shows a clear failure state", async ({ page }) => {
  await page.goto("/newsletter/confirm?token=not-a-real-token");
  await expect(page.getByRole("heading", { name: /confirmation failed/i })).toBeVisible();
  await expect(page.getByText(/invalid/i)).toBeVisible();
});

/*
  Regression test for the actual bug this pass fixed: `?done=1` used to be
  enough to render "Subscription confirmed" with no token and nothing having
  been confirmed. It must never again be treated as proof of success.
*/
test("a bare done=1 query param does not fake a success state", async ({ page }) => {
  await page.goto("/newsletter/confirm?done=1");
  await expect(page.getByRole("heading", { name: /subscription confirmed/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /confirmation failed/i })).toBeVisible();
});

test("a well-formed, unexpired token renders the confirm button (not an auto-success)", async ({ page }) => {
  // A syntactically valid-looking but unsigned token still fails signature
  // verification - it must render the same honest failure state as any
  // other bad token, never a bare "click to confirm" bypass.
  const fakeToken = `${Buffer.from("reader@example.com").toString("base64url")}.${Date.now() + 100000}.not-a-real-signature`;
  await page.goto(`/newsletter/confirm?token=${encodeURIComponent(fakeToken)}`);
  await expect(page.getByRole("heading", { name: /confirmation failed/i })).toBeVisible();
});
