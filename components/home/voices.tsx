import { homeMarkup } from "./home-markup.generated";
import { preprodVoiceCatalog } from "./voice-catalog.generated";

export function Voices() {
  const voiceCount = preprodVoiceCatalog.length;
  const formattedCount = String(voiceCount).padStart(2, "0");
  const content = homeMarkup.voices
    .replace(/^\s*<section[^>]*>/, "")
    .replace(/<\/section>\s*$/, "")
    .replace('</h2>', '</h2><p class="voice-arc-intro">Знакомые голоса. Новые истории.</p>')
    .replace(
      /<div class="figma-voice-meta">/g,
      '<div class="figma-voice-meta"><span class="figma-voice-favorite" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z"/></svg></span>',
    )
    .replace(
      /<a class="figma-voice-price" href="([^"]+)">([^<]*)<\/a>/g,
      '<a class="figma-voice-contact" href="$1">Связаться</a><span class="figma-voice-price">$2</span>',
    )
    .replace(/<div class="figma-voices-footer">[\s\S]*$/, `
      <div class="figma-voices-footer">
        <p class="voice-arc-caption">${voiceCount} голосов для ваших проектов</p>
        <div class="figma-voices-deck-controls" aria-label="Управление каруселью дикторов">
          <div class="figma-voices-deck-actions"><button type="button" data-voice-deck-prev aria-controls="voices-deck" aria-label="Предыдущий диктор">‹</button></div>
          <p class="figma-voices-deck-status" aria-live="polite"><span data-voice-deck-current>03</span><span aria-hidden="true"> / </span><span data-voice-deck-total>${formattedCount}</span></p>
          <div class="figma-voices-deck-actions"><button type="button" data-voice-deck-next aria-controls="voices-deck" aria-label="Следующий диктор">›</button></div>
        </div>
        <a class="figma-voices-cta" href="https://kupigolos.ru/diktory">Все дикторы <span aria-hidden="true">↗</span></a>
      </div></div></div>`);

  // The legacy carousel owns these descendants; React must not reconcile cloned cards.
  return <section id="voices" className="talent-stage talent-stage-figma" aria-labelledby="voices-title" dangerouslySetInnerHTML={{ __html: content }} />;
}
