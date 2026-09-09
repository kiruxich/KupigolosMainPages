import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProofSections } from "./proof-sections";

describe("ProofSections", () => {
  it("leads from the process directly to reviews without a founder section", () => {
    const container = document.createElement("main");
    container.innerHTML = renderToStaticMarkup(<ProofSections />);

    expect(container.querySelector(".founder-stage")).toBeNull();
    expect(container.textContent).not.toContain("Александр Лакеев");
    expect(container.querySelector("#process")?.nextElementSibling?.id).toBe("reviews");
    expect(container.querySelector("#clients")).not.toBeNull();
  });
});
