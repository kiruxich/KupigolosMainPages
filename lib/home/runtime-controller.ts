import { homeRuntimeSources } from "./runtime-sources.generated";
import { preprodVoiceCatalog } from "@/components/home/voice-catalog.generated";

type VoiceCatalogWindow = Window & typeof globalThis & {
  KupiVoiceCatalog?: unknown;
};

function adaptVoiceRuntimeSource(source: string): string {
  return source
    .replace("catalog.length < 20", "catalog.length < 1")
    .replace("catalog.slice(0, 20).forEach((voice) => {", "catalog.forEach((voice) => {")
    .replace(
      "portrait?.classList.toggle('has-audio-progress', progress > 0);",
      "portrait?.classList.toggle('has-audio-progress', button.classList.contains('is-playing'));",
    )
    .replace(
      "  audioToast?.classList.remove('is-visible');",
      "  document.querySelectorAll('.figma-voice-portrait.has-audio-progress').forEach((portrait) => { portrait.classList.remove('has-audio-progress'); portrait.style.removeProperty('--voice-progress-value'); });\n  audioToast?.classList.remove('is-visible');",
    )
    .replace(
      "      const price = card.querySelector('.figma-voice-price');\n      const duration = card.querySelector('.figma-voice-meta > span');",
      "      const price = card.querySelector('.figma-voice-price');\n      const contact = card.querySelector('.figma-voice-contact');\n      const duration = card.querySelector('.figma-voice-meta > span');",
    )
    .replace(
      "      role.textContent = `Голос ${voice.role}`;\n      card.querySelector('.figma-voice-body').prepend(role);",
      "      role?.remove();",
    )
    .replace(
      "      image.alt = voice.name;",
      "      image.alt = voice.name;\n      image.loading = 'lazy';\n      image.decoding = 'async';",
    )
    .replace(
      "      if (duration) duration.textContent = 'Демо голоса';",
      "      if (duration) { duration.textContent = '—:—'; duration.dataset.voiceElapsed = ''; }",
    )
    .replace(
      "      price.href = voice.href;\n      price.textContent = voice.price || 'Узнать стоимость';\n      card.querySelector('.figma-voice-meta > i')?.remove();",
      "      if (price.matches('a')) price.href = voice.href;\n      price.textContent = voice.price || 'Узнать стоимость';\n      if (contact) contact.href = voice.orderHref || voice.href;\n      const crown = card.querySelector('.figma-voice-meta > i');\n      if (crown) crown.hidden = !voice.featured;",
    )
    .replace(
      "      description.textContent = voice.description || `Узнаваемый голос ${voice.role}. Запись рекламы и озвучивание ваших проектов в студии.`;",
      "      description.textContent = voice.description || '';",
    );
}

export function mountHomeRuntime(
  root: Document,
  sources: readonly string[] = homeRuntimeSources,
): () => void {
  const win = root.defaultView as VoiceCatalogWindow | null;
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
    sources.forEach((rawSource, index) => {
      if (sources === homeRuntimeSources) win.KupiVoiceCatalog = preprodVoiceCatalog;
      const source = adaptVoiceRuntimeSource(rawSource);
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
