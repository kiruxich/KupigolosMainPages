import { test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`capture ${viewport.name} references`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of ["index.html", "home.html", "six-pages.html"] as const) {
      await page.goto(`http://127.0.0.1:4173/${route}`);
      await page.screenshot({
        path: `tests/visual/baselines/${viewport.name}/${route}.png`,
        fullPage: true,
      });
    }
  });
}

