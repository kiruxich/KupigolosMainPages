import styles from "./process.module.css";

const steps = [
  {
    title: "Бриф и материалы",
    text: "Получаем текст, видео или другой исходник, уточняем формат, хронометраж, сроки и технические требования.",
  },
  {
    title: "Подбор команды",
    text: "Выбираем диктора или актеров, при необходимости подключаем переводчика, редактора, режиссера дубляжа и звукорежиссера.",
  },
  {
    title: "Запись и контроль",
    text: "Записываем материал в студии. При сложной актерской задаче режиссер помогает добиться нужной подачи и характера.",
  },
  {
    title: "Монтаж и сдача",
    text: "Чистим запись, монтируем, выполняем сведение и передаем готовые файлы. Формат сдачи согласуется до производства.",
  },
] as const;

export function Process() {
  return (
    <section id="process" className={styles.section} aria-labelledby="process-title">
      <div className="shell">
        <p className={styles.kicker}>От задачи до готового файла</p>
        <h2 id="process-title" className={styles.title}>
          Как проходит профессиональная озвучка
        </h2>
        <p className={styles.intro}>
          Главная задача студии — собрать процесс так, чтобы клиенту не
          приходилось отдельно искать исполнителей для каждого этапа. Состав
          работ зависит от проекта, но базовая схема выглядит так.
        </p>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li className={styles.step} key={step.title}>
              <span className={styles.number}>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
