import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { ProofSections } from "./proof-sections";

Object.assign(globalThis, { React });

it("replaces the legacy process once and links the first step to the order form", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<ProofSections />);
  expect(host.querySelectorAll("#process")).toHaveLength(1);
  const process = host.querySelector("#process")!;
  expect(process.querySelectorAll("ol > li")).toHaveLength(4);
  const requestLink = process.querySelector("ol > li:first-child a");
  expect(requestLink?.getAttribute("href")).toBe("#contacts");
  expect(host.querySelector("#guarantees")).not.toBeNull();
  expect(host.querySelector("#reviews")).not.toBeNull();
});
