import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { Contact } from "./contact";

describe("quick order form", () => {
  beforeEach(() => { document.body.innerHTML = renderToStaticMarkup(<Contact />); });

  it("accepts one clear contact value instead of separate channel fields", () => {
    const form = document.querySelector("form")!;
    const contact = form.elements.namedItem("contact") as HTMLInputElement | null;
    expect(contact).not.toBeNull();
    expect(contact?.labels?.[0]?.textContent).toContain("Как с вами связаться");
    expect(contact?.placeholder).toContain("@telegram");
    expect(contact?.required).toBe(true);
  });

  it("keeps the section heading with the form and preserves the existing submission destination", () => {
    const form = document.querySelector("form")!;
    const heading = document.getElementById("contact-title")!;
    expect(form.contains(heading)).toBe(true);
    expect(form.getAttribute("action")).toBe("mailto:info@kupigolos.ru");
    expect(form.querySelector('[name="name"][required]')).not.toBeNull();
    expect(form.querySelector('[name="message"][required]')).not.toBeNull();
  });

  it("uses the shared compact CTA treatment for the submit button", () => {
    const submit = document.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(submit.classList.contains("studio-cta")).toBe(true);
    expect(submit.classList.contains("studio-cta--order")).toBe(true);
    expect(submit.querySelector(".studio-cta-icon")).not.toBeNull();
  });
});
