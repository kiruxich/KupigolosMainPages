import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function ProofSections() {
  return <RenderHomeMarkup markup={homeMarkup.proofSections} />;
}

