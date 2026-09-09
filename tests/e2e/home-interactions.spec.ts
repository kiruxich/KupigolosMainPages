import { expect, test } from "@playwright/test";

test("homepage menus, panels, carousel and calculator remain interactive", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/home");

  await page.locator('[data-header-trigger="services"]').click();
  await expect(page.locator('[data-header-panel="services"]')).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("Escape");

  await page.locator("[data-header-popover-trigger=\"phone\"]").click();
  await page.locator("[data-callback-open]:visible").click();
  await expect(page.locator("[data-callback-drawer]")).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("Escape");

  await page.locator('[data-portfolio-tab="audio"]').click();
  await expect(page.locator('[data-portfolio-panel="audio"]')).toBeVisible();

  await page.locator('[data-calculator] input[name="extra"][value="2000"]').check({ force: true });
  await expect(page.locator("[data-calculator-total]")).toHaveText("4 500 ₽");

  const currentVoice = page.locator("[data-voice-deck-current]");
  const before = await currentVoice.textContent();
  await page.locator("[data-voice-deck-next]").click();
  await expect(currentVoice).not.toHaveText(before ?? "");

  expect(pageErrors).toEqual([]);
});
