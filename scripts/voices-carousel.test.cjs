const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

const voiceDeck = require('../voices-carousel.js');

test('selects the card nearest the horizontal center of the deck', () => {
  const cards = [
    { getBoundingClientRect: () => ({ left: -170, width: 220 }) },
    { getBoundingClientRect: () => ({ left: 70, width: 220 }) },
    { getBoundingClientRect: () => ({ left: 310, width: 220 }) },
  ];

  assert.equal(typeof voiceDeck.getCenteredCardIndex, 'function');
  assert.equal(
    voiceDeck.getCenteredCardIndex(cards, { left: 0, width: 420 }),
    1,
  );
});

test('derives equal side padding so the active card can snap to center', () => {
  assert.equal(typeof voiceDeck.getCenterPadding, 'function');
  assert.equal(voiceDeck.getCenterPadding(640, 232), 204);
  assert.equal(voiceDeck.getCenterPadding(220, 232), 0);
});

test('marks only the centered card as active', () => {
  const createCard = (left) => {
    const classes = new Set();
    const attributes = new Map();
    return {
      classList: {
        toggle(name, enabled) {
          if (enabled) classes.add(name);
          else classes.delete(name);
        },
        contains(name) {
          return classes.has(name);
        },
      },
      getBoundingClientRect: () => ({ left, width: 220 }),
      setAttribute(name, value) {
        attributes.set(name, value);
      },
      removeAttribute(name) {
        attributes.delete(name);
      },
      getAttribute(name) {
        return attributes.get(name);
      },
    };
  };
  const cards = [createCard(-170), createCard(70), createCard(310)];
  const track = {
    dataset: {},
    querySelectorAll: () => cards,
    getBoundingClientRect: () => ({ left: 0, width: 420 }),
  };

  assert.equal(typeof voiceDeck.syncActiveCard, 'function');
  assert.equal(voiceDeck.syncActiveCard(track), 1);
  assert.deepEqual(cards.map((card) => card.classList.contains('is-active')), [false, true, false]);
  assert.equal(cards[1].getAttribute('aria-current'), 'true');
  assert.equal(cards[0].getAttribute('aria-current'), undefined);
});

test('boots in a browser context and marks the first centered card active', () => {
  const classes = new Set();
  const card = {
    classList: {
      toggle(name, enabled) {
        if (enabled) classes.add(name);
        else classes.delete(name);
      },
      contains: (name) => classes.has(name),
    },
    getBoundingClientRect: () => ({ left: 90, width: 220 }),
    offsetLeft: 90,
    offsetWidth: 220,
    setAttribute() {},
    removeAttribute() {},
  };
  const track = {
    clientWidth: 400,
    dataset: {},
    style: { setProperty() {} },
    querySelectorAll: () => [card],
    getBoundingClientRect: () => ({ left: 0, width: 400 }),
    setAttribute() {},
    addEventListener() {},
  };
  const document = {
    readyState: 'complete',
    querySelectorAll: () => [track],
  };
  const window = {
    document,
    requestAnimationFrame(callback) {
      callback();
      return 1;
    },
  };
  const source = readFileSync(require.resolve('../voices-carousel.js'), 'utf8');

  assert.doesNotThrow(() => runInNewContext(source, { window }));
  assert.equal(track.dataset.voiceDeckReady, 'true');
  assert.equal(classes.has('is-active'), true);
});
