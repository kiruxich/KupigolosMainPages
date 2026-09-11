import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it } from "vitest";
import { Portfolio } from "./portfolio";

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Portfolio />));
});
afterEach(() => { act(() => root.unmount()); host.remove(); });

it("switches between video and audio categories", () => {
  expect(host.querySelectorAll('[data-audio-src]')).toHaveLength(0);
  expect(host.querySelectorAll('a[aria-label^="Смотреть"]')).toHaveLength(2);
  const tab = [...host.querySelectorAll('button')].find(el => el.textContent === "Аудиоролики")!;
  act(() => tab.click());
  expect(host.textContent).toContain("Olympea Blossom");
  expect(host.querySelectorAll('[data-audio-src]')).toHaveLength(6);
  expect(host.querySelectorAll('a[aria-label^="Смотреть"]')).toHaveLength(0);
});

it("moves to the next category using the portfolio controls", () => {
  const next = host.querySelector<HTMLButtonElement>('button[aria-label="Следующая категория"]')!;
  act(() => next.click());
  expect(host.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe("Фильмы/сериалы/мультики");
  expect(host.querySelectorAll('a[aria-label^="Смотреть"]')).toHaveLength(3);
});
