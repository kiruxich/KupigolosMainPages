import { homeRuntimeSources } from "./runtime-sources.generated";

export function mountHomeRuntime(
  root: Document,
  sources: readonly string[] = homeRuntimeSources,
): () => void {
  const win = root.defaultView as (Window & typeof globalThis) | null;
  if (!win) return () => {};
  const disposers: (() => void)[] = [];
  const scripts: HTMLScriptElement[] = [];
  const eventPrototype = win.EventTarget.prototype;
  const originalAdd = eventPrototype.addEventListener;
  const originalRemove = eventPrototype.removeEventListener;

  // Legacy scripts register their resources synchronously. Capture ownership only
  // during their execution, then immediately restore the browser APIs.
  eventPrototype.addEventListener = function (type, listener, options) {
    originalAdd.call(this, type, listener, options);
    const capture = typeof options === "boolean" ? options : options?.capture;
    disposers.push(() => originalRemove.call(this, type, listener, capture));
  };
  const originals = {
    IntersectionObserver: win.IntersectionObserver,
    ResizeObserver: win.ResizeObserver,
    Audio: win.Audio,
  };
  if (originals.IntersectionObserver) {
    win.IntersectionObserver = new Proxy(originals.IntersectionObserver, {
      construct(target, args) {
        const observer = Reflect.construct(target, args) as IntersectionObserver;
        disposers.push(() => observer.disconnect());
        return observer;
      },
    });
  }
  if (originals.ResizeObserver) {
    win.ResizeObserver = new Proxy(originals.ResizeObserver, {
      construct(target, args) {
        const observer = Reflect.construct(target, args) as ResizeObserver;
        disposers.push(() => observer.disconnect());
        return observer;
      },
    });
  }
  win.Audio = new Proxy(originals.Audio, {
    construct(target, args) {
      const audio = Reflect.construct(target, args) as HTMLAudioElement;
      disposers.push(() => { audio.pause(); audio.removeAttribute("src"); });
      return audio;
    },
  });
  try {
    sources.forEach((source, index) => {
      const script = root.createElement("script");
      script.dataset.homeRuntime = String(index);
      script.text = `{\n${source}\n}`;
      scripts.push(script);
      root.body.append(script);
    });
  } finally {
    eventPrototype.addEventListener = originalAdd;
    Object.assign(win, originals);
  }

  return () => {
    disposers.reverse().forEach((dispose) => dispose());
    scripts.forEach((script) => script.remove());
    root.querySelectorAll<HTMLElement>("[data-voice-deck-ready]").forEach((track) => {
      delete track.dataset.voiceDeckReady;
    });
    root.querySelectorAll(".is-playing").forEach((button) => {
      button.classList.remove("is-playing");
      button.setAttribute("aria-pressed", "false");
    });
    root.body.classList.remove("is-audio-playing");
    root.body.classList.remove("menu-open", "overlay-open", "drawer-open");
  };
}
