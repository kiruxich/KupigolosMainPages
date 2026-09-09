import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { About } from "./about";

describe("About", () => {
  it("renders a readable studio summary with concrete proof", () => {
    const html = renderToStaticMarkup(<About />);

    expect(html).toContain('id="about"');
    expect(html).toContain('aria-labelledby="about-title"');
    expect(html).toContain("15 000+");
    expect(html).toContain("60");
    expect(html).toContain("с 2013");
    expect(html).toContain("hero-room.jpg");
    expect(html).toContain("Как устроена студия");
  });
});
