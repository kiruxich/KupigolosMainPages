import Image from "next/image";
import styles from "./clients.module.css";

const clientRows = [
  [
    { name: "IKEA", src: "https://kupigolos.ru/img/clients/ikea.jpg" },
    { name: "Avito", src: "https://kupigolos.ru/img/clients/avito.png" },
    { name: "Россия 24", src: "https://kupigolos.ru/img/clients/rossiya-24.png" },
    { name: "Makita", src: "https://kupigolos.ru/img/clients/makita.png" },
  ],
  [
    { name: "Toyota", src: "https://kupigolos.ru/img/clients/toyota.jpg" },
    { name: "McDonald's", src: "https://kupigolos.ru/img/clients/mcdonalds.jpg" },
    { name: "Битрикс24", src: "https://kupigolos.ru/img/clients/bitrix-24.png" },
    { name: "UNESCO", src: "https://kupigolos.ru/img/clients/unesco.jpg" },
  ],
  [
    { name: "Tefal", src: "https://kupigolos.ru/img/clients/tefal.jpg" },
    { name: "Fix Price", src: "https://kupigolos.ru/img/clients/fix-price.png" },
    { name: "FIFA", src: "https://kupigolos.ru/img/clients/fifa.png" },
    { name: "Первый канал", src: "https://kupigolos.ru/img/clients/perviy-kanal.jpg" },
  ],
] as const;

export function Clients() {
  return (
    <section className={styles.section} id="clients" aria-labelledby="clients-title">
      <div className={`shell ${styles.shell}`}>
        <header className={`${styles.heading} reveal`}>
          <h2 id="clients-title">Нам доверяют</h2>
          <p>
            Записываем голоса для брендов, телеканалов и международных команд.
            От рекламного ролика до большой локализации.
          </p>
        </header>
      </div>

      <div className={`${styles.tracks} reveal`} aria-label="Компании, которые работали с КупиГолос">
        {clientRows.map((row, rowIndex) => (
          <div
            className={`${styles.rail} ${rowIndex === 1 ? styles.railReverse : ""}`}
            key={rowIndex}
          >
            {row.map((client) => (
              <div className={styles.brand} key={client.name}>
                <Image
                  src={client.src}
                  alt={client.name}
                  width={180}
                  height={72}
                  sizes="(max-width: 760px) 150px, 164px"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
