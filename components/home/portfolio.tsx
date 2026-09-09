"use client";

import { useRef, useState } from "react";
import { audioWorks, videoWorks } from "./portfolio-data";
import styles from "./portfolio.module.css";

function PlayIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" /></svg>;
}

export function Portfolio() {
  const [category, setCategory] = useState<"audio" | "ivr">("audio");
  const [expanded, setExpanded] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  function selectCategory(next: "audio" | "ivr") {
    if (next === category) return;
    panel.current?.querySelector<HTMLButtonElement>('[data-audio-src].is-playing')?.click();
    setCategory(next);
  }
  return (
    <section id="portfolio" className={styles.section} aria-labelledby="portfolio-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Портфолио</p>
          <h2 id="portfolio-title">Примеры работ</h2>
          <p>За плечами наших специалистов более 5000 успешных проектов.<br />Оцените наш уровень и вы!</p>
        </header>
        <div className={styles.columns}>
          <div className={styles.audioPanel} ref={panel}>
            <div className={styles.audioHeader}>
              <h3>Аудио</h3>
              <div className={styles.tabs} role="tablist" aria-label="Тип аудиоработ">
                {(["audio", "ivr"] as const).map((tab) => <button key={tab} type="button" role="tab" id={`work-tab-${tab}`} aria-selected={category === tab} aria-controls="work-audio-panel" onClick={() => selectCategory(tab)}>{tab === "audio" ? "Аудиоролики" : "Автоответчики"}</button>)}
              </div>
            </div>
            <div id="work-audio-panel" role="tabpanel" aria-labelledby={`work-tab-${category}`}>
              {audioWorks[category].slice(0, expanded ? undefined : 4).map((work) => (
                <div className={styles.audioRow} key={work.src}>
                  <button className={styles.play} type="button" data-audio-src={work.src} data-audio-label={work.title} aria-label={`Слушать ${work.title}`} aria-pressed="false"><PlayIcon /><span className={styles.pause} aria-hidden="true">Ⅱ</span></button>
                  <div className={styles.audioText}><h4>{work.title}</h4><span className={styles.badge}>{work.category}</span></div>
                  <a className={styles.download} href={work.download} aria-label={`Скачать ${work.title}`} download><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4" /></svg></a>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.videos}>
            {videoWorks.slice(0, expanded ? undefined : 2).map((work) => (
              <article className={styles.video} key={work.title}>
                <a className={styles.thumbnail} href={work.href} target="_blank" rel="noopener noreferrer" aria-label={`Смотреть ${work.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={work.image} alt="" loading="lazy" width="290" height="240" />
                  <span className={styles.videoPlay}><PlayIcon /></span><span className={styles.duration}>{work.duration}</span>
                </a>
                <div className={styles.videoText}><h3>{work.title}</h3><span className={styles.badge}>{work.category}</span><p>{work.description}</p></div>
              </article>
            ))}
          </div>
        </div>
        {!expanded && <div className={styles.footer}><button className="studio-cta" type="button" onClick={() => setExpanded(true)}>Больше работ</button></div>}
      </div>
    </section>
  );
}
