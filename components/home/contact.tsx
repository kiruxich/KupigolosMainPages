import styles from "./contact.module.css";

export function Contact() {
  return (
    <section className={`contact-stage ${styles.section}`} id="contacts" aria-labelledby="contact-title">
      <div className="contact-media" aria-hidden="true" />
      <div className="shell contact-grid">
        <form className="contact-form" action="mailto:info@kupigolos.ru" method="post" encType="text/plain">
          <header className={`wide ${styles.heading}`}>
            <p>Свяжемся и уточним детали</p>
            <h2 id="contact-title">Быстрый заказ</h2>
            <span>Оставьте удобный контакт и пару слов о задаче. Этого достаточно, чтобы начать.</span>
          </header>
          <label className={`wide ${styles.field}`}>
            <span className={styles.labelLine}><b>01</b> Ваше имя</span>
            <input type="text" name="name" autoComplete="name" placeholder="Например, Анна" required />
          </label>
          <label className={`wide ${styles.field}`}>
            <span className={styles.labelLine}><b>02</b> Как с вами связаться</span>
            <input type="text" name="contact" aria-describedby="contact-help" placeholder="Телефон или e-mail" required />
            <small className={styles.helper} id="contact-help">Укажите один удобный способ связи</small>
          </label>
          <label className={`wide ${styles.field}`}>
            <span className={styles.labelLine}><b>03</b> Telegram <em>необязательно</em></span>
            <input type="text" name="telegram" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="@username" />
          </label>
          <label className={`wide ${styles.field}`}>
            <span className={styles.labelLine}><b>04</b> Что нужно озвучить</span>
            <textarea name="message" rows={4} placeholder="Например: рекламный ролик на 30 секунд, нужен мужской голос" required />
          </label>
          <div className={`wide ${styles.actions}`}>
            <p className="form-note">
              Нажимая кнопку, вы соглашаетесь с <a href="https://kupigolos.ru/privacy">политикой конфиденциальности</a>.
            </p>
            <button className={`button studio-cta studio-cta--order ${styles.submit}`} type="submit">
              <svg className="studio-cta-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-6 3V7a3 3 0 0 1 3-3Z" />
                <path d="M8 9h8M8 13h5" />
              </svg>
              <span>Отправить заявку</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
