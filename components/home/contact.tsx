import styles from "./contact.module.css";

export function Contact() {
  return (
    <section className={`contact-stage ${styles.section}`} id="contacts" aria-labelledby="contact-title">
      <div className="contact-media" aria-hidden="true" />
      <div className="shell contact-grid">
        <form className="contact-form" action="mailto:info@kupigolos.ru" method="post" encType="text/plain">
          <header className={`wide ${styles.heading}`}>
            <h2 id="contact-title">Быстрый заказ</h2>
          </header>
          <label>
            <span>Ваше имя</span>
            <input type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" required />
          </label>
          <label>
            <span>Телефон или почта</span>
            <input type="text" name="contact" autoComplete="email" placeholder="Куда ответить" required />
          </label>
          <label className="wide">
            <span>Telegram — необязательно</span>
            <input type="text" name="telegram" autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="@username или ссылка на профиль" />
          </label>
          <label className="wide">
            <span>Коротко о задаче</span>
            <textarea name="message" rows={3} placeholder="Например: озвучить ролик на 30 секунд" required />
          </label>
          <button className="button wide" type="submit">Отправить заявку</button>
          <p className="form-note wide">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</p>
        </form>
      </div>
    </section>
  );
}
