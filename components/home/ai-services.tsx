"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useRef, useState } from "react";

type AiModeId = "voice" | "video" | "text" | "music";

type AiMode = {
  id: AiModeId;
  tab: string;
  tabCopy: string;
  eyebrow: string;
  title: string;
  description: string;
  input: string;
  output: string;
  tags: string[];
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  tracks: Array<{ label: string; width: number; accent?: boolean }>;
  waveform: number[];
};

const AI_MODES: AiMode[] = [
  {
    id: "voice",
    tab: "Голос",
    tabCopy: "Создать речь и выбрать модель",
    eyebrow: "Голос и модели",
    title: "Соберите голос под задачу",
    description:
      "Задайте текст, подачу и темп. Пульт соберёт естественную речь, которую можно сразу забрать в проект.",
    input: "Текст и характер",
    output: "Готовая речь",
    tags: ["Voice AI", "Темп", "Интонация"],
    primaryLabel: "Создать голос",
    primaryHref: "https://kupigolos.ru/ai/voice/ai-voice-generator",
    secondaryLabel: "Посмотреть Fish Audio",
    secondaryHref: "https://kupigolos.ru/ai/fish-audio",
    tracks: [
      { label: "Текст", width: 88 },
      { label: "Модель", width: 72, accent: true },
      { label: "Подача", width: 62 },
    ],
    waveform: [24, 42, 72, 92, 56, 32, 64, 84, 48, 76, 96, 54, 30, 66, 88, 44, 72, 52, 86, 38, 68, 90, 58, 28],
  },
  {
    id: "video",
    tab: "Видео",
    tabCopy: "Добавить речь и локализацию",
    eyebrow: "Дубляж и локализация",
    title: "Озвучьте видео в одном окне",
    description:
      "Загрузите ролик, разложите реплики по дорожке и подберите голос. Синхронизация останется внутри сценария.",
    input: "Видео и сценарий",
    output: "Дорожка с речью",
    tags: ["Таймлайн", "Дубляж", "Языки"],
    primaryLabel: "Озвучить видео",
    primaryHref: "https://kupigolos.ru/ai/dubbing-video",
    secondaryLabel: "Собрать ИИ-озвучку",
    secondaryHref: "https://kupigolos.ru/ai/voice/ai-voice-over",
    tracks: [
      { label: "Видео", width: 94 },
      { label: "Реплики", width: 78, accent: true },
      { label: "Перевод", width: 56 },
    ],
    waveform: [18, 32, 58, 44, 76, 88, 62, 34, 52, 82, 94, 68, 40, 72, 54, 90, 66, 36, 78, 58, 84, 46, 70, 28],
  },
  {
    id: "text",
    tab: "Текст",
    tabCopy: "Превратить материал в аудио",
    eyebrow: "Text to speech",
    title: "Дайте тексту живое звучание",
    description:
      "Вставьте материал, расставьте паузы и получите ровную речь для курсов, презентаций и длинных форматов.",
    input: "Статья или сценарий",
    output: "MP3 или WAV",
    tags: ["Длинный текст", "Паузы", "Экспорт"],
    primaryLabel: "Озвучить текст",
    primaryHref: "https://kupigolos.ru/ai/voice/text-to-speech",
    secondaryLabel: "Настроить голос глубже",
    secondaryHref: "https://kupigolos.ru/ai/voice/ai-voice-generator",
    tracks: [
      { label: "Абзацы", width: 82 },
      { label: "Паузы", width: 48, accent: true },
      { label: "Экспорт", width: 68 },
    ],
    waveform: [22, 38, 54, 70, 46, 78, 60, 34, 66, 52, 86, 64, 42, 74, 50, 82, 58, 36, 68, 48, 76, 56, 40, 26],
  },
  {
    id: "music",
    tab: "Музыка",
    tabCopy: "Собрать трек или песню",
    eyebrow: "Музыка и песни",
    title: "Превратите идею в готовый трек",
    description:
      "Опишите настроение и жанр или добавьте свои слова. Сервис соберёт структуру, музыку и вокальную подачу.",
    input: "Идея и настроение",
    output: "Трек с вокалом",
    tags: ["Жанр", "BPM", "Вокал"],
    primaryLabel: "Создать песню",
    primaryHref: "https://kupigolos.ru/ai/music/song-generator",
    secondaryLabel: "Сгенерировать музыку",
    secondaryHref: "https://kupigolos.ru/ai/music/ai-music-generator",
    tracks: [
      { label: "Ритм", width: 92, accent: true },
      { label: "Мелодия", width: 74 },
      { label: "Вокал", width: 58 },
    ],
    waveform: [28, 64, 88, 46, 76, 96, 54, 84, 42, 70, 92, 60, 34, 80, 50, 90, 68, 38, 74, 98, 58, 82, 48, 30],
  },
];

export function AiServices() {
  const [activeId, setActiveId] = useState<AiModeId>("voice");
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeIndex = AI_MODES.findIndex((mode) => mode.id === activeId);
  const active = AI_MODES[activeIndex];

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    let nextIndex = index;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = AI_MODES.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % AI_MODES.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + AI_MODES.length) % AI_MODES.length;

    setActiveId(AI_MODES[nextIndex].id);
    tabListRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIndex]?.focus();
  };

  return (
    <section className="talent-stage talent-stage-ai" id="ai-services" aria-labelledby="ai-tools-title">
      <div className="shell">
        <section className="ai-signal-desk reveal" aria-labelledby="ai-tools-title">
          <header className="ai-signal-heading">
            <div>
              <p className="kicker">AI production desk</p>
              <h2 id="ai-tools-title">ИИ-инструменты</h2>
              <p>Выберите, что нужно собрать. Один пульт проведёт от исходника до готового звука.</p>
            </div>
            <a className="ai-signal-hub" href="https://ai.kupigolos.ru/">
              <span>Все сервисы</span>
              <i aria-hidden="true">↗</i>
            </a>
          </header>

          <div className="ai-signal-layout">
            <div className="ai-signal-tabs" ref={tabListRef} role="tablist" aria-label="Выберите задачу">
              <p>Что собираем</p>
              {AI_MODES.map((mode, index) => {
                const isActive = mode.id === active.id;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="tab"
                    id={`ai-tab-${mode.id}`}
                    aria-selected={isActive}
                    aria-controls="ai-tools-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={isActive ? "is-active" : undefined}
                    onClick={() => setActiveId(mode.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    <span>
                      <strong>{mode.tab}</strong>
                      <small>{mode.tabCopy}</small>
                    </span>
                    <i aria-hidden="true"><b></b><b></b><b></b></i>
                  </button>
                );
              })}
            </div>

            <article
              className="ai-signal-console"
              data-mode={active.id}
              role="tabpanel"
              id="ai-tools-panel"
              aria-labelledby={`ai-tab-${active.id}`}
            >
              <header className="ai-signal-console-head">
                <span>Сигнальный пульт</span>
                <span><i aria-hidden="true"></i>Готов к работе</span>
              </header>

              <div className="ai-signal-console-body">
                <div className="ai-signal-copy">
                  <p>{active.eyebrow}</p>
                  <h3>{active.title}</h3>
                  <span>{active.description}</span>
                  <div className="ai-signal-tags" aria-label="Возможности">
                    {active.tags.map((tag) => <small key={tag}>{tag}</small>)}
                  </div>
                </div>

                <div className="ai-signal-flow" aria-hidden="true">
                  <div className="ai-signal-node ai-signal-node-input">
                    <span>Вход</span>
                    <strong>{active.input}</strong>
                  </div>

                  <div className="ai-signal-wave" data-mode={active.id}>
                    <span className="ai-signal-wave-line"></span>
                    {active.waveform.map((height, index) => (
                      <i
                        key={`${active.id}-${index}`}
                        style={{ "--signal-height": `${height}%`, "--signal-delay": `${index * -42}ms` } as CSSProperties}
                      ></i>
                    ))}
                  </div>

                  <div className="ai-signal-node ai-signal-node-output">
                    <span>Выход</span>
                    <strong>{active.output}</strong>
                  </div>

                  <div className="ai-signal-tracks">
                    {active.tracks.map((track) => (
                      <div key={track.label}>
                        <span>{track.label}</span>
                        <i><b className={track.accent ? "is-accent" : undefined} style={{ width: `${track.width}%` }}></b></i>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <footer className="ai-signal-actions">
                <a className="ai-signal-primary" href={active.primaryHref}>
                  <span>{active.primaryLabel}</span>
                  <i aria-hidden="true">↗</i>
                </a>
                <a className="ai-signal-secondary" href={active.secondaryHref}>{active.secondaryLabel}</a>
              </footer>
            </article>
          </div>

          <nav className="ai-signal-routes" aria-label="Дополнительные ИИ-инструменты">
            <a href="https://kupigolos.ru/ai/fish-audio">
              <span><strong>Fish Audio</strong><small>Новая модель голоса</small></span>
              <em>Скоро</em>
            </a>
            <a href="https://kupigolos.ru/ai/voice/ai-voice-over">
              <span><strong>ИИ-озвучка</strong><small>Текст, видео, диалоги и боты</small></span>
              <i aria-hidden="true">↗</i>
            </a>
          </nav>

          <footer className="ai-signal-facts" aria-label="Преимущества ИИ-сервисов">
            <span>Работает без VPN</span>
            <span>Оплата российскими картами</span>
            <span>Единая подписка</span>
            <span>Генерация в браузере</span>
          </footer>
        </section>
      </div>
    </section>
  );
}
