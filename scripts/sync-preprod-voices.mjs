import { writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const catalogUrl = "https://kupigolos.ru/diktory";
const outputPath = "components/home/voice-catalog.generated.ts";

const normalizeText = (value = "") => value.replace(/\s+/gu, " ").trim();
const absoluteUrl = (value) => value ? new URL(value, catalogUrl).href : "";

async function loadDocument(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Kupigolos homepage catalogue sync" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return new JSDOM(await response.text(), { url }).window.document;
}

function getPageCount(document) {
  return Math.max(
    1,
    ...Array.from(document.querySelectorAll('a[href*="page="]'), (link) => {
      const page = Number(new URL(link.href, catalogUrl).searchParams.get("page"));
      return Number.isFinite(page) ? page : 1;
    }),
  );
}

function readSpeakers(document) {
  return Array.from(document.querySelectorAll('.card[data-card-kind="speaker"]'), (card) => {
    const profile = card.querySelector(".card__name a");
    const portrait = card.querySelector(".player__img");
    const demo = card.querySelector("audio source");
    const order = card.querySelector(".goal-order-voice");
    const price = normalizeText(card.querySelector(".card__price")?.textContent);

    return {
      id: card.getAttribute("data-key") ?? "",
      name: normalizeText(profile?.textContent),
      href: absoluteUrl(profile?.getAttribute("href")),
      image: absoluteUrl(portrait?.getAttribute("src")),
      audio: absoluteUrl(demo?.getAttribute("src")),
      price,
      description: normalizeText(card.querySelector(".card__descr")?.textContent),
      orderHref: absoluteUrl(order?.getAttribute("href") ?? profile?.getAttribute("href")),
      featured: Boolean(card.querySelector(".card__vip")),
    };
  }).filter((speaker) => speaker.name && speaker.href && speaker.image && speaker.audio);
}

const firstDocument = await loadDocument(catalogUrl);
const pageCount = getPageCount(firstDocument);
const documents = await Promise.all([
  Promise.resolve(firstDocument),
  ...Array.from({ length: pageCount - 1 }, (_, index) => {
    const url = new URL(catalogUrl);
    url.searchParams.set("page", String(index + 2));
    return loadDocument(url.href);
  }),
]);

const speakers = Array.from(
  new Map(documents.flatMap(readSpeakers).map((speaker) => [speaker.id || speaker.href, speaker])).values(),
);

const source = `// Generated from ${catalogUrl}. Run: node scripts/sync-preprod-voices.mjs\n\n` +
  `export type VoiceCatalogEntry = {\n` +
  `  id: string;\n  name: string;\n  href: string;\n  image: string;\n  audio: string;\n` +
  `  price: string;\n  description: string;\n  orderHref: string;\n  featured: boolean;\n};\n\n` +
  `export const preprodVoiceCatalog = ${JSON.stringify(speakers, null, 2)} as const satisfies readonly VoiceCatalogEntry[];\n`;

writeFileSync(outputPath, source);
console.log(`Synced ${speakers.length} speakers from ${pageCount} pages to ${outputPath}`);
