import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("project index keeps all four destinations", () => {
  const html = readFileSync("index.html", "utf8");

  for (const href of [
    "files/afisha-suppliers.docx",
    "https://kupigolos-ozvychka-g84p.vercel.app",
    "home.html",
    "six-pages.html",
  ]) {
    assert.match(html, new RegExp(`href="${href.replaceAll(".", "\\.")}"`));
  }
});

