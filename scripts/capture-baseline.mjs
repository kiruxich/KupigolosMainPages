import { mkdir } from "node:fs/promises";
import { chromium } from "/Users/kiruxa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const routes = ["index.html", "home.html", "six-pages.html"];

const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const directory = `tests/visual/baselines/${viewport.name}`;
    await mkdir(directory, { recursive: true });
    const page = await browser.newPage({ viewport });

    for (const route of routes) {
      await page.goto(`http://127.0.0.1:4173/${route}`, { waitUntil: "networkidle" });
      await page.screenshot({ path: `${directory}/${route}.png`, fullPage: true });
    }

    await page.close();
  }
} finally {
  await browser.close();
}

