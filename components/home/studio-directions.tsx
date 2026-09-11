import styles from "./studio-directions.module.css";

const directions = [
  ["Дикторы", "https://kupigolos.ru/diktory"],
  ["Актеры дубляжа", "https://kupigolos.ru/diktory/dubbing"],
  ["Известные дикторы", "https://kupigolos.ru/diktory/izvestnye_golosa"],
  ["Озвучка видео", "https://kupigolos.ru/ozvuchka-video"],
  ["Озвучка игр", "https://kupigolos.ru/ozvuchka-igr"],
  ["Озвучка аудиокниг", "https://kupigolos.ru/audioknigi"],
  ["Локализация", "https://kupigolos.ru/perevod-i-ozvuchka-video"],
  ["О студии", "https://kupigolos.ru/studio"],
  ["Портфолио", "#portfolio"],
  ["Контакты", "#contacts"],
] as const;

export function StudioDirections() {
  return (
    <section
      id="studio-directions"
      className={styles.section}
      aria-labelledby="studio-directions-title"
    >
      <div className="shell">
        <p className={styles.kicker}>Быстрый переход</p>
        <h2 id="studio-directions-title" className={styles.title}>
          Направления студии
        </h2>
        <p className={styles.intro}>
          Перелинковка помогает пользователю сразу перейти на страницу с нужным
          форматом, а поисковым системам помогает разделить семантику главной и
          специализированные запросы.
        </p>
        <nav className={styles.links} aria-label="Направления студии">
          {directions.map(([label, href]) => (
            <a href={href} key={label}>{label}</a>
          ))}
        </nav>
      </div>
    </section>
  );
}
