(function initVoiceDeck(globalScope, factory) {
  const api = factory(globalScope);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (globalScope && globalScope.document) {
    const mount = () => api.mountVoiceDecks(globalScope.document);
    if (globalScope.document.readyState === 'loading') {
      globalScope.document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
      mount();
    }
  }
})(typeof window !== 'undefined' ? window : null, (globalScope) => {
  function getCenteredCardIndex(cards, trackRect) {
    const trackCenter = trackRect.left + (trackRect.width / 2);
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(cards).forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + (cardRect.width / 2);
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function getCenterPadding(trackWidth, cardWidth) {
    return Math.max(0, (trackWidth - cardWidth) / 2);
  }

  function syncDeckPadding(track, card) {
    const padding = getCenterPadding(track.clientWidth, card.offsetWidth);
    track.style.setProperty('--voice-deck-pad', `${padding}px`);
  }

  function syncActiveCard(track) {
    const cards = Array.from(track.querySelectorAll('.figma-voice-card'));
    if (!cards.length) return -1;

    const activeIndex = getCenteredCardIndex(cards, track.getBoundingClientRect());
    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.classList.toggle('is-active', isActive);
      if (isActive) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
    });

    track.dataset.activeCard = String(activeIndex + 1);
    return activeIndex;
  }

  function centerCard(track, card, behavior = 'smooth') {
    const left = card.offsetLeft - ((track.clientWidth - card.offsetWidth) / 2);
    track.scrollTo({ left, behavior });
  }

  function mountVoiceDecks(root) {
    const tracks = root.querySelectorAll('.figma-voices-grid');

    tracks.forEach((track) => {
      const cards = Array.from(track.querySelectorAll('.figma-voice-card'));
      if (!cards.length || track.dataset.voiceDeckReady === 'true') return;

      track.dataset.voiceDeckReady = 'true';
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Карусель дикторов');
      track.setAttribute('tabindex', '0');

      syncDeckPadding(track, cards[0]);

      let frame = 0;
      const scheduleSync = () => {
        if (frame) return;
        frame = globalScope.requestAnimationFrame(() => {
          frame = 0;
          syncActiveCard(track);
        });
      };

      track.addEventListener('scroll', scheduleSync, { passive: true });
      track.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const current = syncActiveCard(track);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = Math.max(0, Math.min(cards.length - 1, current + direction));
        centerCard(track, cards[next]);
      });
      track.addEventListener('click', (event) => {
        if (event.target.closest('a, button')) return;
        const card = event.target.closest('.figma-voice-card');
        if (card && !card.classList.contains('is-active')) centerCard(track, card);
      });

      if (globalScope.ResizeObserver) {
        const resizeObserver = new globalScope.ResizeObserver(() => {
          syncDeckPadding(track, cards[0]);
          scheduleSync();
        });
        resizeObserver.observe(track);
      }

      syncActiveCard(track);
    });
  }

  return {
    centerCard,
    getCenterPadding,
    getCenteredCardIndex,
    mountVoiceDecks,
    syncActiveCard,
  };
});
