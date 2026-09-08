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

test('visible fan reaches both edges with nine desktop or five mobile cards', () => {
  for (const [width, cardWidth, count] of [[1450, 320, 9], [1098, 294, 9], [702, 280, 9], [374, 265.2, 5], [304, 217.6, 5]]) {
    assert.equal(deck.getVisibleCardCount(width, 20), count);
    const half = Math.floor(count / 2);
    const layout = Array.from({ length: count }, (_, i) => deck.getDeckLayout(i - half, count, width, cardWidth));
    const bounds = layout.map(({ x, scale }) => ({ left: width / 2 + x - cardWidth * scale / 2, right: width / 2 + x + cardWidth * scale / 2 }));
    assert.ok(Math.abs(bounds[0].left) < .001);
    assert.ok(Math.abs(bounds[count - 1].right - width) < .001);
    assert.equal(layout[half].x, 0);
    assert.equal(layout[half].scale, 1);
    for (let i = 0; i < count; i++) {
      assert.ok(bounds[i].left >= -.001 && bounds[i].right <= width + .001);
      if (i !== half) assert.ok(layout[i].layer < layout[half].layer);
      if (i < count - 1) {
        assert.ok(bounds[i].right > bounds[i + 1].left);
        assert.ok(layout[i + 1].x > layout[i].x);
      }
    }
  }
});

test('mounts once and handles arrows, direct selection and swipes without activating hidden controls', () => {
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
  const track = { clientWidth: 1300, dataset: {}, querySelectorAll: () => cards,
    closest: () => panel, setAttribute() {}, dispatchEvent() {},
    addEventListener: (name, fn) => { listeners[name] = fn; } };
  const document = { readyState: 'complete', querySelectorAll: () => [track] };
  const window = { document, addEventListener: (name, fn) => { windowListeners[name] = fn; }, CustomEvent: class {} };
  runInNewContext(readFileSync(require.resolve('../voices-carousel.js'), 'utf8'), { window });
  const checkActive = (index) => {
    assert.equal(track.dataset.activeCard, String(index + 1));
    assert.equal(cards.filter(c => !c.hidden).length, 9);
    assert.equal(cards[index].hidden, false);
    assert.equal(cards.filter(c => c.classList.contains('is-active')).length, 1);
    assert.equal(cards[index].getAttribute('aria-current'), 'true');
    cards.forEach((c, i) => assert.equal(c.querySelector().inert, i !== index));
  };
  checkActive(10);
  assert.equal(total.textContent, '20');
  listeners.next(); checkActive(11);
  listeners.previous(); checkActive(10);
  listeners.keydown({ key: 'Home', preventDefault() {} }); checkActive(0);
  listeners.keydown({ key: 'ArrowLeft', preventDefault() {} }); checkActive(19);
  listeners.keydown({ key: 'ArrowRight', preventDefault() {} }); checkActive(0);
  listeners.click({ target: { closest: () => cards[4] }, preventDefault() {}, stopPropagation() {} }); checkActive(4);
  listeners.pointerdown({ button: 0, clientX: 200, clientY: 100, pointerId: 1 });
  windowListeners.pointerup({ clientX: 100, clientY: 104, pointerId: 1 }); checkActive(5);
  listeners.click({ preventDefault() {}, stopPropagation() {} }); checkActive(5);
  // Vertical page scrolling must not change the selected voice.
  listeners.pointerdown({ button: 0, clientX: 200, clientY: 100, pointerId: 1 });
  windowListeners.pointerup({ clientX: 170, clientY: 250, pointerId: 1 }); checkActive(5);
  deck.mountVoiceDecks(document); checkActive(5);
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
