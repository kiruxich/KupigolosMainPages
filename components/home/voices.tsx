import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

export function Voices() {
  return <RenderHomeMarkup markup={homeMarkup.voices.replace('</h2>', '</h2><p class="voice-arc-intro">Знакомые голоса. Новые истории.</p>')} />;
}
