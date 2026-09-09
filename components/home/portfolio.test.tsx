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

it("keeps video examples visible while switching audio categories", () => {
  expect(host.querySelectorAll('[data-audio-src]')).toHaveLength(4);
  expect(host.querySelectorAll('a[aria-label^="Смотреть"]')).toHaveLength(2);
  const tab = [...host.querySelectorAll('button')].find(el => el.textContent === "Автоответчики")!;
  act(() => tab.click());
  expect(host.textContent).toContain("РКФ");
  expect(host.textContent).not.toContain("Olympea Blossom");
  expect(host.querySelectorAll('a[aria-label^="Смотреть"]')).toHaveLength(2);
});

it("reveals remaining work using the shared CTA", () => {
  const more = host.querySelector<HTMLButtonElement>('button.studio-cta');
  expect(more).not.toBeNull();
  act(() => more!.click());
  expect(host.querySelectorAll('[data-audio-src]')).toHaveLength(6);
  expect(host.querySelectorAll('a[aria-label^="Смотреть"]')).toHaveLength(6);
  expect(host.querySelector('button.studio-cta')).toBeNull();
});
