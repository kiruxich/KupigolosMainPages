import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Portfolio() {
  return <RenderHomeMarkup markup={homeMarkup.portfolio} />;
}

