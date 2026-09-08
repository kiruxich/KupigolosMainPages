(function attachMotionScheduler(root, factory) {
  const api = factory();

  if (typeof window === 'undefined' && typeof module === 'object' && module.exports) module.exports = api;
  else root.KupiMotion = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function calculateSectionProgress(scrollY, sectionAnchors) {
    if (!Array.isArray(sectionAnchors) || sectionAnchors.length < 2) return 0;

    const lastIndex = sectionAnchors.length - 1;
    const position = Number.isFinite(scrollY) ? scrollY : 0;
    if (position <= sectionAnchors[0]) return 0;
    if (position >= sectionAnchors[lastIndex]) return 1;

    for (let upperIndex = 1; upperIndex <= lastIndex; upperIndex += 1) {
      const upperAnchor = sectionAnchors[upperIndex];
      if (position > upperAnchor) continue;

      const lowerIndex = upperIndex - 1;
      const lowerAnchor = sectionAnchors[lowerIndex];
      const span = upperAnchor - lowerAnchor;
      const localProgress = span > 0
        ? Math.min(1, Math.max(0, (position - lowerAnchor) / span))
        : 1;
      return (lowerIndex + localProgress) / lastIndex;
    }

    return 1;
  }

  function calculateRevealRange(index) {
    const order = Number.isFinite(index) ? Math.max(0, Math.floor(index)) : 0;
    const offset = Math.min(10, order * 2.5);
    return {
      start: `${8 + offset}%`,
      end: `${74 + offset}%`,
    };
  }

  function renderRailProgress(element, progress) {
    if (!element?.style) return;
    const value = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
    element.style.transform = `scaleY(${value})`;
  }

  function configureScrollPerformance({ rail, progress, lazyImages = [] } = {}) {
    if (rail?.style) {
      rail.style.backdropFilter = 'none';
      rail.style.webkitBackdropFilter = 'none';
    }

    if (progress?.style) {
      progress.style.height = 'auto';
      progress.style.bottom = '0px';
      progress.style.transition = 'none';
      progress.style.willChange = 'transform';
      progress.style.transformOrigin = 'top';
    }

    Array.from(lazyImages).forEach((image) => {
      image.decoding = 'async';
    });
  }

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

  return {
    calculateRevealRange,
    calculateSectionProgress,
    configureScrollPerformance,
    createMotionScheduler,
    renderRailProgress,
  };
}));
