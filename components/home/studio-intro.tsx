import styles from "./studio-intro.module.css";

export function StudioIntro() {
  return (
    <section className={styles.root} aria-labelledby="studio-intro-title">
      <div className={`shell ${styles.inner}`}>
        <p className={styles.kicker}>Коротко о нас</p>
        <h2 className={styles.title} id="studio-intro-title">
          Кто мы и чем занимаемся
        </h2>
        <p className={styles.lead}>
          Студия дубляжа КупиГолос - одна из крупнейших в России студий по
          озвучиванию контента. Мы создаем аудиорекламу под ключ, записываем
          профессиональных дикторов на любых языках мира и озвучиваем
          аудиопроекты для любых задач.
        </p>
        <details className={styles.details}>
          <summary>
            <span className={styles.more}>Подробнее</span>
            <span className={styles.less}>Свернуть</span>
          </summary>
          <p>
            Миссия нашей компании заключается в разработке и изготовлении
            максимально качественных аудиопродуктов. Если вам необходимо
            сделать эффективную аудиорекламу с высокой конверсией, озвучить
            видеоролик, презентацию или автоответчик, то вы попали по адресу!
            В нашем арсенале внушительная база опытных дикторских голосов на
            любой вкус и бюджет, талантливые сценаристы и звукорежиссеры,
            которые делают настоящую магию со звуком!
          </p>
        </details>
      </div>
    </section>
  );
}
