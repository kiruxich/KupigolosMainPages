"use client";

import { useState } from "react";
import styles from "./reviews.module.css";

// Names and wording transcribed from the live kupigolos.ru homepage.
const reviews = [
  {
    id: "aksioma-bezopasnosti",
    author: "Аксиома Безопасности",
    preview: "Целую неделю бились с другой студией за ролик, нам сорвали все сроки и сделали на выходе отвратительный продукт.",
    text: "Целую неделю бились с другой студией за ролик, нам сорвали все сроки и сделали на выходе отвратительный продукт. Плюнули на всё и начали искать другую студию, обратились сюда. Сценарий действительно был не простой, а с учётом горящих сроков его и собрать ещё надо было за один день. Другие студии нам отказали, здесь же не только правильно поняли задачу, но и вошли в положение и уже в 20:00 ролик был у нас!",
  },
  {
    id: "evgeniy",
    author: "Евгений К.",
    text: "Заказали озвучку ролика на английском, сроки были сверхсжатые, но ребята выручили и сделали всё в срок и даже помогли бесплатно с маленькой корректировкой! Спасибо!",
  },
  {
    id: "ilya",
    author: "Илья М.",
    preview: "Реальная компания, классные ребята, всё грамотно и профессионально.",
    text: "Реальная компания, классные ребята, всё грамотно и профессионально. Удобное и полноценное взаимодействие с клиентами, быстрое выполнение заказа (в течение 1-2 дней), исправление возможных ошибок дикторов. Замечаний никаких нет, всё чётко. Можно смело обращаться, - не пожалеете!",
  },
];

// Organization link supplied by the live kupigolos.ru homepage.
const reviewsUrl = "https://yandex.ru/maps/org/studiya_kupigolos/118434769430/reviews/";

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const textId = `review-text-${review.id}`;

  return (
    <article className={`${styles.card} ${expanded ? styles.cardExpanded : ""}`} aria-labelledby={`review-author-${review.id}`}>
      <header className={styles.cardHeader}>
        <h3 id={`review-author-${review.id}`} className={styles.author}>{review.author}</h3>
      </header>
      <p
        className={`${styles.text} ${review.preview ? (expanded ? styles.textExpanded : styles.textCollapsed) : ""}`}
        id={textId}
      >
        {review.text}
      </p>
      {review.preview && (
        <button
          className={styles.readMore}
          type="button"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? "Свернуть" : "Читать полностью"}</span>
          <span className={styles.chevron} aria-hidden="true">↓</span>
        </button>
      )}
    </article>
  );
}

export function Reviews() {
  return (
    <section id="reviews" className={styles.section} aria-labelledby="reviews-title">
      <div className="shell">
        <div className={styles.heading}>
          <h2 id="reviews-title" className={styles.title}>Отзывы клиентов</h2>
        </div>
        <div className={styles.grid}>
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
        <div className={styles.footer}>
          <span className={styles.sourceLabel}>
            <span className={styles.source}>Яндекс Карты <strong>4,7</strong></span>
            <span className={styles.sourceDivider} aria-hidden="true">·</span>
            <span className={styles.source}>Google <strong>4,9</strong></span>
            <span className={styles.sourceDivider} aria-hidden="true">·</span>
            <span className={styles.source}>Zoon <strong>4,5</strong></span>
          </span>
          <a className={`studio-cta studio-cta--order ${styles.action}`} href={reviewsUrl} target="_blank" rel="noopener noreferrer">
            <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-6 3V7a3 3 0 0 1 3-3Z" />
              <path d="M8 9h8M8 13h5" />
            </svg>
            <span>Оставить отзыв</span>
          </a>
        </div>
      </div>
    </section>
  );
}
