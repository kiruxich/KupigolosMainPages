const serviceCards = [
  {
    number: "01",
    type: "дубляж и закадр",
    title: "Озвучка видео",
    description:
      "Фильмы, реклама, YouTube и презентации: запишем, почистим, сведём и подготовим дорожку к монтажу.",
    note: "60+ языков",
    action: "Озвучить видео",
    href: "https://kupigolos.ru/ozvuchka-video",
    className: "service-item-video service-priority-high service-span-7",
  },
  {
    number: "02",
    type: "персонажи",
    title: "Озвучка игр",
    description:
      "Подберём актёров, запишем реплики и соберём цельное звучание персонажей для игры.",
    note: "актёры дубляжа",
    action: "Озвучить игру",
    href: "https://kupigolos.ru/ozvuchka-igr",
    className: "service-item-games service-priority-high service-span-5",
  },
  {
    number: "03",
    type: "long-form",
    title: "Аудиокниги и аудиогиды",
    description:
      "Длинные проекты с режиссурой, единым звучанием и контролем качества каждой главы.",
    note: "расчёт по объёму",
    action: "Заказать запись",
    href: "https://kupigolos.ru/audioknigi",
    className: "service-item-books service-priority-medium service-span-7",
  },
  {
    number: "04",
    type: "60+ языков",
    title: "Локализация и перевод",
    description:
      "Перевод, укладка, синхронизация и запись носителей для видео, игр и корпоративных материалов.",
    note: "под ключ",
    action: "Локализовать",
    href: "https://kupigolos.ru/perevod",
    className: "service-item-localization service-priority-medium service-span-5",
  },
  {
    number: "05",
    type: "телефония",
    title: "IVR и голосовые меню",
    description: "Приветствия и навигация для контактных центров и автоответчиков.",
    note: "от 1 500 ₽",
    action: "Создать IVR",
    href: "https://kupigolos.ru/zapis-avtootvetchik-ivr",
    className: "service-item-ivr service-priority-compact service-span-4",
  },
  {
    number: "06",
    type: "под ключ",
    title: "Аудиореклама",
    description: "Идея, запись диктора, музыка, саунд-дизайн и готовый мастер.",
    note: "от 2 500 ₽",
    action: "Заказать ролик",
    href: "https://kupigolos.ru/reklamnyie-audioroliki",
    className: "service-item-ad service-priority-compact service-span-4",
  },
  {
    number: "07",
    type: "текст",
    title: "Написание сценариев",
    description: "Тексты под хронометраж, площадку и нужный характер подачи.",
    note: "от 2 000 ₽",
    action: "Заказать текст",
    href: "https://kupigolos.ru/scenarii-audiorolikov",
    className: "service-item-copy service-priority-compact service-span-4",
  },
] as const;

const serviceGroups = [
  {
    title: "Озвучка видео",
    links: [
      ["Фильмы и сериалы", "https://kupigolos.ru/ozvuchka-filmov"],
      ["Мультфильмы", "https://kupigolos.ru/ozvuchka-multfilmov"],
      ["YouTube-каналы", "https://kupigolos.ru/ozvuchka-video-youtube"],
      ["Видеореклама", "https://kupigolos.ru/ozvuchka-videoreklamy"],
    ],
  },
  {
    title: "Работа с аудио",
    links: [
      ["Озвучка игр", "https://kupigolos.ru/ozvuchka-igr"],
      ["Озвучка рекламы", "https://kupigolos.ru/ozvuchka-reklamy"],
      ["Запись аудиогидов", "https://kupigolos.ru/audiogidy"],
      ["Запись аудиокниг", "https://kupigolos.ru/audioknigi"],
      ["Рекламные аудиоролики", "https://kupigolos.ru/reklamnyie-audioroliki"],
      ["Голосовые приветствия и IVR", "https://kupigolos.ru/zapis-avtootvetchik-ivr"],
    ],
  },
  {
    title: "Локализация и текст",
    links: [
      ["Перевод и укладка", "https://kupigolos.ru/perevod"],
      ["Сценарии аудиороликов", "https://kupigolos.ru/scenarii-audiorolikov"],
      ["Перевод видео", "https://kupigolos.ru/perevod-i-ozvuchka-video"],
      ["Локализация игр", "https://kupigolos.ru/lokalizaciya-igr"],
      ["Перевод фильмов и сериалов", "https://kupigolos.ru/perevod-filmov-i-serialov"],
    ],
  },
  {
    title: "Другие форматы",
    links: [
      ["Презентации и корпоративные видео", "https://kupigolos.ru/ozvuchka-prezentacij"],
      ["Обучающие материалы", "https://kupigolos.ru/ozvuchka-obuchayushchih-materialov"],
      ["Актёры озвучки и дубляжа", "https://kupigolos.ru/diktory/dubbing"],
      ["Иностранные дикторы", "https://kupigolos.ru/diktory/inostrannye_golosa"],
    ],
  },
] as const;

export function Services() {
  return (
    <section className="services-stage section-light" id="services" aria-labelledby="services-title">
      <div className="shell">
        <div className="section-heading split-heading reveal">
          <div>
            <p className="kicker">Что мы умеем</p>
            <h2 id="services-title">Наши услуги</h2>
          </div>
          <p>Берём на себя весь звуковой продакшн: от первой строки сценария до готового мастер-файла.</p>
        </div>

        <div className="service-editorial">
          <article className="service-feature service-feature-voice reveal">
            <div className="service-copy">
              <span>Самое востребованное направление</span>
              <h3>Запись дикторов</h3>
              <p>
                Российские и иностранные голоса, актёры дубляжа и знакомые тембры для рекламы, видео,
                игр и корпоративных проектов.
              </p>
              <a href="https://kupigolos.ru/diktory">
                Выбрать голос <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="service-visual service-wave" aria-hidden="true">
              <svg viewBox="0 0 520 240">
                <path d="M0 120 C55 120 55 45 110 45 S165 195 220 195 S275 70 330 70 S385 155 440 155 S495 120 520 120" />
              </svg>
            </div>
          </article>

          <div className="service-columns" aria-label="Основные направления услуг">
            {serviceCards.map((service) => (
              <a
                className={`service-item ${service.className} reveal`}
                href={service.href}
                key={service.title}
              >
                <span className="service-number">{service.number}</span>
                <span className="service-type">{service.type}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-price">{service.note}</span>
                <span className="service-action">
                  {service.action} <span aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>

          <nav className="service-index reveal" aria-labelledby="service-index-title">
            <div className="service-index-heading">
              <p className="kicker">Все направления</p>
              <h3 id="service-index-title">Звуковой продакшн под ключ</h3>
              <p>
                Записываем голос, переводим, синхронизируем и сводим материал для рекламы, кино, игр и
                корпоративных проектов.
              </p>
            </div>
            <div className="service-index-groups">
              {serviceGroups.map((group) => (
                <div key={group.title}>
                  <h4>{group.title}</h4>
                  {group.links.map(([label, href]) => (
                    <a href={href} key={label}>
                      {label} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
