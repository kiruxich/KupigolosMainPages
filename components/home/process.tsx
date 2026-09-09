import styles from "./process.module.css";

const steps = [
  <>Оставьте <a href="#contacts">заявку</a> на сайте или позвоните нам</>,
  <>Обсуждаем задачу, утверждаем ТЗ и бюджет</>,
  <>Оплачиваете заказ удобным способом</>,
  <>Получаете результат нашей работы</>,
];

export function Process() {
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className="shell">
        <h2 id="process-title" className={styles.title}>Как мы работаем</h2>
        <ol className={styles.steps} role="list">
          {steps.map((text, index) => (
            <li className={styles.step} key={index}>
              <span className={styles.number} aria-hidden="true">{index + 1}</span>
              {index < steps.length - 1 && (
                <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <p className={styles.description}>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
