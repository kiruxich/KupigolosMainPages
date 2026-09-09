"use client";

import { useEffect, useRef } from "react";

type VoiceMeta = {
  gender: "мужской" | "женский";
  age: string;
  timbre: string;
  category: string;
  popularity: number;
};

const women = new Set(["Татьяна Шитова", "Елена Соловьёва", "Юлия Рутберг", "Евдокия Лаврухина", "Ещё 200+ голосов"]);
const voiceMeta: Record<string, Partial<VoiceMeta>> = {
  "Илья Исаев": { age: "взрослый", timbre: "средний", category: "известные", popularity: 96 },
  "Владимир Зайцев": { age: "возрастной", timbre: "низкий", category: "известные", popularity: 100 },
  "Владимир Антоник": { age: "возрастной", timbre: "низкий", category: "известные", popularity: 98 },
  "Станислав Концевич": { age: "взрослый", timbre: "средний", category: "известные", popularity: 90 },
  "Сергей Бурунов": { age: "взрослый", timbre: "средний", category: "известные", popularity: 99 },
  "Сергей Чонишвили": { age: "взрослый", timbre: "низкий", category: "актеры дубляжа", popularity: 97 },
  "Никита Прозоровский": { age: "взрослый", timbre: "средний", category: "актеры дубляжа", popularity: 92 },
  "Татьяна Шитова": { age: "взрослый", timbre: "средний", category: "известные", popularity: 96 },
  "Елена Соловьёва": { age: "взрослый", timbre: "средний", category: "известные", popularity: 95 },
  "Юлия Рутберг": { age: "взрослый", timbre: "низкий", category: "известные", popularity: 94 },
  "Евдокия Лаврухина": { age: "молодёжный", timbre: "высокий", category: "актеры дубляжа", popularity: 89 },
  "Ещё 200+ голосов": { age: "взрослый", timbre: "средний", category: "все", popularity: 0 },
};

function normalized(value: string | null | undefined) {
  return (value ?? "").trim().toLocaleLowerCase("ru-RU");
}

function priceFrom(card: Element) {
  const text = card.querySelector(".kg-price")?.textContent ?? "";
  const amount = Number(text.replace(/\D/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : Number.POSITIVE_INFINITY;
}

export function CatalogRuntime({ html, documentKey }: { html: string; documentKey: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".kg-voice")];
    if (!cards.length) return;

    let expanded = false;
    const listeners: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(element: HTMLElement, event: K, handler: (event: HTMLElementEventMap[K]) => void) => {
      element.addEventListener(event, handler as EventListener);
      listeners.push(() => element.removeEventListener(event, handler as EventListener));
    };

    cards.forEach((card, index) => {
      const name = card.querySelector("h3")?.textContent?.trim() ?? "";
      const preset = voiceMeta[name] ?? {};
      card.dataset.gender = preset.gender ?? (women.has(name) ? "женский" : "мужской");
      card.dataset.age = preset.age ?? "взрослый";
      card.dataset.timbre = preset.timbre ?? "средний";
      card.dataset.category = documentKey === "dubbing" ? "актеры дубляжа" : documentKey === "famous" ? "известные" : (preset.category ?? "известные");
      card.dataset.popularity = String(preset.popularity ?? 80 - index);
      card.dataset.hasDemo = String(Boolean(card.querySelector(".kg-source-player") || normalized(card.textContent).includes("демо")));
      card.dataset.price = String(priceFrom(card));
    });

    const live = document.createElement("p");
    live.className = "kg-live-results";
    live.setAttribute("aria-live", "polite");
    root.querySelector(".kg-catalog-head, .kg-catalog-note")?.append(live);

    const search = root.querySelector<HTMLInputElement>('.kg-search input[aria-label*="Поиск"], .kg-search input');
    const selects = [...root.querySelectorAll<HTMLSelectElement>(".kg-search select")];
    const groupValues = (heading: string) => [...root.querySelectorAll<HTMLElement>(".kg-filter-group")]
      .filter((group) => normalized(group.querySelector("b")?.textContent).includes(normalized(heading)))
      .flatMap((group) => [...group.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked, input[type="radio"]:checked')])
      .map((input) => normalized(input.parentElement?.textContent));

    const selectedTop = (kind: string) => {
      const select = selects.find((item) => normalized(item.getAttribute("aria-label")).includes(kind) || normalized(item.options[0]?.text).includes(kind));
      const value = normalized(select?.value);
      return value && !["пол", "возраст", "тембр", "по цене", "сортировка"].includes(value) ? value : "";
    };

    const apply = () => {
      const query = normalized(search?.value);
      const gender = selectedTop("пол") ? [selectedTop("пол")] : groupValues("пол");
      const age = selectedTop("возраст") ? [selectedTop("возраст")] : groupValues("возраст");
      const timbre = selectedTop("тембр") ? [selectedTop("тембр")] : groupValues("тембр");
      const category = normalized(groupValues("категория")[0]);
      const priceInputs = [...root.querySelectorAll<HTMLInputElement>(".kg-range input")];
      const min = Number(priceInputs[0]?.value || 0);
      const max = Number(priceInputs[1]?.value || Number.POSITIVE_INFINITY);
      const checkedLabels = [...root.querySelectorAll<HTMLInputElement>('.kg-sidebar input[type="checkbox"]:checked')].map((input) => normalized(input.parentElement?.textContent));
      const hideNegotiated = checkedLabels.some((value) => value.includes("договорн"));
      const requireNoDemo = checkedLabels.some((value) => value.includes("без демо"));
      const matchesAny = (actual: string | undefined, values: string[]) => values.length === 0 || values.some((value) => normalized(actual).includes(value.replace(/ие$/, "ой").replace(/ая$/, "ий")));

      const matched = cards.filter((card) => {
        const cardPrice = Number(card.dataset.price);
        return (!query || normalized(card.textContent).includes(query))
          && matchesAny(card.dataset.gender, gender)
          && matchesAny(card.dataset.age, age)
          && matchesAny(card.dataset.timbre, timbre)
          && (!category || category === "все" || normalized(card.dataset.category).includes(category.replace("актёры", "актеры")))
          && (!hideNegotiated || Number.isFinite(cardPrice))
          && (!requireNoDemo || card.dataset.hasDemo === "false")
          && (cardPrice === Number.POSITIVE_INFINITY || (cardPrice >= min && cardPrice <= max));
      });

      const sortValue = normalized(selects.find((select) => normalized(select.value).includes("популяр"))?.value || selects.at(-1)?.value);
      const sorted = [...matched].sort((a, b) => sortValue.includes("популяр")
        ? Number(b.dataset.popularity) - Number(a.dataset.popularity)
        : Number(a.dataset.price) - Number(b.dataset.price));
      const parent = cards[0]?.parentElement;
      sorted.forEach((card) => parent?.append(card));
      cards.forEach((card) => { card.hidden = true; });
      sorted.slice(0, expanded ? undefined : 4).forEach((card) => { card.hidden = false; });
      live.textContent = `Найдено: ${matched.length}`;
      root.querySelectorAll<HTMLElement>(".kg-more").forEach((more) => {
        more.hidden = matched.length <= 4 || expanded;
      });
    };

    root.querySelectorAll<HTMLElement>("input, select").forEach((element) => on(element, "change", apply));
    if (search) on(search, "input", apply);
    root.querySelectorAll<HTMLElement>(".kg-search button, .kg-filter-actions .primary").forEach((button) => on(button, "click", apply));
    root.querySelectorAll<HTMLElement>(".kg-filter-actions .reset").forEach((button) => on(button, "click", () => {
      root.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => { input.checked = false; });
      root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input, index) => { input.checked = index === 0; });
      root.querySelectorAll<HTMLInputElement>('.kg-range input, .kg-search input').forEach((input) => { input.value = ""; });
      selects.forEach((select) => { select.selectedIndex = 0; });
      expanded = false;
      apply();
    }));
    root.querySelectorAll<HTMLElement>(".kg-more a").forEach((button) => on(button, "click", (event) => {
      event.preventDefault();
      expanded = true;
      apply();
    }));
    root.querySelectorAll<HTMLElement>(".kg-source-player, .kg-voice-actions a:first-child").forEach((player) => on(player, "click", (event) => {
      if (normalized(player.textContent).includes("заказать")) return;
      event.preventDefault();
      const active = player.classList.toggle("is-playing");
      player.setAttribute("aria-pressed", String(active));
    }));
    apply();
    return () => listeners.forEach((remove) => remove());
  }, [documentKey, html]);

  return <div id="start" ref={rootRef} className="seo-document" dangerouslySetInnerHTML={{ __html: html }} />;
}
