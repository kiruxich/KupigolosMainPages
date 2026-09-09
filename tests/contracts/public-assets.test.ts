import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public asset contract", () => {
  it.each([
    "public/assets/kupigolos-logo-white.svg",
    "public/assets/studio/hero-room.jpg",
    "public/assets/studio/hero-session.jpg",
  ])("keeps %s at its public URL", (path) => {
    expect(existsSync(path)).toBe(true);
  });

  it("keeps the active legacy CSS cascade in its original order", () => {
    const css = readFileSync("styles/legacy.css", "utf8");
    expect(css).toContain('@import "./styles.css";');
    expect(css).toContain('@import "./refresh.css";');
    expect(css).toContain('@import "./voices-refinement.css";');
    expect(css).toContain('@import "./hero-photo-refinement.css";');
    expect(css).not.toContain('@import "./figma-sections.css";');
  });
});
