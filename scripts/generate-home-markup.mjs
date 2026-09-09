import { readFile, writeFile, mkdir } from "node:fs/promises";

const documentSource = await readFile("home.html", "utf8");
const bodyMatch = documentSource.match(/<body>([\s\S]*?)<\/body>/i);
if (!bodyMatch?.[1]) throw new Error("home.html body was not found");

const activeBody = bodyMatch[1].replace(/<!--[\s\S]*?-->/g, "");

function extractElement(source, marker, tagName) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing marker: ${marker}`);
  const start = source.lastIndexOf(`<${tagName}`, markerIndex);
  if (start < 0) throw new Error(`Missing <${tagName}> before ${marker}`);

  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = start;
  let depth = 0;
  let match;

  while ((match = tagPattern.exec(source))) {
    depth += match[0].startsWith(`</`) ? -1 : 1;
    if (depth === 0) return source.slice(start, tagPattern.lastIndex);
  }

  throw new Error(`Unclosed <${tagName}> at ${marker}`);
}

const main = extractElement(activeBody, 'id="main-content"', "main");
const mainStart = activeBody.indexOf(main);
const mainOpeningEnd = main.indexOf(">");
const mainInner = main.slice(mainOpeningEnd + 1, main.lastIndexOf("</main>"));
const chrome = activeBody.slice(0, mainStart).trim();
const footer = activeBody.slice(mainStart + main.length).trim();

const section = (marker) => extractElement(mainInner, marker, "section");
const proofMarkers = [
  'id="voice-categories"',
  'id="advantages"',
  'id="guarantees"',
  'id="process"',
  'class="founder-stage"',
  'id="reviews"',
  'id="clients"',
];

const figmaServicesMatch = documentSource.match(
  /CURRENT FIGMA SERVICES VARIANT:[\s\S]*?\n([\s\S]*?)\n\s*-->/,
);

const output = {
  chrome,
  hero: section('id="start"'),
  voices: section('id="voices"'),
  aiServices: section('id="ai-services"'),
  about: section('id="about"'),
  services: section('id="services"'),
  portfolio: section('id="portfolio"'),
  calculator: section('id="calculator"'),
  proofSections: proofMarkers.map(section).join("\n"),
  contact: section('id="contacts"'),
  footer,
  figmaServices: figmaServicesMatch?.[1]?.trim() ?? "",
};

await mkdir("components/home", { recursive: true });
await writeFile(
  "components/home/home-markup.generated.ts",
  `// Generated from the active home.html DOM. Do not edit by hand.\nexport const homeMarkup = ${JSON.stringify(output, null, 2)} as const;\n`,
);

