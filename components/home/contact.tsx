import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Contact() {
  return <RenderHomeMarkup markup={homeMarkup.contact} />;
}

