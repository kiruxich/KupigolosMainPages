import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

const site = "https://kupigolos.ru";

type HeaderLink = readonly [label: string, path: string];
type AiGroup = { title: string; links: readonly HeaderLink[] };
type PreprodGroup = {
  title: string;
  titlePath?: string;
  description?: string;
  links?: readonly HeaderLink[];
};

const preprodLinkReplacements: readonly (readonly [from: string, to: string])[] = [
  [`${site}/audioroliki`, `${site}/reklamnyie-audioroliki`],
  [`${site}/golosovye-privetstviya`, `${site}/zapis-avtootvetchik-ivr`],
  [`${site}/diktory/federalnye`, `${site}/diktory/izvestnye_golosa`],
  [`${site}/diktory/regiony`, `${site}/diktory/reginalnye_golosa`],
  [`${site}/diktory/pryamye-kontakty`, `${site}/diktory/napryamuiu`],
  [`${site}/chto-posmotret`, "https://info.kupigolos.ru/"],
  [`${site}/ceny`, `${site}/price`],
] as const;

const aiGroups: readonly AiGroup[] = [
  {
    title: "Голос и озвучка",
    links: [
      ["Аудио", "/ai"],
      ["Генератор голоса", "/ai/voice/ai-voice-generator"],
      ["Озвучка текста", "/ai/voice/text-to-speech"],
      ["ИИ-озвучка", "/ai/voice/ai-voice-over"],
      ["Каталог голосов", "/ai/voice/library"],
      ["Изменение голоса", "/ai/voice/changer"],
    ],
  },
  {
    title: "Музыка и песни",
    links: [
      ["Генератор музыки", "/ai/music/ai-music-generator"],
      ["Генератор песен", "/ai/music/song-generator"],
      ["Генератор текстов песен", "/ai/music/lyrics-generator"],
      ["Создание музыки в Suno", "/ai/models/suno/music"],
    ],
  },
  {
    title: "Видео и расшифровка",
    links: [
      ["Озвучка видео", "/ai/dubbing-video"],
      ["Извлечение звука из видео", "/ai/audio-tools/extract-audio"],
      ["Видео в MP3", "/ai/audio-tools/video-to-mp3"],
      ["MP4 в MP3", "/ai/audio-tools/converter/mp4-to-mp3"],
      ["Транскрибация", "/ai/transcription"],
      ["Аудио в текст", "/ai/transcription/audio-to-text"],
      ["Видео в текст", "/ai/transcription/video-to-text"],
    ],
  },
  {
    title: "Обработка аудио",
    links: [
      ["Удаление вокала", "/ai/audio-tools/vocal-remover"],
      ["Обрезка аудио", "/ai/audio-tools/trim"],
      ["Конвертеры", "/ai/audio-tools/converter"],
      ["Конвертер в MP3", "/ai/audio-tools/converter/to-mp3"],
      ["WAV в MP3", "/ai/audio-tools/converter/wav-to-mp3"],
      ["MP3 в WAV", "/ai/audio-tools/converter/mp3-to-wav"],
      ["M4A в MP3", "/ai/audio-tools/converter/m4a-to-mp3"],
      ["OGG в MP3", "/ai/audio-tools/converter/ogg-to-mp3"],
      ["MP3 в OGG", "/ai/audio-tools/converter/mp3-to-ogg"],
    ],
  },
  {
    title: "ИИ модели",
    links: [
      ["Suno AI", "/ai/models/suno"],
      ["ElevenLabs", "/ai/models/elevenlabs"],
      ["Fish Audio", "/ai/models/fish-audio"],
      ["HeyGen", "/ai/models/heygen"],
      ["Yandex SpeechKit", "/ai/models/yandex-speechkit"],
    ],
  },
];

const fullUrl = (path: string) => `${site}${path}`;

const serviceGroups: readonly PreprodGroup[] = [
  {
    title: "Озвучка видео",
    titlePath: "/ozvuchka-video",
    links: [
      ["Фильмов и сериалов", "/ozvuchka-filmov"],
      ["Мультфильмов", "/ozvuchka-multfilmov"],
      ["YouTube каналов", "/ozvuchka-video-youtube"],
      ["Видеорекламы", "/ozvuchka-videoreklamy"],
    ],
  },
  {
    title: "Работа с аудио",
    links: [
      ["Озвучка игр", "/ozvuchka-igr"],
      ["Озвучка рекламы", "/ozvuchka-reklamy"],
      ["Запись аудиогидов", "/audiogidy"],
      ["Запись аудиокниг", "/audioknigi"],
      ["Рекламные аудиоролики", "/reklamnyie-audioroliki"],
      ["Голосовые приветствия", "/zapis-avtootvetchik-ivr"],
    ],
  },
  {
    title: "Работа с текстом",
    links: [
      ["Перевод и укладка", "/perevod"],
      ["Сценарии аудиороликов", "/scenarii-audiorolikov"],
    ],
  },
  {
    title: "Локализация и перевод",
    titlePath: "/perevod",
    links: [
      ["Перевод видео", "/perevod-i-ozvuchka-video"],
      ["Перевод игр", "/lokalizaciya-igr"],
      ["Перевод фильмов и сериалов", "/perevod-filmov-i-serialov"],
    ],
  },
  {
    title: "Другие услуги",
    links: [
      ["Озвучка презентаций / слайдов", "/ozvuchka-prezentacij"],
      ["Озвучка обучающих материалов", "/ozvuchka-obuchayushhih-materialov"],
    ],
  },
];

const voiceGroups: readonly PreprodGroup[] = [
  { title: "Иностранные дикторы", titlePath: "/diktory/inostrannye_golosa" },
  {
    title: "Русские дикторы",
    titlePath: "/diktory/russkie",
    links: [
      ["Федеральные", "/diktory/izvestnye_golosa"],
      ["Региональные", "/diktory/reginalnye_golosa"],
    ],
  },
  { title: "Актеры озвучки", titlePath: "/diktory/dubbing" },
  { title: "Контакты дикторов", titlePath: "/diktory/napryamuiu" },
  { title: "ИИ голоса", titlePath: "/diktory/ai" },
];

const infoGroups: readonly PreprodGroup[] = [
  {
    title: "Кто озвучивает",
    titlePath: "/kto-ozvuchivaet",
    description: "Актёры озвучки, персонажи и известные роли",
  },
  {
    title: "Что посмотреть",
    titlePath: "https://info.kupigolos.ru/",
    description: "Фильмы, сериалы и идеи для просмотра",
  },
];

const renderPreprodFooter = () => `<div class="preprod-header-footer">
  <div class="preprod-header-callback">
    <a href="tel:88002004551">8 800 200-45-51</a>
    <button type="button" data-callback-open aria-expanded="false" aria-controls="callback-drawer">Заказать звонок</button>
  </div>
  <nav class="preprod-header-networks" aria-label="Мессенджеры">
    <a href="https://telegram.dog/kupigolos_channel" target="_blank" rel="noopener" aria-label="Telegram">
      <img class="preprod-header-network-hover" src="${site}/img/telegram_red_hover.svg" alt="">
      <img class="preprod-header-network-icon" src="${site}/img/telegram_red.svg" alt="">
    </a>
    <a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM" target="_blank" rel="noopener" aria-label="MAX">
      <img class="preprod-header-network-hover" src="${site}/img/max_red_hover.svg" alt="">
      <img class="preprod-header-network-icon" src="${site}/img/max_red.svg" alt="">
    </a>
  </nav>
</div>`;

const renderPreprodPromo = () => `<aside class="preprod-header-promo">
  <p>Озвучьте свой проект с помощью нейросети</p>
  <a href="https://ai.kupigolos.ru/" target="_blank" rel="noopener">Сгенерировать озвучку</a>
  <div class="preprod-header-promo-mic" aria-hidden="true">
    <img src="${site}/img/teacher/mic.png" alt="">
  </div>
  <img class="preprod-header-promo-art" src="${site}/img/logo_info.svg" alt="" aria-hidden="true">
</aside>`;

function resolveHeaderUrl(path: string) {
  return path.startsWith("http") ? path : fullUrl(path);
}

function renderPreprodRows(groups: readonly PreprodGroup[], activeFirst: boolean) {
  return groups.map(({ title, titlePath, description, links }, index) => {
    const titleContent = `<span>${title}</span>${description ? `<small>${description}</small>` : ""}`;
    const titleMarkup = titlePath
      ? `<a class="preprod-header-title" href="${resolveHeaderUrl(titlePath)}">${titleContent}</a>`
      : `<span class="preprod-header-title" tabindex="0">${titleContent}</span>`;
    const submenu = links?.length
      ? `<div class="preprod-header-submenu">${links.map(([label, path]) => `<a href="${resolveHeaderUrl(path)}">${label}</a>`).join("")}</div>`
      : "";

    return `<div class="preprod-header-row${activeFirst && index === 0 ? " is-active" : ""}">${titleMarkup}${submenu}</div>`;
  }).join("");
}

function renderPreprodPanel({
  id,
  label,
  groups,
  activeFirst = false,
  showFooter = true,
  showPromo = true,
}: {
  id: string;
  label: string;
  groups: readonly PreprodGroup[];
  activeFirst?: boolean;
  showFooter?: boolean;
  showPromo?: boolean;
}) {
  return `<section class="header-mega header-mega-preprod${showPromo ? "" : " header-mega-preprod-compact"}" id="header-panel-${id}" data-header-panel="${id}" aria-hidden="true" aria-label="${label}">
    <div class="preprod-header-menu">
      <div class="preprod-header-content">
        <nav class="preprod-header-links" aria-label="Разделы ${label.toLowerCase()}">${renderPreprodRows(groups, activeFirst)}</nav>
        ${showFooter ? renderPreprodFooter() : ""}
      </div>
      ${showPromo ? renderPreprodPromo() : ""}
    </div>
  </section>`;
}

const servicesPanel = renderPreprodPanel({ id: "services", label: "Услуги", groups: serviceGroups, activeFirst: true });
const voicesPanel = renderPreprodPanel({ id: "voices", label: "Дикторы", groups: voiceGroups });
const aiPanel = renderPreprodPanel({
  id: "ai",
  label: "ИИ сервисы",
  groups: aiGroups.map(({ title, links }) => ({ title, links })),
  activeFirst: true,
});
const infoPanel = renderPreprodPanel({
  id: "info",
  label: "Инфопортал",
  groups: infoGroups,
  activeFirst: true,
  showFooter: false,
  showPromo: false,
});

const preprodAiMobileLinks = aiGroups
  .flatMap(({ links }) => links)
  .map(([label, path]) => `<a href="${fullUrl(path)}">${label}</a>`)
  .join("");

function getPreprodHeaderMarkup() {
  const withPreprodLinks = preprodLinkReplacements.reduce<string>(
    (markup, [from, to]) => markup.replaceAll(from, to),
    homeMarkup.chrome,
  );

  return withPreprodLinks
    .replace(/<section class="header-mega" id="header-panel-services"[\s\S]*?<\/section>/, servicesPanel)
    .replace(/<section class="header-mega" id="header-panel-voices"[\s\S]*?<\/section>/, voicesPanel)
    .replace(/<section class="header-mega" id="header-panel-ai"[\s\S]*?<\/section>/, aiPanel)
    .replace(/<section class="header-mega" id="header-panel-info"[\s\S]*?<\/section>/, infoPanel)
    .replace(
      /<details><summary>ИИ сервисы <span aria-hidden="true">\+<\/span><\/summary><div>[\s\S]*?<\/div><\/details>/,
      `<details><summary>ИИ сервисы <span aria-hidden="true">+</span></summary><div>${preprodAiMobileLinks}</div></details>`,
    );
}

export function Header() {
  return <RenderHomeMarkup markup={getPreprodHeaderMarkup()} />;
}
