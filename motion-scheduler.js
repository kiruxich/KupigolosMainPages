(function attachMotionScheduler(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KupiMotion = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function createMotionScheduler({
    initialValue = 0,
    precision = 0.0001,
    render,
    requestFrame = requestAnimationFrame,
    responsiveness = 18,
  }) {
    let currentValue = initialValue;
    let targetValue = initialValue;
    let frameId = null;
    let previousTime = null;

    function schedule() {
      if (frameId === null) frameId = requestFrame(tick);
    }

    function tick(time) {
      frameId = null;
      const elapsed = previousTime === null ? 1000 / 60 : Math.min(64, Math.max(1, time - previousTime));
      previousTime = time;

      const blend = 1 - Math.exp(-responsiveness * elapsed / 1000);
      currentValue += (targetValue - currentValue) * blend;
      const settled = Math.abs(targetValue - currentValue) <= precision;
      if (settled) currentValue = targetValue;

      const keepAlive = render(currentValue, time, { settled, target: targetValue }) === true;
      if (!settled || keepAlive) schedule();
      else previousTime = null;
    }

    return {
      getValue: () => currentValue,
      invalidate: schedule,
      isRunning: () => frameId !== null,
      setTarget(value, { immediate = false } = {}) {
        if (!Number.isFinite(value)) return;
        targetValue = value;
        if (immediate) {
          currentValue = value;
          previousTime = null;
        }
        schedule();
      },
    };
  }

  return { createMotionScheduler };
}));
