import { homeMarkup } from "./home-markup.generated";

export function Voices() {
  const content = homeMarkup.voices
    .replace(/^\s*<section[^>]*>/, "")
    .replace(/<\/section>\s*$/, "")
    .replace('</h2>', '</h2><p class="voice-arc-intro">Знакомые голоса. Новые истории.</p>');

  // The legacy carousel owns these descendants; React must not reconcile cloned cards.
  return <section id="voices" className="talent-stage talent-stage-figma" aria-labelledby="voices-title" dangerouslySetInnerHTML={{ __html: content }} />;
}
