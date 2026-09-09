"use client";

import { useState } from "react";
import styles from "./reviews.module.css";

// Names, dates, individual ratings and wording transcribed from the supplied
// original-site screenshot. Do not replace these with generated mockup copy.
const reviews = [
  {
    id: "denisov",
    author: "Денисов В.",
    preview: "Делали адаптацию корпоративного фильма на английский язык. Заказчик хотел, чтобы диктор был носителем языка. Обратились в Купиголос.",
    text: "Делали адаптацию корпоративного фильма на английский язык. Заказчик хотел, чтобы диктор был носителем языка. Обратились в Купиголос. Заказчик выбрал диктора, но он находился в отъезде. Все время пока мы ждали диктора, менеджер была на связи. Как только диктор вернулся, прошла оплата. Перед финальной записью диктор прислал 2 демки. Для согласования интонаций, скорости и т. д. В общем, после 2 демки заказчик согласовал голос. В течение суток после согласования была готова финальная версия. Очень обходительные менеджеры, всегда на контакте, если есть вопросы, отвечают, каждый этап согласовывается, работают официально. Буду обязательно обращаться еще.",
  },
  {
    id: "tatyana",
    author: "Татьяна",
    text: "Обращалась в студию несколько раз. Записывали озвучку для корпоративных фильмов. Студия сама связывается с актером или ведущим, которого вы выбрали. Сроки соблюдают. Будем работать и дальше.",
  },
  {
    id: "kseniya",
    author: "Ксения Д.",
    preview: "Заказывал ролик на автоответчик для организации, выбирали голос (достаточно известный), согласовали текст, записали, причем было несколько вариантов по тембру и скорости подачи…",
    text: "Заказывал ролик на автоответчик для организации, выбирали голос (достаточно известный), согласовали текст, записали, причем было несколько вариантов по тембру и скорости подачи и еще наложили музыку на фон, музыку тоже помогли подобрать. Все очень понравилось, причем у нас не было нормального ТЗ, а хотели как 99% заказчиков сделать круто )) Спасибо, тут изменения, я вернусь. Однозначно могу рекомендовать",
  },
  {
    id: "anastasiya",
    author: "Анастасия П.",
    text: "Заказывали голос для презентационного ролика, сделали несколько вариантов интонаций и скорости произношения, все очень понравилось, будем работать еще!",
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
        <div>
          <h3 id={`review-author-${review.id}`} className={styles.author}>{review.author}</h3>
          <time className={styles.date} dateTime="2019-10-30">30 октября 2019</time>
        </div>
        <span className={styles.stars} role="img" aria-label="Оценка: 5 из 5">
          <span aria-hidden="true">★★★★★</span>
        </span>
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
          <span className={styles.chevron} aria-hidden="true">⌄</span>
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
