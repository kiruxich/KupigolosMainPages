import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Header() {
  return <RenderHomeMarkup markup={homeMarkup.chrome} />;
}

