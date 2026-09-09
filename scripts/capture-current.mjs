import { mkdir } from "node:fs/promises";
import { chromium } from "/Users/kiruxa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const directory = `tests/visual/current/${viewport.name}`;
    await mkdir(directory, { recursive: true });
    const page = await browser.newPage({ viewport });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "load" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${directory}/index.html.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}
