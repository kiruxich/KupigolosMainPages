import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function About() {
  return <RenderHomeMarkup markup={homeMarkup.about} />;
}

