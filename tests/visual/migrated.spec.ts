import { expect, test } from "@playwright/test";

const routes = [
  { href: "/", snapshot: "index" },
  { href: "/home", snapshot: "home" },
  { href: "/six-pages", snapshot: "six-pages" },
] as const;

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of routes) {
      test(`${route.href} retains its visual baseline`, async ({ page }) => {
        await page.goto(route.href, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot(`${viewport.name}-${route.snapshot}.png`, {
          animations: "allow",
          fullPage: true,
          maxDiffPixels: route.href === "/home" ? 20 : 0,
        });
      });
    }
  });
}
