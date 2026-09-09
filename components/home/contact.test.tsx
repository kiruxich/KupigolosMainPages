import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { Contact } from "./contact";

describe("quick order form", () => {
  beforeEach(() => { document.body.innerHTML = renderToStaticMarkup(<Contact />); });

  it("includes an optional, labelled Telegram address in the submitted form data", () => {
    const form = document.querySelector("form")!;
    const telegram = form.elements.namedItem("telegram") as HTMLInputElement | null;
    expect(telegram).not.toBeNull();
    expect(telegram?.labels?.[0]?.textContent).toContain("Telegram");
    expect(telegram?.required).toBe(false);
    telegram!.value = "@voice_project";
    expect(new FormData(form).get("telegram")).toBe("@voice_project");
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
