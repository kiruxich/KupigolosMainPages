import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "app/layout.tsx",
  "app/page.tsx",
  "components/home/home-page.tsx",
  "components/home/home-markup.generated.ts",
  "components/home/home-runtime.tsx",
  "lib/home/runtime-controller.ts",
  "lib/home/runtime-sources.generated.ts",
];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const path of requiredFiles) check(existsSync(path), `missing ${path}`);

if (!failures.length) {
  const page = readFileSync("components/home/home-page.tsx", "utf8");
  const markup = readFileSync("components/home/home-markup.generated.ts", "utf8");
  const runtime = readFileSync("lib/home/runtime-sources.generated.ts", "utf8");
  const metadata = readFileSync("app/home/home-metadata.ts", "utf8");
  const css = readFileSync("styles/legacy.css", "utf8");
  const sectionIds = [
    "start", "voices", "ai-services", "about", "services", "portfolio",
    "calculator", "voice-categories", "advantages", "guarantees", "process",
    "reviews", "clients", "contacts",
  ];

  check((page.match(/<main\b/g) ?? []).length === 1, "homepage must render one main element");
  for (const id of sectionIds) check(markup.includes(`id=\\\"${id}\\\"`), `homepage is missing #${id}`);
  check(markup.includes("services-stage section-light"), "legacy services variant is not active");
  check(!markup.includes("services-stage services-stage-figma"), "Figma services variant became active");
  check((markup.match(/data-portfolio-panel/g) ?? []).length === 3, "portfolio must keep three panels");
  check((markup.match(/ai-tool-card ai-tool-card-/g) ?? []).length === 6, "homepage must keep six AI tools");
  check((markup.match(/service-item service-item-/g) ?? []).length >= 6, "homepage must keep six service cards");
  check((runtime.match(/name:/g) ?? []).length >= 20, "voice catalogue data is incomplete");
  check(runtime.includes("function setDrawer("), "drawer controller is missing");
  check(runtime.includes("function renderPortfolio()"), "portfolio controller is missing");
  check(runtime.includes("function setStudioRailSection("), "studio rail controller is missing");
  check(metadata.includes("organizationJsonLd") && metadata.includes("openGraph"), "homepage metadata is incomplete");
  check(css.indexOf("styles.css") < css.indexOf("refresh.css"), "legacy CSS order changed");
}

if (failures.length) {
  console.error(`Validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Validation passed: Next routes, homepage structure, assets and interactions are present.");
