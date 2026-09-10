import styles from "./guarantees.module.css";

type SealKind = "agreement" | "nda" | "rights";

const documents = [
  {
    kind: "agreement" as const,
    number: "№ 2026-0812",
    title: "ДОГОВОР",
    subtitle: "на оказание услуг по озвучиванию",
    body: "Фиксируем объем работ, стоимость, сроки и порядок сдачи материала до начала записи.",
    sealTop: "ДОГОВОР",
    sealBottom: "ЗАКЛЮЧЕН",
  },
  {
    kind: "nda" as const,
    number: "№ NDA-2026",
    title: "NDA",
    subtitle: "соглашение о неразглашении",
    body: "Сохраняем конфиденциальность сценариев, видеоматериалов и всей информации о проекте.",
    sealTop: "КОНФИДЕНЦИАЛЬНО",
    sealBottom: "ЗАЩИЩЕНО",
  },
  {
    kind: "rights" as const,
    number: "№ ПП-2026",
    title: "ПЕРЕДАЧА ПРАВ",
    subtitle: "акт передачи исключительных прав",
    body: "Корректно оформляем права на музыку, исполнение и готовую запись после завершения проекта.",
    sealTop: "ПРАВА",
    sealBottom: "ПЕРЕДАНЫ",
  },
] as const;

function Seal({ kind, top, bottom }: { kind: SealKind; top: string; bottom: string }) {
  return (
    <span className={styles.seal} aria-hidden="true">
      <span>{top}</span>
      {kind === "nda" ? (
        <svg viewBox="0 0 32 32">
          <rect x="7" y="14" width="18" height="14" rx="2" />
          <path d="M11 14V10a5 5 0 0 1 10 0v4M16 19v4" />
        </svg>
      ) : (
        <svg viewBox="0 0 32 32">
          <path d="m8 17 5 5 11-12" />
        </svg>
      )}
      <span>{bottom}</span>
    </span>
  );
}

export function Guarantees() {
  return (
    <section className={styles.section} id="guarantees" aria-labelledby="guarantees-title">
      <div className={`shell ${styles.layout}`}>
        <header className={`${styles.intro} reveal`}>
          <p className="kicker">Гарантии</p>
          <h2 id="guarantees-title">Берем ответственность за результат</h2>
          <p className={styles.lead}>Все договоренности закрепляем документально</p>
        </header>

        <div className={`${styles.scene} reveal`} aria-label="Документы, которые закрепляют наши гарантии">
          <svg className={styles.guides} viewBox="0 0 900 590" preserveAspectRatio="none" aria-hidden="true">
            <path d="M10 38H214l40 42" />
            <circle cx="254" cy="80" r="5" />
            <path d="M-35 330H438l92-82" />
            <circle cx="530" cy="248" r="5" />
            <path d="M10 506H716l42-31" />
            <circle cx="758" cy="475" r="5" />
          </svg>

          <div className={`${styles.callout} ${styles.calloutTerms}`} aria-hidden="true">
            объем · стоимость · сроки
          </div>
          <div className={`${styles.callout} ${styles.calloutPrivacy}`} aria-hidden="true">
            конфиденциальность
          </div>
          <div className={`${styles.callout} ${styles.calloutRights}`} aria-hidden="true">
            готовая запись
          </div>

          <div className={styles.documents}>
            {documents.map((document) => (
              <article
                className={`${styles.document} ${styles[document.kind]}`}
                key={document.kind}
              >
                <div className={styles.documentMeta}>
                  <span>г. Москва</span>
                  <span>{document.number}</span>
                </div>
                <h3>{document.title}</h3>
                <p className={styles.subtitle}>{document.subtitle}</p>
                <p className={styles.documentBody}>{document.body}</p>
                <div className={styles.signatures} aria-hidden="true">
                  <span>Исполнитель</span>
                  <i />
                  <span>Заказчик</span>
                  <i />
                </div>
                <Seal
                  kind={document.kind}
                  top={document.sealTop}
                  bottom={document.sealBottom}
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
