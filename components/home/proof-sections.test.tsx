import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProofSections } from "./proof-sections";

describe("ProofSections", () => {
  it("keeps the later proof blocks without duplicating moved homepage sections", () => {
    const container = document.createElement("main");
    container.innerHTML = renderToStaticMarkup(<ProofSections />);

    expect(container.querySelector(".founder-stage")).toBeNull();
    expect(container.textContent).not.toContain("Александр Лакеев");
    expect(container.querySelector("#voice-categories")).toBeNull();
    expect(container.querySelector("#process")).not.toBeNull();
    expect(container.querySelector("#guarantees")?.nextElementSibling?.id).toBe("process");
    expect(container.querySelector("#process")?.nextElementSibling?.id).toBe("reviews");
    expect(container.querySelector("#clients")).not.toBeNull();
  });
});
