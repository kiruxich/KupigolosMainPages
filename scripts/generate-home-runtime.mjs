import { readFile, writeFile, mkdir } from "node:fs/promises";

const runtimeFiles = [
  "motion-scheduler.js",
  "script.js",
  "voice-waveforms.js",
  "voices-carousel.js",
];

const sources = await Promise.all(runtimeFiles.map((path) => readFile(path, "utf8")));
await mkdir("lib/home", { recursive: true });
await writeFile(
  "lib/home/runtime-sources.generated.ts",
  `// Generated from the verified legacy browser behavior. Do not edit by hand.\nexport const homeRuntimeSources: readonly string[] = ${JSON.stringify(sources, null, 2)};\n`,
);

