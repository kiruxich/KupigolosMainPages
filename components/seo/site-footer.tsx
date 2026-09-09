import Link from "next/link";

export function ContactSection() {
  return (
    <section id="contacts" className="bg-[#f4f5f8] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[.18em] text-[#f24b2b]">Начнем с голоса</p>
          <h2 className="max-w-[10ch] text-4xl font-bold leading-[1.02] tracking-[-.05em] text-[#273778] sm:text-6xl">Расскажите о проекте</h2>
          <p className="mt-6 max-w-md leading-7 text-[#66709a]">Подберем диктора, оценим сроки и предложим оптимальный формат производства.</p>
        </div>
        <form className="grid gap-5 sm:grid-cols-2" action="mailto:info@kupigolos.ru" method="post" encType="text/plain">
          <label className="grid gap-2 text-sm font-bold text-[#273778]">Ваше имя<input className="h-13 rounded-xl border border-[#d9ddeb] bg-white px-4 font-normal outline-none focus:border-[#f24b2b]" name="name" autoComplete="name" required /></label>
          <label className="grid gap-2 text-sm font-bold text-[#273778]">Телефон или почта<input className="h-13 rounded-xl border border-[#d9ddeb] bg-white px-4 font-normal outline-none focus:border-[#f24b2b]" name="contact" autoComplete="email" required /></label>
          <label className="grid gap-2 text-sm font-bold text-[#273778] sm:col-span-2">Коротко о задаче<textarea className="min-h-32 rounded-xl border border-[#d9ddeb] bg-white p-4 font-normal outline-none focus:border-[#f24b2b]" name="message" required /></label>
          <button className="min-h-13 rounded-xl bg-[#f24b2b] px-6 font-bold text-white transition hover:bg-[#d94326] sm:col-span-2" type="submit">Отправить заявку</button>
          <p className="text-xs leading-5 text-[#7880a2] sm:col-span-2">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.</p>
        </form>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#3b4173] px-4 py-14 text-white sm:px-6">
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div><Link className="text-xl font-extrabold" href="/">купи<span className="text-[#ff7659]">голос</span></Link><p className="mt-5 max-w-xs text-sm leading-6 text-white/60">Онлайн-сервис для выбора лучших дикторов и производства озвучки.</p></div>
        <div><h2 className="mb-3 text-sm font-bold">Москва</h2><p className="text-sm leading-6 text-white/60">Большой Саввинский переулок, 9 стр. 3<br />Пн - Пт с 10:00 до 19:00</p></div>
        <div><h2 className="mb-3 text-sm font-bold">Нижний Новгород</h2><p className="text-sm leading-6 text-white/60">Московское шоссе, 52 корп. 4</p><a className="mt-2 inline-block text-sm" href="mailto:info@kupigolos.ru">info@kupigolos.ru</a></div>
        <div className="flex flex-col gap-2 text-lg font-bold"><a href="tel:88002004551">8 800 200-45-51</a><a href="tel:+79302125534">+7 (930) 212-55-34</a></div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1180px] flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-xs text-white/50"><span>© 2013 - 2026 КупиГолос</span><a href="https://kupigolos.ru/privacy">Политика конфиденциальности</a><a href="#start">Наверх ↑</a></div>
    </footer>
  );
}

