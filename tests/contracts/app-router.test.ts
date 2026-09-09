import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import packageJson from "../../package.json";

describe("framework contract", () => {
  it("uses Next, React, TypeScript, Tailwind and pnpm commands", () => {
    expect(packageJson.packageManager).toMatch(/^pnpm@/);
    expect(packageJson.scripts).toMatchObject({
      dev: "next dev",
      build: "next build --webpack",
      typecheck: "tsc --noEmit",
    });
    expect(packageJson.dependencies).toHaveProperty("next");
    expect(packageJson.dependencies).toHaveProperty("react");
    expect(packageJson.devDependencies).toHaveProperty("typescript");
    expect(packageJson.devDependencies).toHaveProperty("tailwindcss");
  });
});

describe("main site ownership", () => {
  it("contains only the homepage application routes", () => {
    expect(existsSync("app/page.tsx")).toBe(true);
    expect(existsSync("app/diktory")).toBe(false);
    expect(existsSync("app/perevod")).toBe(false);
    expect(existsSync("components/seo")).toBe(false);
    expect(existsSync("lib/seo-documents.ts")).toBe(false);
    expect(existsSync("lib/seo-page-config.ts")).toBe(false);
  });
});
