import Image from "next/image";
import styles from "./about.module.css";

export function About() {
  return (
    <section className={styles.root} id="about" aria-labelledby="about-title">
      <div className={`shell ${styles.shell}`}>
        <header className={`${styles.heading} reveal`}>
          <p className={styles.eyebrow}>Студия КупиГолос</p>
          <h2 id="about-title">
            Создаём звук,<br />
            который работает<br />
            <span>на историю.</span>
          </h2>
        </header>

        <div className={`${styles.feature} reveal`}>
          <figure className={styles.photo}>
            <Image
              src="/assets/studio/hero-room.jpg"
              alt="Комната записи студии КупиГолос с микрофонами и музыкальными инструментами"
              fill
              sizes="(max-width: 760px) 100vw, 68vw"
            />
            <figcaption>
              <span>Москва · Большой Саввинский пер.</span>
              <span>REC · 48 kHz</span>
            </figcaption>
          </figure>

          <article className={styles.statement}>
            <p className={styles.statementLabel}>Весь продакшн · одна команда</p>
            <h3>От первой реплики до готового мастера</h3>
            <p>
              Подбираем голос, пишем сценарий, режиссируем запись, чистим,
              сводим и локализуем. Вы получаете готовый звук, а не набор
              разрозненных файлов.
            </p>
            <a href="https://kupigolos.ru/studio">
              Как устроена студия <span aria-hidden="true">↗</span>
            </a>
            <div className={styles.wave} aria-hidden="true">
              {[28, 54, 76, 42, 86, 62, 34, 70, 48, 82, 58, 30, 66, 44, 74, 36].map((height, index) => (
                <i key={`${height}-${index}`} style={{ height: `${height}%` }} />
              ))}
            </div>
          </article>
        </div>

        <dl className={`${styles.facts} reveal`} aria-label="Студия в цифрах">
          <div>
            <dt>15 000+</dt>
            <dd>реализованных проектов</dd>
          </div>
          <div>
            <dt>60</dt>
            <dd>языков локализации</dd>
          </div>
          <div>
            <dt>с 2013</dt>
            <dd>работаем со звуком</dd>
          </div>
        </dl>

        <div className={`${styles.closing} reveal`}>
          <h3>Студия для рекламы, кино и цифровых продуктов</h3>
          <div>
            <p>
              Записываем дикторов и актёров дубляжа, озвучиваем ролики,
              фильмы, игры, презентации, аудиокниги и голосовые интерфейсы.
              Можно присутствовать на сессии в студии или подключиться онлайн.
            </p>
            <ul aria-label="Основные направления">
              <li>Дубляж</li>
              <li>Аудиореклама</li>
              <li>Локализация</li>
              <li>Саунд-дизайн</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
