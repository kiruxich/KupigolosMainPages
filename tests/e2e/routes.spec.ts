import { expect, test } from "@playwright/test";

test("all project routes and the supplier document respond", async ({ page, request }) => {
  for (const route of ["/", "/home"]) {
    const response = await page.goto(route);
    expect(response?.ok(), `${route} should respond successfully`).toBe(true);
  }

  const documentResponse = await request.get("/files/afisha-suppliers.docx");
  expect(documentResponse.ok()).toBe(true);
  expect(documentResponse.headers()["content-type"]).toContain("application/vnd.openxmlformats");

  await page.goto("/");
  await expect(page.getByLabel("Открыть страницу Озвучка")).toHaveAttribute(
    "href",
    "https://kupigolos-ozvychka-g84p.vercel.app",
  );
});
