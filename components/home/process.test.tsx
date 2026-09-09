import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProofSections } from "./proof-sections";
import { Process } from "./process";

Object.assign(globalThis, { React, IS_REACT_ACT_ENVIRONMENT: true });

it("replaces the legacy process once and links the first step to the order form", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<ProofSections />);
  expect(host.querySelectorAll("#process")).toHaveLength(1);
  const process = host.querySelector("#process")!;
  expect(process.querySelectorAll("ol > li")).toHaveLength(4);
  const requestLink = process.querySelector("ol > li:first-child a");
  expect(requestLink?.getAttribute("href")).toBe("#contacts");
  expect(host.querySelector("#guarantees")).not.toBeNull();
  expect(host.querySelector("#reviews")).not.toBeNull();
});

it("gives every timeline step a heading and an accessible slider", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<Process />);
  const steps = [...host.querySelectorAll("ol > li")];
  expect(steps).toHaveLength(4);
  for (const step of steps) {
    expect(step.querySelector("h3")?.textContent?.trim()).toBeTruthy();
    expect(step.querySelector("p")?.textContent?.trim()).toBeTruthy();
  }
  const sliders = [...host.querySelectorAll('input[type="range"]')];
  expect(sliders).toHaveLength(4);
  for (const slider of sliders) {
    expect(slider.getAttribute("aria-label")).toBeTruthy();
    expect(slider.closest('[aria-hidden="true"]')).toBeNull();
  }
  expect(host.querySelectorAll("a[href='#contacts']")).toHaveLength(1);
});

it("replaces the default fourth highlight on hover or keyboard focus and remembers moved faders", () => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    act(() => root.render(<Process />));
    const rows = [...host.querySelectorAll("ol > li")];
    const sliders = [...host.querySelectorAll<HTMLInputElement>('input[type="range"]')];
    expect(rows.map(row => row.getAttribute("data-active"))).toEqual(["false", "false", "false", "true"]);
    expect(sliders).toHaveLength(4);
    act(() => sliders[0]!.dispatchEvent(new MouseEvent("pointerover", { bubbles: true })));
    expect(rows.map(row => row.getAttribute("data-active"))).toEqual(["true", "false", "false", "false"]);
    act(() => sliders[1]!.focus());
    expect(rows[1]!.getAttribute("data-active")).toBe("true");
    act(() => {
      sliders[1]!.value = "63";
      sliders[1]!.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(sliders[1]!.parentElement!.style.getPropertyValue("--fader-position")).toBe("0.63");
    act(() => sliders[2]!.focus());
    expect(rows[3]!.getAttribute("data-active")).toBe("false");
    expect(sliders[1]!.value).toBe("63");
    expect(sliders[1]!.parentElement!.style.getPropertyValue("--fader-position")).toBe("0.63");
  } finally {
    act(() => root.unmount());
    host.remove();
  }
});
