import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { About } from "./about";

describe("About", () => {
  it("keeps the illustrated studio story and contact action accessible without JavaScript", () => {
    const html = renderToStaticMarkup(<About />);
    const document = new DOMParser().parseFromString(html, "text/html");
    const section = document.getElementById("about");

    expect(section?.getAttribute("aria-labelledby")).toBe("about-title");
    expect(document.getElementById("about-title")?.textContent).toBe("От первой идеи до готового трека.");
    expect(section?.textContent).toContain("Придумываем. Записываем. Сводим.");
    expect(section?.querySelector('a[href="#contacts"]')?.textContent).toContain("Обсудить проект");
    expect(section?.textContent).toContain("затем указывает на кнопку");
    expect(section?.querySelectorAll('img[alt=""]')).toHaveLength(2);
    expect(section?.querySelector("video, iframe, canvas")).toBeNull();
  });
});
