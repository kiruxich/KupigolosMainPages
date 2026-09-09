import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";

const sourceDirectory = process.argv[2];
if (!sourceDirectory) {
  throw new Error("Usage: node scripts/generate-seo-content.mjs /path/to/seo-html-files");
}

const sources = {
  diktory: join(sourceDirectory, "kupigolos-diktory-seo.html"),
  dubbing: join(sourceDirectory, "kupigolos-aktery-dublyazha.html"),
  famous: join(sourceDirectory, "kupigolos-izvestnye-diktory-seo-prototype.html"),
  women: join(sourceDirectory, "kupigolos-zhenskie-golosa-seo.html"),
  localization: join(sourceDirectory, "kupigolos-lokalizaciya-kontenta-seo.html"),
};

const trustMarkup = `
  <div class="kg-kicker">Студия КупиГолос</div>
  <h2>Почему наша студия?</h2>
  <div class="kg-trust-grid kg-grid">
    <article class="kg-trust-card kg-card"><div class="kg-trust-stat">800+</div><h3>Профессиональных голосов</h3><p>Дикторы, актеры дубляжа и носители иностранных языков для проектов любого формата.</p></article>
    <article class="kg-trust-card kg-card"><div class="kg-trust-stat">60+</div><h3>Языков мира</h3><p>Перевод, локализация и запись с учетом языка, рынка и культурного контекста.</p></article>
    <article class="kg-trust-card kg-card"><div class="kg-trust-stat">1 день</div><h3>На быструю запись</h3><p>Срок подтверждаем до старта и выстраиваем производство под дедлайн проекта.</p></article>
    <article class="kg-trust-card kg-card"><div class="kg-trust-stat">13 лет</div><h3>В сфере озвучивания</h3><p>Берем на себя кастинг, запись, монтаж, постпродакшн и передачу готовых файлов.</p></article>
  </div>`;

const processMarkup = `
  <div class="kg-kicker">Производство</div><h2>Как происходит запись</h2>
  <div class="kg-steps">
    <article class="kg-step"><h3>Получаем материалы</h3><p>Проверяем текст, хронометраж, формат, произношение и требования к готовым файлам.</p></article>
    <article class="kg-step"><h3>Подбираем голос</h3><p>Собираем короткий список дикторов по задаче, бюджету, сроку и характеру подачи.</p></article>
    <article class="kg-step"><h3>Записываем</h3><p>Проводим сессию в студии, контролируем дикцию, интонацию и соответствие брифу.</p></article>
    <article class="kg-step"><h3>Готовим результат</h3><p>Чистим и монтируем запись, проверяем материал и передаем файлы в согласованном формате.</p></article>
  </div>`;

const reviewMarkup = `
  <div class="kg-kicker">Отзывы</div><h2>О нас говорят</h2>
  <div class="kg-review-grid"><blockquote class="kg-review"><div class="kg-review-head"><span class="kg-review-name">Попова Е.</span><time class="kg-review-date" datetime="2019-10-30">30 октября 2019</time></div><p>Здесь грамотные специалисты, большой выбор дикторов, всё сделали в срок и как надо. В процессе совместной творческой работы прислушивались к пожеланиям и всегда шли навстречу!</p></blockquote></div>`;

const clientsMarkup = `
  <div class="kg-kicker">Клиенты</div><h2>Лучшие выбирают лучших</h2>
  <p class="kg-intro">К нам обращаются крупнейшие российские и международные компании.</p>
  <div class="kg-client-names" aria-label="Клиенты студии"><span>Tefal</span><span>Toyota</span><span>IKEA</span><span>Л’Этуаль</span><span>Makita</span><span>Авито</span><span>Битрикс24</span><span>UNESCO</span></div>`;

const guaranteeMarkup = `
  <div class="kg-kicker">Гарантии</div><h2>Качество гарантируем</h2>
  <div class="kg-grid"><article class="kg-card"><h3>Подписываем договор</h3><p>В документе указываем условия сотрудничества, объемы и сроки работ. Предоставляем закрывающие документы.</p></article><article class="kg-card"><h3>Работаем по NDA</h3><p>Подписываем соглашение о неразглашении и обеспечиваем конфиденциальность материалов.</p></article><article class="kg-card"><h3>Передаем права</h3><p>Соблюдаем авторские права и фиксируем корректную передачу прав на готовые записи.</p></article></div>`;

const priceMarkup = `
  <div class="kg-kicker">Стоимость</div><h2>Стоимость перевода носителем языка</h2>
  <p class="kg-intro">Стоимость указана в рублях за одну переводческую страницу: 1800 знаков, включая пробелы.</p>
  <div class="kg-table-wrap"><table class="kg-table"><thead><tr><th>Язык</th><th>Стоимость</th></tr></thead><tbody>
  <tr><td>Английский</td><td>от 750 ₽</td></tr><tr><td>Испанский</td><td>от 850 ₽</td></tr><tr><td>Итальянский</td><td>от 850 ₽</td></tr><tr><td>Немецкий</td><td>от 850 ₽</td></tr><tr><td>Французский</td><td>от 850 ₽</td></tr><tr><td>Китайский</td><td>от 1 350 ₽</td></tr><tr><td>Японский</td><td>от 1 350 ₽</td></tr><tr><td>Арабский</td><td>от 950 ₽</td></tr>
  </tbody></table></div>`;

function cleanDocument(sourcePath) {
  const source = readFileSync(sourcePath, "utf8");
  const dom = new JSDOM(source);
  const { document, NodeFilter } = dom.window;
  const main = document.querySelector("main");
  if (!main) throw new Error(`No <main> in ${sourcePath}`);

  const walker = document.createTreeWalker(main, NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((node) => node.remove());

  main.querySelectorAll("[style]").forEach((node) => node.removeAttribute("style"));
  main.querySelectorAll('a[href="#"]').forEach((node) => node.setAttribute("href", "#contacts"));
  main.querySelectorAll(".kg-note").forEach((node) => {
    if (/production|прототип|исходн|выдуман/i.test(node.textContent ?? "")) node.remove();
  });
  main.querySelectorAll("p").forEach((node) => {
    const text = node.textContent ?? "";
    if (/^В production (выводится|оставить|сохранить)|^Ниже — пример первых карточек/i.test(text)) {
      node.textContent = "Слушайте демо, сравнивайте исполнителей и используйте фильтры, чтобы быстрее найти подходящий голос.";
    }
    if (/оперативность.*не выводить придуманный статус/i.test(text)) {
      node.textContent = "Для срочного проекта выбирайте дикторов с ближайшим доступным временем записи. Точный срок подтвердит менеджер после получения текста.";
    }
    if (/К студии обращаются.*В production/i.test(text)) {
      node.textContent = "К студии обращаются крупные российские и международные компании.";
    }
    if (/Обычные индексируемые ссылки/i.test(text)) {
      node.textContent = "Быстрые ссылки на разделы каталога";
    }
    if (/Индексируемые ссылки на основные подразделы/i.test(text)) {
      node.textContent = "Основные разделы каталога";
    }
    if (/Новый блок навигации выше/i.test(text)) {
      node.textContent = text.replace(/ Новый блок навигации выше.*$/i, "");
    }
    if (/расширенная SEO-информация/i.test(text)) {
      node.textContent = text.replace("расширенная SEO-информация", "подробная информация");
    }
    if (/Если данные о доступности есть в системе/i.test(text)) {
      node.textContent = "Срок подтверждается для конкретного диктора после получения текста и требований к записи.";
    }
    if (/В карточке оставить текущие демо/i.test(text)) {
      node.textContent = text.replace("В карточке оставить текущие демо и специализации.", "Перед заказом можно послушать демо и оценить специализацию.");
    }
    node.textContent = (node.textContent ?? "").replace("текущем production-процессе", "процессе студии");
  });
  main.querySelectorAll(".kg-source-player span").forEach((node) => {
    if (/берем штатный|берём штатный/i.test(node.textContent ?? "")) node.textContent = "Демо голоса";
  });

  const replacements = [
    ["#why-studio", trustMarkup],
    ["#recording-process", processMarkup],
    ["#reviews", reviewMarkup],
  ];
  for (const [selector, markup] of replacements) {
    const section = main.querySelector(selector);
    const wrap = section?.querySelector(".kg-wrap");
    if (wrap) wrap.innerHTML = markup;
  }

  main.querySelectorAll(".kg-source-block").forEach((node, index) => {
    node.innerHTML = index === 0 ? trustMarkup : index === 1 ? processMarkup : index === 2 ? reviewMarkup : clientsMarkup;
  });

  main.querySelectorAll(".kg-source").forEach((node) => {
    const text = node.textContent ?? "";
    node.classList.remove("kg-source");
    if (/Таблица стоимости/i.test(text)) node.innerHTML = priceMarkup;
    else if (/Качество гарантируем/i.test(text)) node.innerHTML = guaranteeMarkup;
    else if (/О нас говорят/i.test(text)) node.innerHTML = reviewMarkup;
    else if (/Лучшие выбирают лучших/i.test(text)) node.innerHTML = clientsMarkup;
  });

  main.querySelectorAll("details p").forEach((node) => {
    node.textContent = (node.textContent ?? "")
      .replace(/ В прототипе этот блок не заменяет реальные условия исходной страницы\.?/g, "")
      .replace(/ Условия не нужно обещать в карточке без подтверждения\.?/g, "");
  });

  const trailingNote = [...main.querySelectorAll("p")].find((node) =>
    /Важно для production/i.test(node.textContent ?? ""),
  );
  trailingNote?.remove();

  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((script) => JSON.parse(script.textContent || "{}"));

  return { html: main.innerHTML.trim(), jsonLd };
}

const result = Object.fromEntries(
  Object.entries(sources).map(([key, sourcePath]) => [key, cleanDocument(sourcePath)]),
);

const output = `/* Generated from the SEO-approved HTML references. Do not edit by hand. */\nexport const seoDocuments = ${JSON.stringify(result, null, 2)} as const;\n`;
writeFileSync(new URL("../lib/seo-documents.ts", import.meta.url), output);
