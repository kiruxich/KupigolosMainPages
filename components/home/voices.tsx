import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Voices() {
  return <RenderHomeMarkup markup={homeMarkup.voices} />;
}

