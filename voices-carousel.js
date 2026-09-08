(function initVoiceCarousel(globalScope, factory) {
  const api = factory(globalScope);

  if (typeof module !== 'undefined' && module.exports) module.exports = api;

  if (globalScope && globalScope.document) {
    const mount = () => api.mountVoiceDecks(globalScope.document);
    if (globalScope.document.readyState === 'loading') {
      globalScope.document.addEventListener('DOMContentLoaded', mount, { once: true });
    } else {
      mount();
    }
  }
})(typeof window !== 'undefined' ? window : null, (globalScope) => {
  function getNextCardIndex(currentIndex, direction, length) {
    if (!length) return -1;
    return ((currentIndex + direction) % length + length) % length;
  }

  // Keep every card in the fan, including when moving between the last and first.
  function getDeckOffset(index, activeIndex, length) {
    return getNextCardIndex(index - activeIndex, Math.floor(length / 2), length) - Math.floor(length / 2);
  }

  function getDeckLayout(offset, length, trackWidth, cardWidth) {
    const distance = Math.abs(offset);
    const sideCount = offset < 0 ? Math.floor(length / 2) : Math.floor((length - 1) / 2);
    const outerScale = 1 - sideCount * .018;
    const span = Math.max(0, (trackWidth - cardWidth * outerScale) / 2);
    // Neighbours peek out by half a card; the remaining cards compress toward the edges.
    const firstStep = Math.min(cardWidth * .5, span / Math.max(1, sideCount) * 2);
    const x = distance ? firstStep + (span - firstStep) * (distance - 1) / Math.max(1, sideCount - 1) : 0;
    return { x: Math.sign(offset) * x, y: distance ? 12 + distance * 3 : 0,
      scale: 1 - distance * .018, layer: length - distance };
  }

  function populateVoiceDeck(track, catalog) {
    if (!Array.isArray(catalog) || catalog.length < 20 || !track.ownerDocument) return;
    const template = track.querySelector('.figma-voice-card');
    if (!template) return;

    const fragment = track.ownerDocument.createDocumentFragment();
    catalog.slice(0, 20).forEach((voice) => {
      const card = template.cloneNode(true);
      const role = card.querySelector('.figma-voice-role');
      const image = card.querySelector('.figma-voice-portrait img');
      const audioLinks = card.querySelectorAll('.figma-voice-meta > a, .voice-play');
      const name = card.querySelector('.figma-voice-name');
      const price = card.querySelector('.figma-voice-price');
      const duration = card.querySelector('.figma-voice-meta > span');

      role.textContent = `Голос ${voice.role}`;
      image.src = voice.image;
      image.alt = voice.name;
      audioLinks.forEach((element) => {
        if (element.matches('a')) {
          element.href = voice.audio;
          element.setAttribute('aria-label', `Скачать демо: ${voice.name}`);
        }
        else {
          element.dataset.audioSrc = voice.audio;
          element.dataset.audioLabel = voice.name;
          element.setAttribute('aria-label', `Слушать голос ${voice.name}`);
        }
      });
      if (duration) duration.textContent = 'Демо';
      name.href = voice.href;
      name.textContent = voice.name;
      price.href = voice.href;
      price.textContent = voice.price || 'Узнать стоимость';
      card.dataset.voiceName = voice.name;
      fragment.append(card);
    });

    track.replaceChildren(fragment);
  }

  function syncActiveCard(track, activeIndex = Number(track.dataset.activeCard || 1) - 1) {
    const cards = Array.from(track.querySelectorAll('.figma-voice-card'));
    if (!cards.length) return -1;
    activeIndex = getNextCardIndex(activeIndex, 0, cards.length);
    const width = track.clientWidth;
    const cardWidth = cards[0].offsetWidth;
    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      const offset = getDeckOffset(index, activeIndex, cards.length);
      const layout = getDeckLayout(offset, cards.length, width, cardWidth);
      card.dataset.deckOffset = String(offset);
      card.classList.toggle('is-active', isActive);
      card.style.setProperty('--voice-x', `${layout.x}px`);
      card.style.setProperty('--voice-y', `${layout.y}px`);
      card.style.setProperty('--voice-scale', layout.scale);
      card.style.setProperty('--voice-layer', layout.layer);
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'карточка');
      card.setAttribute('aria-label', `${index + 1} из ${cards.length}: ${card.dataset.voiceName || ''}`);
      if (isActive) card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
      card.querySelector('.figma-voice-body').inert = !isActive;
    });
    track.dataset.activeCard = String(activeIndex + 1);
    return activeIndex;
  }

  function mountVoiceDecks(root) {
    root.querySelectorAll('.figma-voices-grid').forEach((track) => {
      if (track.dataset.voiceDeckReady === 'true') return;
      populateVoiceDeck(track, globalScope?.KupiVoiceCatalog);
      const cards = Array.from(track.querySelectorAll('.figma-voice-card'));
      if (!cards.length) return;
      track.dataset.voiceDeckReady = 'true';
      track.setAttribute('role', 'region');
      track.setAttribute('aria-label', 'Колода дикторов. Переключайте карточки стрелками влево и вправо.');
      track.setAttribute('aria-roledescription', 'карусель');
      track.setAttribute('tabindex', '0');
      const panel = track.closest('.figma-voices-panel');
      const currentLabel = panel?.querySelector('[data-voice-deck-current]');
      const totalLabel = panel?.querySelector('[data-voice-deck-total]');
      const previousButton = panel?.querySelector('[data-voice-deck-prev]');
      const nextButton = panel?.querySelector('[data-voice-deck-next]');
      let activeIndex = Math.floor(cards.length / 2);
      const selectCard = (index) => {
        const next = getNextCardIndex(index, 0, cards.length);
        if (next !== activeIndex) {
          if (cards[activeIndex].contains(root.activeElement)) track.focus({ preventScroll: true });
          track.dispatchEvent(new globalScope.CustomEvent('voice-deck-change', { bubbles: true }));
        }
        activeIndex = syncActiveCard(track, next);
        if (currentLabel) {
          currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
          currentLabel.setAttribute('aria-label', `${activeIndex + 1}, ${cards[activeIndex].dataset.voiceName}`);
        }
        if (totalLabel) totalLabel.textContent = String(cards.length).padStart(2, '0');
      };
      const moveDeck = (direction) => selectCard(activeIndex + direction);
      track.addEventListener('keydown', (event) => {
        const directions = { ArrowLeft: -1, ArrowRight: 1 };
        if (!(event.key in directions) && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        if (event.key === 'Home') selectCard(0);
        else if (event.key === 'End') selectCard(cards.length - 1);
        else moveDeck(directions[event.key]);
      });
      let pointerStart = null;
      let suppressClick = false;
      track.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        suppressClick = false;
        pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
      });
      globalScope.addEventListener('pointerup', (event) => {
        if (!pointerStart || pointerStart.id !== event.pointerId) return;
        const dx = event.clientX - pointerStart.x;
        const dy = event.clientY - pointerStart.y;
        pointerStart = null;
        if (Math.abs(dx) < 35 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
        suppressClick = true;
        moveDeck(dx < 0 ? 1 : -1);
      });
      globalScope.addEventListener('pointercancel', () => { pointerStart = null; });
      track.addEventListener('dragstart', (event) => event.preventDefault());
      track.addEventListener('click', (event) => {
        if (suppressClick) {
          suppressClick = false;
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        const card = event.target.closest('.figma-voice-card');
        if (!card || card.classList.contains('is-active')) return;
        event.preventDefault();
        event.stopPropagation();
        selectCard(cards.indexOf(card));
      }, true);
      previousButton?.addEventListener('click', () => moveDeck(-1));
      nextButton?.addEventListener('click', () => moveDeck(1));
      if (globalScope.ResizeObserver) {
        new globalScope.ResizeObserver(() => syncActiveCard(track, activeIndex)).observe(track);
      }
      selectCard(activeIndex);
    });
  }

  return { getNextCardIndex, getDeckOffset, getDeckLayout, mountVoiceDecks, populateVoiceDeck, syncActiveCard };
});
