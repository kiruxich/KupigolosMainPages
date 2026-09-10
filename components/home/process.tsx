"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./process.module.css";

const steps = [
  { title: "Заявка", time: "0:00", text: <>Оставьте <a href="#contacts">заявку</a> на сайте или позвоните нам</> },
  { title: "Обсуждение", time: "0:30", text: <>Обсуждаем задачу, утверждаем ТЗ и бюджет</> },
  { title: "Оплата", time: "1:00", text: <>Оплачиваете заказ удобным способом</> },
  { title: "Результат", time: "1:30", text: <>Получаете результат нашей работы</> },
];

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

const playbackDuration = 9600;

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const playheadRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const playhead = playheadRef.current;

    if (!section || !playhead || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frameId = 0;
    let playheadAnimation: Animation | undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || section.dataset.playing === "true") {
        return;
      }

      section.dataset.playing = "true";
      observer.disconnect();

      frameId = requestAnimationFrame(() => {
        const destination = section.querySelector<HTMLElement>("[data-timeline-ghost='3']");

        if (!destination) {
          return;
        }

        const originRect = playhead.getBoundingClientRect();
        const destinationRect = destination.getBoundingClientRect();
        const distanceX = destinationRect.left - originRect.left;
        const distanceY = destinationRect.top - originRect.top;

        playheadAnimation = playhead.animate([
          { transform: "translate3d(0, 0, 0) scale(1)", offset: 0 },
          { transform: `translate3d(${distanceX * .32}px, ${distanceY * .32}px, 0) scale(1)`, offset: .32 },
          { transform: `translate3d(${distanceX / 3}px, ${distanceY / 3}px, 0) scale(.9)`, offset: .333 },
          { transform: `translate3d(${distanceX * .35}px, ${distanceY * .35}px, 0) scale(1.03)`, offset: .35 },
          { transform: `translate3d(${distanceX * .653}px, ${distanceY * .653}px, 0) scale(1)`, offset: .653 },
          { transform: `translate3d(${distanceX * 2 / 3}px, ${distanceY * 2 / 3}px, 0) scale(.9)`, offset: .666 },
          { transform: `translate3d(${distanceX * .683}px, ${distanceY * .683}px, 0) scale(1.03)`, offset: .683 },
          { transform: `translate3d(${distanceX * .98}px, ${distanceY * .98}px, 0) scale(1)`, offset: .98 },
          { transform: `translate3d(${distanceX}px, ${distanceY}px, 0) scale(.93)`, offset: .992 },
          { transform: `translate3d(${distanceX}px, ${distanceY}px, 0) scale(1)`, offset: 1 },
        ], {
          duration: playbackDuration,
          easing: "linear",
          fill: "forwards",
        });
      });
    }, { threshold: .34, rootMargin: "0px 0px -8%" });

    observer.observe(section);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      playheadAnimation?.cancel();
    };
  }, []);

  return (
    <section
      id="process"
      className={styles.section}
      aria-labelledby="process-title"
      ref={sectionRef}
      style={{ "--playback-duration": `${playbackDuration}ms` } as CSSProperties}
    >
      <div className="shell">
        <h2 id="process-title" className={styles.title}>Как мы работаем</h2>
        <ol className={styles.steps} role="list">
          {steps.map((step, index) => (
            <li
              className={styles.step}
              key={step.title}
              style={{ "--hit-delay": `${index * playbackDuration / 3}ms` } as CSSProperties}
            >
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div className={styles.track} aria-hidden="true">
                {index === 0 ? (
                  <span className={`${styles.fader} ${styles.playhead}`} ref={playheadRef}><i /></span>
                ) : (
                  <span className={`${styles.fader} ${styles.ghost}`} data-timeline-ghost={index}><i /></span>
                )}
                <span className={styles.time} aria-hidden="true">{step.time}</span>
              </div>
              <div className={styles.copy}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.description}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.waveform} aria-hidden="true">
          <svg className={styles.waveformGhost} viewBox="0 0 1200 128" preserveAspectRatio="none" focusable="false">
            <path d={waveformPath} fill="currentColor" />
          </svg>
          <svg className={styles.waveformLive} viewBox="0 0 1200 128" preserveAspectRatio="none" focusable="false">
            <path d={waveformPath} fill="currentColor" />
          </svg>
        </div>
        <div className={styles.caption} aria-hidden="true">
          <span>Профессиональная<br />озвучка</span>
          <i />
          <span>Ваши идеи<br />звучат громче</span>
        </div>
      </div>
    </section>
  );
}
