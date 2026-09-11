import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProofSections } from "./proof-sections";
import { Reviews } from "./reviews";

Object.assign(globalThis, { React, IS_REACT_ACT_ENVIRONMENT: true });

it("renders live-site reviews and real external destinations", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<ProofSections />);
  expect(host.querySelectorAll("#reviews")).toHaveLength(1);
  const section = host.querySelector("#reviews")!;
  expect(section.querySelectorAll("article")).toHaveLength(3);
  expect(section.textContent).toContain("Аксиома Безопасности");
  expect(section.textContent).toContain("Евгений К.");
  expect(section.textContent).toContain("Илья М.");
  expect(section.querySelector("time")).toBeNull();
  const mapsLinks = section.querySelectorAll('a[href="https://yandex.ru/maps/org/studiya_kupigolos/118434769430/reviews/"]');
  expect(mapsLinks).toHaveLength(1);
  expect(mapsLinks[0]!.textContent).toContain("Оставить отзыв");
  expect(mapsLinks[0]!.getAttribute("rel")).toContain("noopener");
  expect(section.textContent).toContain("Яндекс Карты");
  expect(section.textContent).toContain("Google");
  expect(section.textContent).toContain("Zoon");
  expect(host.querySelector("#process")).not.toBeNull();
  expect(host.querySelector("#guarantees")).not.toBeNull();
});

it("expands and collapses a long review without changing the other cards", async () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(<Reviews />));
    const button = host.querySelector<HTMLButtonElement>('#reviews button[aria-expanded]');
    expect(button).not.toBeNull();
    const paragraph = document.getElementById(button!.getAttribute("aria-controls")!)!;
    expect(paragraph.textContent).toContain("Другие студии нам отказали");
    expect(button!.textContent).toContain("Читать полностью");
    await act(async () => button!.click());
    expect(button!.getAttribute("aria-expanded")).toBe("true");
    expect(paragraph.textContent).toContain("Другие студии нам отказали");
    expect(button!.textContent).toContain("Свернуть");
    expect(host.querySelectorAll('#reviews button[aria-expanded="true"]')).toHaveLength(1);
    await act(async () => button!.click());
    expect(button!.getAttribute("aria-expanded")).toBe("false");
    expect(paragraph.textContent).toContain("Другие студии нам отказали");
  } finally {
    await act(async () => root.unmount());
    host.remove();
  }
});
