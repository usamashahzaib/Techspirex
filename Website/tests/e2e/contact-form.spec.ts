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
  // The server action normally resolves faster than Playwright can observe the
  // transient pending state, so hold the form's POST open while we assert.
  // The hold is released explicitly rather than after a fixed sleep: a timed
  // delay raced the assertion on a loaded machine and made this test flaky
  // across all three viewport projects.
  let releasePost: () => void = () => {};
  const postHeld = new Promise<void>((resolve) => {
    releasePost = resolve;
  });

  await page.route("**/contact", async (route) => {
    if (route.request().method() === "POST") {
      await postHeld;
    }
    await route.continue();
  });

  await page.goto("/contact");
  /*
    The pending label only exists once React owns the form: a click before
    hydration submits natively and there is no pending state to observe, which
    is how this failed under a loaded, fully parallel run. Wait for React to
    attach its fiber keys to the form rather than for `networkidle` - the
    Turnstile widget polls, so the network never actually goes idle here.
  */
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    return Boolean(form) && Object.keys(form!).some((key) => key.startsWith("__react"));
  });

  await page.getByLabel("Project type").selectOption("Web development");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Work email").fill("test@example.com");
  await page.getByLabel(/what are you trying to achieve/i).fill("A real project goal, long enough to pass validation.");

  const postStarted = page.waitForRequest(
    (request) => request.method() === "POST" && request.url().includes("/contact")
  );
  await page.getByRole("button", { name: /send project brief/i }).click();
  // Only assert once the action's POST is genuinely in flight and held open,
  // so the assertion window no longer races hydration or the server.
  await postStarted;

  try {
    await expect(page.getByRole("button", { name: /sending/i })).toBeVisible();
  } finally {
    releasePost();
  }
});

test("contact form disables the submit button while a submission is in flight", async ({ page }) => {
  // Same held-POST pattern as the loading-state test above: proves the
  // button cannot be clicked again (double-submit) for the whole time the
  // action is actually running, not just that a "Sending…" label appears.
  let releasePost: () => void = () => {};
  const postHeld = new Promise<void>((resolve) => {
    releasePost = resolve;
  });

  await page.route("**/contact", async (route) => {
    if (route.request().method() === "POST") await postHeld;
    await route.continue();
  });

  await page.goto("/contact");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    return Boolean(form) && Object.keys(form!).some((key) => key.startsWith("__react"));
  });

  await page.getByLabel("Project type").selectOption("Web development");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Work email").fill("test@example.com");
  await page.getByLabel(/what are you trying to achieve/i).fill("A real project goal, long enough to pass validation.");

  const postStarted = page.waitForRequest(
    (request) => request.method() === "POST" && request.url().includes("/contact")
  );
  // A name-based role query would stop matching once the label flips to
  // "Sending…", so pin the locator to the submit control itself - scoped to
  // the contact form specifically, since the footer's newsletter form on
  // this same page has its own unrelated submit button.
  const submitButton = page.locator('form:has(#name) button[type="submit"]');
  await submitButton.click();
  await postStarted;

  try {
    await expect(submitButton).toBeDisabled();
  } finally {
    releasePost();
  }
});

test("contact form shows a clear error when spam verification has not completed", async ({ page }) => {
  /*
    Whether Cloudflare's real widget has a solved token by the time this
    assertion runs is nondeterministic against live infra (it sometimes
    auto-solves in the background before the click, sometimes hasn't even
    injected its hidden input yet), so this test does not depend on it
    either way: block the script entirely, then simulate the exact DOM
    state an unsolved widget leaves behind - a present-but-empty
    `cf-turnstile-response` field - and assert the server's real response to
    that field, which is the thing this test actually cares about.
  */
  await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
  await page.goto("/contact");
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    return Boolean(form) && Object.keys(form!).some((key) => key.startsWith("__react"));
  });
  await page.evaluate(() => {
    const form = document.querySelector("form")!;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "cf-turnstile-response";
    input.value = "";
    form.appendChild(input);
  });

  await page.getByLabel("Project type").selectOption("Web development");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Work email").fill("test@example.com");
  await page.getByLabel(/what are you trying to achieve/i).fill("A real project goal, long enough to pass validation.");
  await page.getByRole("button", { name: /send project brief/i }).click();

  await expect(page.getByText(/verification failed/i)).toBeVisible();
});

test("newsletter form validates email", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Email address");
  await input.fill("not-an-email");
  await page.getByRole("button", { name: /subscribe/i }).click();
  const isInvalid = await input.evaluate((el: HTMLInputElement) => !el.validity.valid);
  expect(isInvalid).toBeTruthy();
});
