import Image from "next/image";

export function Hero() {
  return (
    <section className="hero-product" id="start" data-hero-variant aria-labelledby="hero-title">
      <div className="shell hero-product-grid">
        <div className="hero-product-copy">
          <p className="top-kicker">Профессиональная</p>
          <h1 className="hero-product-title" id="hero-title">
            <span className="hero-title-main">Студия озвучивания</span>
            <span className="hero-title-accent">в Москве</span>
          </h1>
          <p className="hero-product-lead">
            Подготовим профессиональную озвучку диктором на любом языке мира за один день. Работаем на оборудовании
            мировых брендов.
          </p>
          <div className="hero-actions" aria-label="Действия">
            <a className="hero-action-button hero-action-primary" href="#contacts">
              <span className="hero-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 6.5h14v9H9l-4 3v-12Z" /></svg>
              </span>
              <span>Заказать</span><i aria-hidden="true">↗</i>
            </a>
            <a className="hero-action-button" href="#portfolio">
              <span className="hero-action-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m9 7 7 5-7 5V7Z" /></svg>
              </span>
              <span>Прослушать примеры</span><i aria-hidden="true">↗</i>
            </a>
          </div>
        </div>

        <figure className="hero-studio-visual">
          <div className="hero-studio-collage">
            <Image
              className="hero-studio-photo hero-studio-photo-primary"
              src="/assets/studio/hero-room.jpg"
              width={828}
              height={540}
              alt="Зал студии КупиГолос с клавишным инструментом и микрофоном"
              preload
              unoptimized
            />
            <Image
              className="hero-studio-photo hero-studio-photo-detail"
              src="/assets/studio/hero-session.jpg"
              width={1280}
              height={960}
              alt="Микрофоны, гитара и оборудование в студии КупиГолос"
              unoptimized
            />
            <figcaption className="hero-studio-label">Студия КупиГолос · Москва</figcaption>
          </div>
          <ul className="hero-proof" aria-label="Ключевые возможности студии">
            <li><span aria-hidden="true" /><strong>Более 800 голосов</strong></li>
            <li><span aria-hidden="true" /><strong>60 языков</strong></li>
            <li><span aria-hidden="true" /><strong>Озвучка за один день</strong></li>
          </ul>
        </figure>
      </div>
    </section>
  );
}
