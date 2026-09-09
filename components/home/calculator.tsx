import styles from "./calculator.module.css";

export function Calculator() {
  return (
    <section className={styles.section} id="calculator" aria-labelledby="calculator-title">
      <div className="shell">
        <div className={styles.banner}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Расчёт за пару минут</p>
            <h2 id="calculator-title">Узнайте бюджет до начала записи</h2>
            <p className={styles.description}>
              Укажите хронометраж и нужные услуги — калькулятор сразу покажет предварительную стоимость проекта.
            </p>
          </div>
          <div className={styles.actionGroup}>
            <div className={styles.estimateCard} aria-hidden="true">
              <div className={styles.estimateHead}>
                <span>Смета проекта</span>
                <strong>₽</strong>
              </div>
              <ol>
                <li><span>01</span>Хронометраж</li>
                <li><span>02</span>Нужные услуги</li>
                <li><span>03</span>Предварительный итог</li>
              </ol>
            </div>
            <a className={`studio-cta studio-cta--order ${styles.action}`} href="https://kupigolos.ru/price">
              <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.2V3Z" />
                <path d="M9 7h6M9 11h6M9 15h3" />
              </svg>
              <span>Перейти к расчёту</span>
            </a>
            <p>Онлайн · без регистрации</p>
          </div>
        </div>
      </div>
    </section>
  );
}
