import Image from "next/image";

export function Hero() {
  return (
    <section className="hero-product hero-product-cinema" id="start" data-hero-variant aria-labelledby="hero-title">
      <Image className="hero-cinema-backdrop" src="/assets/studio/hero-cinema-background.webp"
        alt="Студия КупиГолос в тёплом свете: микрофоны, клавишный инструмент и гитара"
        fill sizes="100vw" preload unoptimized />
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
            <a className="studio-cta" href="#contacts">
              <span>Заказать</span>
            </a>
            <a className="studio-cta studio-cta--secondary" href="#portfolio">
              <span>Прослушать примеры</span>
            </a>
          </div>
        </div>
        <p className="hero-cinema-signoff" aria-hidden="true">Звучим<br />громче идей</p>
      </div>
    </section>
  );
}
