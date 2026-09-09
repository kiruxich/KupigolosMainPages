// @vitest-environment-options {"runScripts":"dangerously"}
import { describe, expect, it } from "vitest";
import { mountHomeRuntime } from "./runtime-controller";

describe("home runtime lifecycle", () => {
  it("removes event handlers before a Strict Mode remount", () => {
    document.body.innerHTML = '<main id="main-content"></main>';
    const source = 'document.addEventListener("click", () => { document.body.dataset.clicks = String(Number(document.body.dataset.clicks || 0) + 1); });';
    const firstCleanup = mountHomeRuntime(document, [source]);
    firstCleanup();
    const cleanup = mountHomeRuntime(document, [source]);
    document.body.click();
    expect(document.body.dataset.clicks).toBe("1");
    cleanup();
    document.body.click();
    expect(document.body.dataset.clicks).toBe("1");
  });
  it("mounts runtime scripts in order and removes them on cleanup", () => {
    const cleanup = mountHomeRuntime(document, ["window.first = true;", "window.second = true;"]);
    expect(document.querySelectorAll("script[data-home-runtime]")).toHaveLength(2);

    cleanup();
    expect(document.querySelectorAll("script[data-home-runtime]")).toHaveLength(0);
  });
});
