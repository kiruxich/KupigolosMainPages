"use client";

import { useState, type CSSProperties } from "react";
import styles from "./process.module.css";

const steps = [
  {
    title: "Бриф и материалы",
    time: "0:00",
    text: "Получаем текст, видео или другой исходник, уточняем формат, хронометраж, сроки и технические требования.",
  },
  {
    title: "Подбор команды",
    time: "0:30",
    text: "Выбираем диктора или актеров, при необходимости подключаем переводчика, редактора, режиссера дубляжа и звукорежиссера.",
  },
  {
    title: "Запись и контроль",
    time: "1:00",
    text: "Записываем материал в студии. При сложной актерской задаче режиссер помогает добиться нужной подачи и характера.",
  },
  {
    title: "Монтаж и сдача",
    time: "1:30",
    text: "Чистим запись, монтируем, выполняем сведение и передаем готовые файлы. Формат сдачи согласуется до производства.",
  },
] as const;

// A deterministic decorative waveform, not an audio player or a loading state.
const waveformPath = Array.from({ length: 300 }, (_, index) => {
  const progress = index / 299;
  const envelope = 3 + 57 * progress ** 1.6;
  const phrase = .18 + .82 * Math.abs(Math.sin(index * .069) * Math.cos(index * .037));
  const detail = .18 + .82 * Math.abs(Math.sin(index * 1.91));
  const height = 1.5 + envelope * phrase * detail;
  const x = index * 4 + 2;
  return `M${x},${(64 - height).toFixed(2)}l1.25,${height.toFixed(2)}-1.25,${height.toFixed(2)}-1.25,-${height.toFixed(2)}Z`;
}).join(" ");

export function Process() {
  const [activeStep, setActiveStep] = useState(3);
  const [positions, setPositions] = useState([0, 0, 0, 0]);

  function moveFader(index: number, value: number) {
    setActiveStep(index);
    setPositions(previous => previous.map((position, step) => step === index ? value : position));
  }

  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className="shell">
        <p className={styles.kicker}>От задачи до готового файла</p>
        <h2 id="process-title" className={styles.title}>
          Как проходит профессиональная озвучка
        </h2>
        <p className={styles.intro}>
          Главная задача студии — собрать процесс так, чтобы клиенту не
          приходилось отдельно искать исполнителей для каждого этапа. Состав
          работ зависит от проекта, но базовая схема выглядит так.
        </p>
        <ol className={styles.steps} role="list">
          {steps.map((step, index) => (
            <li className={styles.step} key={step.title} data-active={activeStep === index}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div className={styles.track} style={{ "--fader-position": positions[index]! / 100 } as CSSProperties}>
                <input
                  className={styles.range}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue="0"
                  aria-label={`Положение ползунка: ${step.title}`}
                  onPointerEnter={() => setActiveStep(index)}
                  onPointerDown={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                  onInput={event => moveFader(index, event.currentTarget.valueAsNumber)}
                />
                <span className={styles.fader} aria-hidden="true"><i /></span>
                <span className={styles.time} aria-hidden="true">{step.time}</span>
              </div>
              <div className={styles.copy}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.description}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <svg className={styles.waveform} viewBox="0 0 1200 128" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={waveformPath} fill="currentColor" />
        </svg>
        <div className={styles.caption} aria-hidden="true">
          <span>Профессиональная<br />озвучка</span>
          <i />
          <span>Ваши идеи<br />звучат громче</span>
        </div>
      </div>
    </section>
  );
}
