import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Calculator() {
  return <RenderHomeMarkup markup={homeMarkup.calculator} />;
}

