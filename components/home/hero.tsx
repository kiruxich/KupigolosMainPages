import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Hero() {
  return <RenderHomeMarkup markup={homeMarkup.hero} />;
}

