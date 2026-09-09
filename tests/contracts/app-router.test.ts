import { describe, expect, it } from "vitest";
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
