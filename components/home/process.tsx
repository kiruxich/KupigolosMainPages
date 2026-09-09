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

export function Process() {
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className="shell">
        <h2 id="process-title" className={styles.title}>Как мы работаем</h2>
        <ol className={styles.steps} role="list">
          {steps.map((step, index) => (
            <li className={styles.step} key={step.title}>
              <span className={styles.number} aria-hidden="true">0{index + 1}</span>
              <div className={styles.track} aria-hidden="true">
                <span className={styles.fader}><i /></span>
                <span className={styles.time}>{step.time}</span>
              </div>
              <div className={styles.copy}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.description}>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <svg className={styles.waveform} viewBox="0 0 1200 128" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={waveformPath} fill="currentColor" />
        </svg>
        <div className={styles.caption} aria-hidden="true">
          <span>Профессиональная<br />озвучка</span>
          <i />
          <span>Ваши идеи<br />звучат громче</span>
        </div>
      </div>
    </section>
  );
}
