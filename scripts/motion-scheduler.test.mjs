import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
let createMotionScheduler;
let calculateSectionProgress;
let calculateRevealRange;

try {
  ({ createMotionScheduler, calculateSectionProgress, calculateRevealRange } = require(resolve(import.meta.dirname, '..', 'motion-scheduler.js')));
} catch {
  createMotionScheduler = undefined;
  calculateSectionProgress = undefined;
  calculateRevealRange = undefined;
}

function createHarness({ frameMs = 1000 / 60 } = {}) {
  const queue = [];
  const renders = [];
  let nextFrameId = 1;
  let time = 0;

  const scheduler = createMotionScheduler({
    initialValue: 0,
    responsiveness: 18,
    precision: 0.0001,
    requestFrame(callback) {
      queue.push(callback);
      return nextFrameId++;
    },
    render(value) {
      renders.push(value);
      return false;
    },
  });

  return {
    queue,
    renders,
    scheduler,
    step() {
      const callback = queue.shift();
      assert.ok(callback, 'expected a scheduled animation frame');
      time += frameMs;
      callback(time);
    },
    runUntilIdle(limit = 240) {
      let frames = 0;
      while (queue.length && frames < limit) {
        this.step();
        frames += 1;
      }
      assert.ok(frames < limit, 'animation loop must settle instead of running forever');
      return frames;
    },
  };
}

test('coalesces scroll updates and sleeps after reaching the target', () => {
  assert.equal(typeof createMotionScheduler, 'function', 'motion scheduler is not implemented');
  const harness = createHarness();

  harness.scheduler.setTarget(0.2);
  harness.scheduler.setTarget(0.65);
  harness.scheduler.setTarget(1);

  assert.equal(harness.queue.length, 1, 'multiple scroll events must share one animation frame');
  const frameCount = harness.runUntilIdle();

  assert.ok(frameCount > 1, 'motion should ease instead of snapping');
  assert.equal(harness.queue.length, 0, 'no frame may remain scheduled at rest');
  assert.equal(harness.scheduler.isRunning(), false);
  assert.equal(harness.scheduler.getValue(), 1);
});

test('uses time-based damping at both 60 Hz and 120 Hz', () => {
  assert.equal(typeof createMotionScheduler, 'function', 'motion scheduler is not implemented');
  const sixty = createHarness({ frameMs: 1000 / 60 });
  const oneTwenty = createHarness({ frameMs: 1000 / 120 });

  sixty.scheduler.setTarget(1);
  oneTwenty.scheduler.setTarget(1);

  for (let elapsed = 0; elapsed < 250; elapsed += 1000 / 60) sixty.step();
  for (let elapsed = 0; elapsed < 250; elapsed += 1000 / 120) oneTwenty.step();

  assert.ok(Math.abs(sixty.scheduler.getValue() - oneTwenty.scheduler.getValue()) < 0.015);
});

test('interpolates progress continuously between uneven section anchors', () => {
  assert.equal(typeof calculateSectionProgress, 'function', 'section progress calculator is not implemented');
  const anchors = [0, 1000, 4000, 4600];
  const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9);

  closeTo(calculateSectionProgress(0, anchors), 0);
  closeTo(calculateSectionProgress(500, anchors), 1 / 6);
  closeTo(calculateSectionProgress(2500, anchors), 1 / 2);
  closeTo(calculateSectionProgress(4300, anchors), 5 / 6);
  closeTo(calculateSectionProgress(9999, anchors), 1);
});

test('staggered reveal ranges stay ordered without growing unbounded', () => {
  assert.equal(typeof calculateRevealRange, 'function', 'reveal range calculator is not implemented');

  assert.deepEqual(calculateRevealRange(0), { start: '8%', end: '74%' });
  assert.deepEqual(calculateRevealRange(2), { start: '13%', end: '79%' });
  assert.deepEqual(calculateRevealRange(20), { start: '18%', end: '84%' });
  assert.deepEqual(calculateRevealRange(-3), { start: '8%', end: '74%' });
});
