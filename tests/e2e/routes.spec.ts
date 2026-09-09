import { expect, test } from "@playwright/test";

test("main site routes respond", async ({ page }) => {
  for (const route of ["/", "/diktory", "/perevod"]) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should respond successfully`).toBe(true);
  }

});
