import styles from "./ai-services.module.css";

const WAVE_BARS = Array.from({ length: 24 });

function Waveform({ quiet = false }: { quiet?: boolean }) {
  return (
    <span className={`${styles.waveform} ${quiet ? styles.waveformQuiet : ""}`} aria-hidden="true">
      {WAVE_BARS.map((_, index) => <i key={index}></i>)}
    </span>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function AiServices() {
  return (
    <section className="talent-stage talent-stage-ai" id="ai-services" aria-labelledby="ai-tools-title">
      <div className="shell">
        <section className={`${styles.section} reveal`} aria-labelledby="ai-tools-title">
          <header className={styles.heading}>
            <div>
              <p className="kicker">AI production desk</p>
              <h2 id="ai-tools-title">ИИ-инструменты</h2>
              <p>Создавайте речь, озвучивайте видео и собирайте музыку с помощью ИИ.</p>
            </div>
            <a className={styles.allServices} href="https://ai.kupigolos.ru/">
              Все сервисы <Arrow />
            </a>
          </header>

          <div className={styles.list}>
            <article className={`${styles.row} ${styles.featured}`}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 42 42">
                  <path d="M8 21v6M14 13v16M20 7v28M26 12v18M32 17v9" />
                </svg>
              </span>

              <div className={styles.copy}>
                <a className={styles.titleLink} href="https://kupigolos.ru/ai/voice/ai-voice-generator">
                  <h3>Голос</h3>
                </a>
                <p>Создать речь и выбрать модель</p>
                <div className={styles.subLinks}>
                  <a href="https://kupigolos.ru/ai/fish-audio">Fish Audio <span>— скоро</span></a>
                  <a href="https://kupigolos.ru/ai/voice/ai-voice-over">ИИ-озвучка</a>
                </div>
              </div>

              <Waveform />

              <a className={`studio-cta studio-cta--order ${styles.cta}`} href="https://kupigolos.ru/ai/voice/ai-voice-generator">
                <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h2m2-5v10m4-14v18m4-13v8m4-5v2" />
                </svg>
                <span>Создать голос</span>
              </a>
            </article>

            <article className={styles.row}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 42 42">
                  <rect x="7" y="11" width="21" height="20" rx="3" />
                  <path d="m28 18 8-4v14l-8-4M11 16h13" />
                </svg>
              </span>

              <div className={styles.copy}>
                <a className={styles.titleLink} href="https://kupigolos.ru/ai/dubbing-video"><h3>Видео</h3></a>
                <p>Добавить речь и локализацию</p>
              </div>

              <span className={styles.timeline} aria-hidden="true">
                <i></i><small>0:28</small>
              </span>

              <a className={styles.arrow} href="https://kupigolos.ru/ai/dubbing-video" aria-label="Открыть озвучку видео">
                <Arrow />
              </a>
            </article>

            <article className={styles.row}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 42 42">
                  <path d="M12 7h13l6 6v22H12zM25 7v7h6M17 21h9M17 26h9M17 31h6" />
                </svg>
              </span>

              <div className={styles.copy}>
                <a className={styles.titleLink} href="https://kupigolos.ru/ai/voice/text-to-speech"><h3>Текст</h3></a>
                <p>Превратить материал в аудио</p>
              </div>

              <span className={styles.textLines} aria-hidden="true"><i></i><i></i><i></i></span>

              <a className={styles.arrow} href="https://kupigolos.ru/ai/voice/text-to-speech" aria-label="Открыть озвучку текста">
                <Arrow />
              </a>
            </article>

            <article className={styles.row}>
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 42 42">
                  <path d="M17 30V11l17-4v19M17 16l17-4" />
                  <ellipse cx="11.5" cy="31" rx="5.5" ry="4" />
                  <ellipse cx="28.5" cy="27" rx="5.5" ry="4" />
                </svg>
              </span>

              <div className={styles.copy}>
                <a className={styles.titleLink} href="https://kupigolos.ru/ai/music/song-generator"><h3>Музыка</h3></a>
                <p>Собрать трек или песню</p>
                <div className={styles.subLinks}>
                  <a href="https://kupigolos.ru/ai/music/ai-music-generator">Только музыка</a>
                </div>
              </div>

              <Waveform quiet />

              <a className={styles.arrow} href="https://kupigolos.ru/ai/music/song-generator" aria-label="Открыть генератор песен">
                <Arrow />
              </a>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
