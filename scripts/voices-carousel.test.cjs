const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const deck = require('../voices-carousel.js');

test('all twenty cards retain unique slots and one centered card through a full cycle', () => {
  for (let active = 0; active < 20; active++) {
    const offsets = Array.from({ length: 20 }, (_, i) => deck.getDeckOffset(i, active, 20));
    assert.equal(new Set(offsets).size, 20);
    assert.equal(offsets[active], 0);
    assert.equal(Math.min(...offsets), -10);
    assert.equal(Math.max(...offsets), 9);
  }
  assert.equal(deck.getNextCardIndex(19, 1, 20), 0);
  assert.equal(deck.getNextCardIndex(0, -1, 20), 19);
  assert.equal(deck.getNextCardIndex(0, -41, 20), 19);
  assert.equal(deck.getNextCardIndex(0, 1, 0), -1);
});

test('responsive shelf exposes six desktop cards and compact tablet and mobile sets', () => {
  for (const [width, cardWidth, count] of [[1450, 174, 6], [1098, 160, 6], [820, 180, 4], [702, 290, 2], [374, 340, 1]]) {
    assert.equal(deck.getVisibleCardCount(width, 20), count);
    const layout = Array.from({ length: count }, (_, i) => deck.getDeckLayout(i, count, width, cardWidth));
    assert.equal(layout[0].x, 0);
    for (let i = 0; i < count; i++) {
      assert.equal(layout[i].scale, 1);
      assert.equal(layout[i].y, 0);
      if (i < count - 1) assert.ok(layout[i + 1].x > layout[i].x);
    }
  }
});

test('mounts once and handles arrows and swipes while keeping every visible card interactive', () => {
  const listeners = {};
  const windowListeners = {};
  const previous = { addEventListener: (_, fn) => { listeners.previous = fn; } };
  const next = { addEventListener: (_, fn) => { listeners.next = fn; } };
  const current = { setAttribute() {} };
  const total = {};
  const cards = Array.from({ length: 20 }, (_, i) => {
    const classes = new Set();
    const body = {};
    const attrs = new Map();
    return { dataset: { voiceName: `Voice ${i}` }, offsetWidth: 232,
      classList: { toggle: (k, v) => v ? classes.add(k) : classes.delete(k), contains: (k) => classes.has(k) },
      style: { setProperty() {} }, contains: () => false,
      setAttribute: (k, v) => attrs.set(k, v), removeAttribute: (k) => attrs.delete(k),
      getAttribute: (k) => attrs.get(k), querySelector: () => body };
  });
  const panel = { querySelector: (sel) => ({ '[data-voice-deck-current]': current, '[data-voice-deck-total]': total, '[data-voice-deck-prev]': previous, '[data-voice-deck-next]': next })[sel] };
  const track = { clientWidth: 1300, dataset: {}, style: { setProperty() {} }, querySelectorAll: () => cards,
    closest: () => panel, setAttribute() {}, dispatchEvent() {},
    addEventListener: (name, fn) => { listeners[name] = fn; } };
  const document = { readyState: 'complete', querySelectorAll: () => [track] };
  const window = { document, addEventListener: (name, fn) => { windowListeners[name] = fn; }, CustomEvent: class {} };
  runInNewContext(readFileSync(require.resolve('../voices-carousel.js'), 'utf8'), { window });
  const checkActive = (index) => {
    assert.equal(track.dataset.activeCard, String(index + 1));
    assert.equal(cards.filter(c => !c.hidden).length, 6);
    assert.equal(cards[index].hidden, false);
    assert.equal(cards.filter(c => c.classList.contains('is-active')).length, 1);
    assert.equal(cards[index].getAttribute('aria-current'), 'true');
    cards.forEach((c) => assert.equal(c.querySelector().inert, c.hidden));
  };
  checkActive(0);
  assert.equal(total.textContent, '20');
  listeners.next(); checkActive(1);
  listeners.previous(); checkActive(0);
  listeners.keydown({ key: 'Home', preventDefault() {} }); checkActive(0);
  listeners.keydown({ key: 'ArrowLeft', preventDefault() {} }); checkActive(19);
  listeners.keydown({ key: 'ArrowRight', preventDefault() {} }); checkActive(0);
  listeners.click({ target: { closest: () => cards[4] }, preventDefault() {}, stopPropagation() {} }); checkActive(0);
  listeners.pointerdown({ button: 0, clientX: 200, clientY: 100, pointerId: 1 });
  windowListeners.pointerup({ clientX: 100, clientY: 104, pointerId: 1 }); checkActive(1);
  listeners.click({ preventDefault() {}, stopPropagation() {} }); checkActive(1);
  // Vertical page scrolling must not change the selected voice.
  listeners.pointerdown({ button: 0, clientX: 200, clientY: 100, pointerId: 1 });
  windowListeners.pointerup({ clientX: 170, clientY: 250, pointerId: 1 }); checkActive(1);
  deck.mountVoiceDecks(document); checkActive(1);
});

test('every catalogue demo has a real envelope and a positive duration', () => {
  const window = {};
  runInNewContext(readFileSync(require.resolve('../voice-waveforms.js'), 'utf8'), { window });
  const source = readFileSync(require.resolve('../script.js'), 'utf8').split('const voiceSlides = [')[1].split('\n];')[0];
  const urls = [...source.matchAll(/audio: '([^']+)'/g)].map(match => match[1]);
  assert.equal(urls.length, 20);
  const shapes = new Set();
  for (const url of urls) {
    const sample = window.KupiVoiceWaveforms[url];
    assert.ok(sample.duration > 0);
    assert.equal(sample.bars.length, 48);
    assert.ok(sample.bars.every(bar => Number.isInteger(bar) && bar >= 3 && bar <= 34));
    shapes.add(sample.bars.join(','));
  }
  assert.equal(shapes.size, 20);
});
