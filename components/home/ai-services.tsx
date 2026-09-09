import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function AiServices() {
  return <RenderHomeMarkup markup={homeMarkup.aiServices} />;
}

