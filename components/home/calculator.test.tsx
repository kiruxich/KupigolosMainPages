import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Calculator } from "./calculator";

describe("calculator promotion", () => {
  it("renders a self-contained promotional section without imagery", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(<Calculator />);

    const section = container.querySelector("section#calculator");
    expect(section?.querySelector("img, picture, video")).toBeNull();
    expect(section?.textContent).not.toContain("07");
    expect(section?.textContent).toContain("Узнайте бюджет до начала записи");
  });

  it("keeps the section anchor and links to the existing calculation page", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(<Calculator />);

    const section = container.querySelector("section#calculator");
    expect(section).not.toBeNull();
    const link = section?.querySelector("a");
    expect(link?.getAttribute("href")).toBe("https://kupigolos.ru/price");
    expect(link?.textContent).toBe("Перейти к расчёту");
    expect(link?.classList.contains("studio-cta")).toBe(true);
  });

  it("replaces the inline calculator controls with a single call to action", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(<Calculator />);

    expect(container.querySelectorAll("a")).toHaveLength(1);
    expect(container.querySelector("input, select, textarea, form, [data-calculator]")).toBeNull();
  });
});
