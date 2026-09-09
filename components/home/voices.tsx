import { homeMarkup } from "./home-markup.generated";

export function Voices() {
  const content = homeMarkup.voices
    .replace(/^\s*<section[^>]*>/, "")
    .replace(/<\/section>\s*$/, "")
    .replace('</h2>', '</h2><p class="voice-arc-intro">Знакомые голоса. Новые истории.</p>')
    .replace(/<div class="figma-voices-footer">[\s\S]*$/, `
      <div class="figma-voices-footer">
        <p class="voice-arc-caption">20 голосов для ваших проектов</p>
        <div class="figma-voices-deck-controls" aria-label="Управление каруселью дикторов">
          <div class="figma-voices-deck-actions"><button type="button" data-voice-deck-prev aria-controls="voices-deck" aria-label="Предыдущий диктор">‹</button></div>
          <p class="figma-voices-deck-status" aria-live="polite"><span data-voice-deck-current>03</span><span aria-hidden="true"> / </span><span data-voice-deck-total>20</span></p>
          <div class="figma-voices-deck-actions"><button type="button" data-voice-deck-next aria-controls="voices-deck" aria-label="Следующий диктор">›</button></div>
        </div>
        <a class="figma-voices-cta" href="https://kupigolos.ru/diktory">Все дикторы <span aria-hidden="true">↗</span></a>
      </div></div></div>`);

  // The legacy carousel owns these descendants; React must not reconcile cloned cards.
  return <section id="voices" className="talent-stage talent-stage-figma" aria-labelledby="voices-title" dangerouslySetInnerHTML={{ __html: content }} />;
}
