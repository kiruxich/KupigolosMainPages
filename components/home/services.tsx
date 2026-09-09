import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Services() {
  return <RenderHomeMarkup markup={homeMarkup.services} />;
}

