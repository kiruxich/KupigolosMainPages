import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { ProofSections } from "./proof-sections";

it("replaces the children placeholder with the approved photo and preserves the category link", () => {
  vi.stubGlobal("React", React);
  try {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(<ProofSections />);
    const card = host.querySelector(".talent-card-children")!;
    expect(card.getAttribute("href")).toBe("https://kupigolos.ru/diktory/detskie_golosa");
    expect(card.querySelector("svg")).toBeNull();
    expect(card.querySelector("img")?.getAttribute("src")).toBe("/assets/voice-categories/children-studio.webp");
    expect(card.textContent).toContain("Детские голоса");
  } finally {
    vi.unstubAllGlobals();
  }
});
