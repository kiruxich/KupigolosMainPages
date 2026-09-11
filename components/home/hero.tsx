import Image from "next/image";

export function Hero() {
  return (
    <section className="hero-product hero-product-cinema" id="start" data-hero-variant aria-labelledby="hero-title">
      <div className="hero-sound-art" aria-hidden="true">
        <Image src="/assets/studio/hero-sound-sculpture.png" alt=""
          fill sizes="(max-width: 700px) 100vw, 54vw" preload />
      </div>
      <div className="shell hero-product-grid">
        <div className="hero-product-copy">
          <p className="top-kicker">Профессиональная</p>
          <h1 className="hero-product-title" id="hero-title">
            <span className="hero-title-main">Студия<br />озвучивания</span>
            <span className="hero-title-accent">в Москве</span>
          </h1>
          <p className="hero-product-lead">
            Подготовим профессиональную озвучку диктором.<br className="hero-desktop-break" /> На любом языке мира за один день.<br className="hero-desktop-break" /> С помощью звукового оборудования мировых брендов.
          </p>
          <div className="hero-actions" aria-label="Действия">
            <a className="studio-cta studio-cta--order" href="#contacts">
              <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-6 3V7a3 3 0 0 1 3-3Z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              <span>Заказать</span>
            </a>
            <a className="studio-cta studio-cta--secondary" href="https://kupigolos.ru/order/voice/163">
              <span>Выбрать голос</span>
            </a>
          </div>
          <ul className="hero-production-steps" aria-label="Этапы работы">
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 22h4M8.5 14.5A7 7 0 1 1 15.5 14.5c-1.1.8-1.7 1.8-1.7 3.1h-3.6c0-1.3-.6-2.3-1.7-3.1Z" /></svg>
              <span>Разработаем цепляющий текст, сценарий ролика</span>
              <i aria-hidden="true">→</i>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="3" width="8" height="12" rx="4" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></svg>
              <span>Подберем и запишем дикторов на любом языке</span>
              <i aria-hidden="true">→</i>
            </li>
            <li>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4v16M12 4v16M19 4v16M2 8h6M9 16h6M16 10h6" /><circle cx="5" cy="8" r="2" /><circle cx="12" cy="16" r="2" /><circle cx="19" cy="10" r="2" /></svg>
              <span>Качественно смонтируем запись в готовый ролик</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
