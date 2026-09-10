import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { About } from "./about";

describe("About", () => {
  it("keeps the illustrated studio story and contact action accessible without JavaScript", () => {
    const html = renderToStaticMarkup(<About />);

    expect(html).toContain('id="about"');
    expect(html).toContain('aria-labelledby="about-title"');
    expect(html).toContain("От первой идеи до готового трека.");
    expect(html).toContain("Придумываем. Записываем. Сводим.");
    expect(html).toContain('href="#contacts"');
    expect(html).toContain("Обсудить проект");
    expect(html).toContain("затем указывает на кнопку");
  });
});
