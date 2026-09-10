import Image from "next/image";
import styles from "./clients.module.css";

const clients = [
  { name: "IKEA", src: "https://kupigolos.ru/img/clients/ikea.jpg" },
  { name: "Toyota", src: "https://kupigolos.ru/img/clients/toyota.jpg" },
  { name: "Tefal", src: "https://kupigolos.ru/img/clients/tefal.jpg" },
  { name: "Makita", src: "https://kupigolos.ru/img/clients/makita.png" },
  { name: "Avito", src: "https://kupigolos.ru/img/clients/avito.png" },
  { name: "Битрикс24", src: "https://kupigolos.ru/img/clients/bitrix-24.png" },
  { name: "FIFA", src: "https://kupigolos.ru/img/clients/fifa.png" },
  { name: "UNESCO", src: "https://kupigolos.ru/img/clients/unesco.jpg" },
  { name: "Первый канал", src: "https://kupigolos.ru/img/clients/perviy-kanal.jpg" },
  { name: "Россия 24", src: "https://kupigolos.ru/img/clients/rossiya-24.png" },
  { name: "McDonald's", src: "https://kupigolos.ru/img/clients/mcdonalds.jpg" },
  { name: "Fix Price", src: "https://kupigolos.ru/img/clients/fix-price.png" },
] as const;

export function Clients() {
  return (
    <section className={styles.section} id="clients" aria-labelledby="clients-title">
      <div className={`shell ${styles.layout}`}>
        <header className={`${styles.heading} reveal`}>
          <span className={styles.eyebrow}>Выбор компаний</span>
          <h2 id="clients-title">Нам доверяют</h2>
          <p>От рекламного ролика до большой локализации.</p>
        </header>

        <div className={styles.filmStage}>
          <div
            className={styles.film}
            role="region"
            aria-label="Компании, которые работали с КупиГолос"
          >
            <div className={styles.filmTrack}>
              {[0, 1].map((copyIndex) => (
                <div
                  className={styles.filmGroup}
                  aria-hidden={copyIndex === 1}
                  key={copyIndex}
                >
                  <div className={styles.filmMeta} aria-hidden="true">
                    <span>Kupigolos studio</span>
                    <i />
                    <span>Track 12/12</span>
                  </div>

                  <ul className={styles.frames} role={copyIndex === 0 ? "list" : undefined}>
                    {clients.map((client) => (
                      <li className={styles.brand} key={client.name}>
                        <Image
                          src={client.src}
                          alt={copyIndex === 0 ? client.name : ""}
                          width={180}
                          height={72}
                          sizes="(max-width: 760px) 136px, 164px"
                          unoptimized
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
