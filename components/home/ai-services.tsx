import styles from "./ai-services.module.css";

type ServiceIconName = "voice" | "video" | "text" | "music";

function ServiceIcon({ name }: { name: ServiceIconName }) {
  if (name === "voice") {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <path d="M8 21v5M14 14v14M20 9v24M26 13v16M32 18v7" />
      </svg>
    );
  }

  if (name === "video") {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <rect x="7" y="11" width="22" height="20" rx="3" />
        <path d="m29 18 7-4v14l-7-4M12 16h12" />
      </svg>
    );
  }

  if (name === "text") {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <path d="M12 7h13l6 6v22H12zM25 7v7h6M17 21h9M17 26h9M17 31h6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="M17 30V11l17-4v19M17 16l17-4" />
      <ellipse cx="11.5" cy="31" rx="5.5" ry="4" />
      <ellipse cx="28.5" cy="27" rx="5.5" ry="4" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

const SERVICES: Array<{
  name: string;
  description: string;
  href: string;
  icon: ServiceIconName;
  featured?: boolean;
}> = [
  {
    name: "ИИ-озвучка",
    description: "Текст, видео, диалоги и голосовые боты",
    href: "https://kupigolos.ru/ai/voice/ai-voice-over",
    icon: "voice",
    featured: true,
  },
  {
    name: "Видео",
    description: "Добавить речь и локализацию",
    href: "https://kupigolos.ru/ai/dubbing-video",
    icon: "video",
  },
  {
    name: "Текст",
    description: "Превратить материал в аудио",
    href: "https://kupigolos.ru/ai/voice/text-to-speech",
    icon: "text",
  },
  {
    name: "Музыка",
    description: "Собрать трек или песню",
    href: "https://kupigolos.ru/ai/music/song-generator",
    icon: "music",
  },
];

export function AiServices() {
  return (
    <section className="talent-stage talent-stage-ai" id="ai-services" aria-labelledby="ai-tools-title">
      <div className="shell">
        <section className={`${styles.panel} reveal`} aria-labelledby="ai-tools-title">
          <div className={styles.intro}>
            <p className={styles.kicker}>ИИ-инструменты</p>
            <h2 id="ai-tools-title">ИИ-инструменты</h2>
            <p className={styles.description}>
              Создавайте речь, видео, текст и музыку с помощью искусственного интеллекта в студийном качестве.
            </p>

            <a className={`studio-cta studio-cta--order ${styles.cta}`} href="https://kupigolos.ru/ai/voice/ai-voice-generator">
              <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h2m2-5v10m4-14v18m4-13v8m4-5v2" />
              </svg>
              <span>Создать голос</span>
            </a>

            <a className={styles.fish} href="https://kupigolos.ru/ai/fish-audio">
              <span className={styles.fishWave} aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
              <span>
                <strong>Fish Audio — скоро</strong>
                <small>Новые возможности озвучки уже в разработке.</small>
              </span>
            </a>

            <nav className={styles.auxLinks} aria-label="Дополнительные ИИ-сервисы">
              <a href="https://kupigolos.ru/ai/music/ai-music-generator">Музыка без вокала</a>
            </nav>
          </div>

          <div className={styles.directory}>
            <a className={styles.allServices} href="https://ai.kupigolos.ru/">
              Все сервисы <Arrow />
            </a>

            <nav className={styles.serviceList} aria-label="Основные ИИ-инструменты">
              {SERVICES.map((service) => (
                <a
                  className={`${styles.service} ${service.featured ? styles.featured : ""}`}
                  href={service.href}
                  key={service.name}
                >
                  <span className={styles.icon}><ServiceIcon name={service.icon} /></span>
                  <span className={styles.serviceCopy}>
                    <strong>{service.name}</strong>
                    <small>{service.description}</small>
                  </span>
                  <span className={styles.arrow}><Arrow /></span>
                </a>
              ))}
            </nav>
          </div>
        </section>
      </div>
    </section>
  );
}
