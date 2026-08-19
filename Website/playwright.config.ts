import { defineConfig, devices } from "@playwright/test";

/*
  Port is configurable because 3000 is the busiest port on any dev machine.
  `reuseExistingServer` will happily adopt whatever is already listening - if
  that is some other project's Next app, every route assertion here fails with
  a 404 and the run looks like a catastrophic regression in *this* site. Set
  PLAYWRIGHT_PORT to a free port when 3000 is occupied by something else.
*/
const port = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: baseURL,
    // Never adopt a stranger: CI always boots its own, and locally an explicit
    // PLAYWRIGHT_PORT means the developer picked a port they know is ours.
    reuseExistingServer: !process.env.CI && !process.env.PLAYWRIGHT_PORT,
    timeout: 60_000,
  },
  projects: [
    { name: "mobile-390", use: { ...devices["Pixel 7"] } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
  ],
});
