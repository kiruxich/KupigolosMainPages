import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Hero } from "../../components/home/hero";
import { HomePage } from "../../components/home/home-page";

const sectionIds = [
  "start",
  "voices",
  "services",
  "ai-services",
  "portfolio",
  "calculator",
  "process",
  "voice-categories",
  "studio-directions",
  "studio-faq",
  "advantages",
  "guarantees",
  "about",
  "reviews",
  "clients",
  "contacts",
] as const;

describe("homepage structure", () => {
  it("renders the approved hero actions and sound sculpture", () => {
    const html = renderToStaticMarkup(<Hero />);

    expect(html).toContain('href="#contacts"');
    expect(html).toContain("Заказать");
    expect(html).toContain('href="https://kupigolos.ru/diktory"');
    expect(html).toContain("ВЫБРАТЬ ДИКТОРА");
    expect(html).not.toContain('href="#calculator"');
    expect(html).toContain("hero-sound-sculpture.png");
    expect(html).toContain('class="hero-product hero-product-cinema"');
  });

  it("preserves required sections in order", () => {
    const html = renderToStaticMarkup(<HomePage />);
    const positions = sectionIds.map((id) => html.indexOf(`id="${id}"`));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions.every((position, index) => index === 0 || position > positions[index - 1]!)).toBe(true);
  });

  it("keeps the active legacy voices and services variants", () => {
    const html = renderToStaticMarkup(<HomePage />);
    expect(html).toContain('id="voices-deck"');
    expect(html).toContain("services-stage section-light");
    expect(html).not.toContain("services-stage services-stage-figma");
  });
});
