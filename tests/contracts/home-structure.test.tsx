import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Hero } from "../../components/home/hero";
import { HomePage } from "../../components/home/home-page";

const sectionIds = [
  "start",
  "voices",
  "ai-services",
  "about",
  "services",
  "portfolio",
  "calculator",
  "voice-categories",
  "advantages",
  "guarantees",
  "process",
  "reviews",
  "clients",
  "contacts",
] as const;

describe("homepage structure", () => {
  it("renders the approved hero actions and cinematic studio background", () => {
    const html = renderToStaticMarkup(<Hero />);

    expect(html).toContain('href="#contacts"');
    expect(html).toContain("Заказать");
    expect(html).toContain('href="#portfolio"');
    expect(html).toContain("Прослушать примеры");
    expect(html).not.toContain('href="#calculator"');
    expect(html).toContain("hero-cinema-background.webp");
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
