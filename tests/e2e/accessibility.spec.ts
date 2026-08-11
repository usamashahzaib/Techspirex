import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/services", "/services/web-development", "/work", "/about", "/insights", "/contact"];

for (const route of routes) {
  test(`${route} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();

    const seriousOrWorse = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );

    expect(
      seriousOrWorse,
      seriousOrWorse.map((v) => `${v.id}: ${v.description}`).join("\n")
    ).toEqual([]);
  });
}
