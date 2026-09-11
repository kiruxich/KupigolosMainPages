"use client";

import { useRef, useState } from "react";
import { audioWorks, videoWorks } from "./portfolio-data";
import styles from "./portfolio.module.css";

const tabs = [
  { id: "video", label: "Видео реклама" },
  { id: "movies", label: "Фильмы/сериалы/мультики" },
  { id: "audio", label: "Аудиоролики" },
  { id: "books", label: "Аудиокниги" },
  { id: "guides", label: "Аудиогиды" },
  { id: "youtube", label: "Ютуб ролики" },
] as const;

type PortfolioCategory = (typeof tabs)[number]["id"];

const bookWorks = [
  {
    title: "Посейдоника",
    author: "Хельги Толсон",
    voice: "Кирилл Радциг",
    image: "/assets/services/audiobooks-bg-v1.png",
  },
  {
    title: "Английское сочинение",
    author: "Геннадий Ахмедов",
    voice: "Егор Серов",
    image: "/assets/hero-script.jpg",
  },
  {
    title: "Road Show или любовь олигарха",
    author: "Азарий Абрамович Лапидус",
    voice: "Александр Лавров",
    image: "/assets/hero-options/04-recording-archive.png",
  },
  {
    title: "Невеста по наследству",
    author: "Елена Козловская",
    voice: "Татьяна Маерс",
    image: "/assets/hero-options/02-through-glass.png",
  },
];

const guideWorks = [
  {
    title: "Аудиоэкскурсия по Екатеринбургу",
    voice: "Сергей Чонишвили",
    image: "/assets/services/localization-bg-v1.png",
  },
  {
    title: "Петергоф, Павловск, Царское Село, Гатчина",
    voice: "Luigino",
    image: "/assets/hero-options/01-directors-desk.png",
  },
  {
    title: "VR гид для МФЦ",
    voice: "Russell",
    image: "/assets/services/game-voiceover-bg-v1.png",
  },
  {
    title: "Гид по зданиям Москвы",
    voice: "Felik",
    image: "/assets/studio/hero-cinema-background-v2.jpg",
  },
];

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 5 11 7-11 7Z" fill="currentColor" />
    </svg>
  );
}

function Waveform() {
  return (
    <svg className={styles.waveform} viewBox="0 0 420 38" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 19h10l5-4 6 8 7-13 8 18 7-22 8 27 8-18 7 9 8-12 8 20 8-25 8 18 8-10 8 7 8-16 8 28 8-20 8 11 8-5 8 9 8-24 8 30 8-18 8 7 8-12 8 21 8-17 8 8 8-4 8 10 8-22 8 27 8-17 8 9 8-5 8 11 8-18 8 23 8-13 8 5 8-7 8 12 8-9 8 4h13" />
    </svg>
  );
}

function VideoCard({ work, poster = false }: { work: (typeof videoWorks)[number]; poster?: boolean }) {
  return (
    <article className={`${styles.videoCard} ${poster ? styles.posterCard : ""}`}>
      <a className={styles.media} href={work.href} target="_blank" rel="noopener noreferrer" aria-label={`Смотреть ${work.title}`}>
        <img src={work.image} alt="" loading="lazy" />
        <span className={styles.tag}>{work.category}</span>
        <span className={styles.mediaPlay}><PlayIcon /></span>
      </a>
      <div className={styles.cardBody}>
        <h3>{work.title}</h3>
        <p>{work.description}</p>
      </div>
    </article>
  );
}

function AudioCard({ work }: { work: (typeof audioWorks.audio)[number] }) {
  return (
    <article className={styles.audioCard}>
      <button className={styles.audioPlay} type="button" data-audio-src={work.src} data-audio-label={work.title} aria-label={`Слушать ${work.title}`} aria-pressed="false">
        <PlayIcon />
        <span className={styles.pause} aria-hidden="true">Ⅱ</span>
      </button>
      <div className={styles.audioCopy}>
        <h3>{work.title}</h3>
        <p>{work.description}</p>
      </div>
      <Waveform />
    </article>
  );
}

function EditorialCard({ work, kind }: { work: (typeof bookWorks)[number] | (typeof guideWorks)[number]; kind: "book" | "guide" }) {
  const author = "author" in work ? work.author : null;
  return (
    <article className={styles.editorialCard}>
      <div className={styles.editorialMedia}><img src={work.image} alt="" loading="lazy" /></div>
      <div className={styles.editorialBody}>
        <h3>{work.title}</h3>
        {author && <p>Автор: {author}</p>}
        <div className={styles.voiceLine}>
          <span className={styles.smallPlay}><PlayIcon /></span>
          <span>{kind === "book" ? "Чтец" : "Диктор"}: {work.voice}</span>
        </div>
      </div>
    </article>
  );
}

export function Portfolio() {
  const [category, setCategory] = useState<PortfolioCategory>("video");
  const panel = useRef<HTMLDivElement>(null);
  const activeIndex = tabs.findIndex((tab) => tab.id === category);

  function selectCategory(next: PortfolioCategory) {
    if (next === category) return;
    panel.current?.querySelector<HTMLButtonElement>('[data-audio-src].is-playing')?.click();
    setCategory(next);
  }

  function move(direction: -1 | 1) {
    const next = tabs[activeIndex + direction];
    if (next) selectCategory(next.id);
  }

  return (
    <section id="portfolio" className={styles.section} aria-labelledby="portfolio-title">
      <div className={styles.inner}>
        <h2 id="portfolio-title">Примеры работ</h2>

        <div className={styles.tabs} role="tablist" aria-label="Категории работ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`portfolio-tab-${tab.id}`}
              aria-selected={category === tab.id}
              aria-controls="portfolio-panel"
              onClick={() => selectCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          ref={panel}
          id="portfolio-panel"
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={`portfolio-tab-${category}`}
        >
          {category === "video" && (
            <div className={styles.landscapeGrid}>
              {videoWorks.slice(0, 2).map((work) => <VideoCard key={work.title} work={work} />)}
            </div>
          )}

          {category === "movies" && (
            <div className={styles.posterGrid}>
              {[videoWorks[2], videoWorks[3], videoWorks[5]].map((work) => <VideoCard key={work.title} work={work} poster />)}
            </div>
          )}

          {category === "audio" && (
            <div className={styles.audioGrid}>
              {audioWorks.audio.map((work) => <AudioCard key={work.src} work={work} />)}
            </div>
          )}

          {category === "books" && (
            <div className={styles.editorialGrid}>
              {bookWorks.map((work) => <EditorialCard key={work.title} work={work} kind="book" />)}
            </div>
          )}

          {category === "guides" && (
            <div className={styles.editorialGrid}>
              {guideWorks.map((work) => <EditorialCard key={work.title} work={work} kind="guide" />)}
            </div>
          )}

          {category === "youtube" && (
            <div className={styles.landscapeGrid}>
              {[videoWorks[2], videoWorks[4]].map((work) => <VideoCard key={work.title} work={work} />)}
            </div>
          )}
        </div>

        <div className={styles.controls} aria-label="Переключение категорий">
          <button type="button" onClick={() => move(-1)} disabled={activeIndex === 0} aria-label="Предыдущая категория">←</button>
          <button type="button" onClick={() => move(1)} disabled={activeIndex === tabs.length - 1} aria-label="Следующая категория">→</button>
        </div>
      </div>
    </section>
  );
}
