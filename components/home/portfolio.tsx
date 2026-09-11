"use client";

import { useRef, useState } from "react";
import { audioWorks, videoWorks } from "./portfolio-data";
import styles from "./portfolio.module.css";

const tabs = [
  { id: "video", label: "Видео реклама", icon: "clapper" },
  { id: "movies", label: "Фильмы/сериалы/мультики", icon: "screen" },
  { id: "audio", label: "Аудиоролики", icon: "wave" },
  { id: "books", label: "Аудиокниги", icon: "book" },
  { id: "guides", label: "Аудиогиды", icon: "headphones" },
  { id: "youtube", label: "Ютуб ролики", icon: "video" },
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

function VideoPlayIcon() {
  return (
    <svg viewBox="0 0 32 34" aria-hidden="true">
      <path d="M2 1.8 30 17 2 32.2Z" fill="currentColor" />
    </svg>
  );
}

function TabIcon({ name }: { name: (typeof tabs)[number]["icon"] }) {
  if (name === "clapper") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 7h14v9H3zM3 7l2-4h12l-2 4M7 3 5 7m6-4L9 7m6-4-2 4" /></svg>;
  if (name === "screen") return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="2" /><path d="m8 7 5 3-5 3z" /></svg>;
  if (name === "wave") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 10h2l1.5-4 2.2 8L10 3l2.2 14 2.3-10L16 10h2" /></svg>;
  if (name === "book") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4.5h4.5A2.5 2.5 0 0 1 10 7v9a2.5 2.5 0 0 0-2.5-2.5H3zM17 4.5h-4.5A2.5 2.5 0 0 0 10 7v9a2.5 2.5 0 0 1 2.5-2.5H17z" /></svg>;
  if (name === "headphones") return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10a6.5 6.5 0 0 1 13 0M3.5 10v4a2 2 0 0 0 2 2h1v-6h-3Zm13 0v4a2 2 0 0 1-2 2h-1v-6h3Z" /></svg>;
  return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="5" width="16" height="10" rx="3" /><path d="m8.5 8 4 2-4 2z" /></svg>;
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === "left" ? "M20 12H5m6-6-6 6 6 6" : "M4 12h15m-6-6 6 6-6 6"} />
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
        <span className={styles.mediaPlay}><VideoPlayIcon /></span>
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
              <TabIcon name={tab.icon} />
              <span>{tab.label}</span>
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
              {[videoWorks[2], videoWorks[4]].map((work) => <VideoCard key={work.title} work={work} />)}
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
          <button type="button" onClick={() => move(-1)} disabled={activeIndex === 0} aria-label="Предыдущая категория"><ArrowIcon direction="left" /></button>
          <button type="button" onClick={() => move(1)} disabled={activeIndex === tabs.length - 1} aria-label="Следующая категория"><ArrowIcon direction="right" /></button>
        </div>
      </div>
    </section>
  );
}
