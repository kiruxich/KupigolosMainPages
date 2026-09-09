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
          <p className="top-kicker">Ваш голос<br />Больше возможностей</p>
          <h1 className="hero-product-title" id="hero-title">
            <span className="hero-title-main">Студия<br />озвучивания</span>
            <span className="hero-title-accent">в Москве</span>
          </h1>
          <p className="hero-product-lead">
            Профессиональная озвучка для рекламы,<br className="hero-desktop-break" /> видео, фильмов, подкастов и любых проектов.
          </p>
          <div className="hero-actions" aria-label="Действия">
            <a className="studio-cta studio-cta--order" href="#contacts">
              <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-6 3V7a3 3 0 0 1 3-3Z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              <span>Заказать</span>
            </a>
            <a className="studio-cta studio-cta--secondary" href="#voices">
              <span>Прослушать примеры</span>
            </a>
          </div>
        </div>
        <p className="hero-cinema-signoff" aria-hidden="true">Звучим<br />громче идей</p>
      </div>
    </section>
  );
}
