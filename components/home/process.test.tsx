import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Process } from "./process";

it("renders the production process from the approved layout", () => {
  const host = document.createElement("div");
  host.innerHTML = renderToStaticMarkup(<Process />);

  expect(host.querySelector("#process h2")?.textContent).toContain(
    "Как проходит профессиональная озвучка",
  );
  const steps = [...host.querySelectorAll("#process ol > li")];
  expect(steps).toHaveLength(4);
  expect(steps.map((step) => step.querySelector("h3")?.textContent)).toEqual([
    "Бриф и материалы",
    "Подбор команды",
    "Запись и контроль",
    "Монтаж и сдача",
  ]);
  expect(steps.every((step) => step.querySelector("p")?.textContent?.trim())).toBe(true);
  expect(host.querySelectorAll('#process input[type="range"]')).toHaveLength(0);
  expect(host.querySelectorAll("#process [data-timeline-ghost]")).toHaveLength(3);
  expect(host.querySelector('#process [class*="playhead"]')).not.toBeNull();
  expect(host.querySelector("#process")?.getAttribute("style")).toContain(
    "--playback-duration:9600ms",
  );
});
