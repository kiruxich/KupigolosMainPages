import { homeRuntimeSources } from "./runtime-sources.generated";

export function mountHomeRuntime(
  root: Document,
  sources: readonly string[] = homeRuntimeSources,
): () => void {
  const scripts = sources.map((source, index) => {
    const script = root.createElement("script");
    script.dataset.homeRuntime = String(index);
    script.text = `{\n${source}\n}`;
    root.body.append(script);
    return script;
  });

  return () => {
    scripts.forEach((script) => script.remove());
    root.body.classList.remove("menu-open", "overlay-open", "drawer-open");
  };
}

