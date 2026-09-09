import { describe, expect, it } from "vitest";
import { mountHomeRuntime } from "./runtime-controller";

describe("home runtime lifecycle", () => {
  it("mounts runtime scripts in order and removes them on cleanup", () => {
    const cleanup = mountHomeRuntime(document, ["window.first = true;", "window.second = true;"]);
    expect(document.querySelectorAll("script[data-home-runtime]")).toHaveLength(2);

    cleanup();
    expect(document.querySelectorAll("script[data-home-runtime]")).toHaveLength(0);
  });
});

