import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

/** Kept disconnected so the previous Figma services variant can be restored quickly. */
export function FigmaServicesAlternative() {
  return <RenderHomeMarkup markup={homeMarkup.figmaServices} />;
}

