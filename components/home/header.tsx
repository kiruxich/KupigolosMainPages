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
      <img src="${site}/img/telegram_hover.svg" alt="">
    </a>
    <a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM" target="_blank" rel="noopener" aria-label="MAX">
      <img src="${site}/img/max.svg" alt="">
    </a>
  </nav>
</div>`;

const renderPreprodPromo = () => `<aside class="preprod-header-promo">
  <p>Озвучьте свой проект с помощью нейросети</p>
  <a href="${site}/ai" target="_blank" rel="noopener">Сгенерировать озвучку</a>
  <img src="${site}/img/teacher/mic.png" alt="" aria-hidden="true">
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

const preprodNetworksPopover = `<nav class="header-action-popover header-networks-popover" id="header-networks-popover" data-header-popover="networks" aria-hidden="true" aria-label="Связаться в мессенджере">
  <a href="https://telegram.dog/studio_kupigolos" target="_blank" rel="noopener" aria-label="Telegram">
    <img class="header-network-icon header-network-icon-hover" src="${site}/img/telegram_hover.svg" alt="">
    <img class="header-network-icon" src="${site}/img/telegram.svg" alt="">
  </a>
  <a href="https://max.ru/u/f9LHodD0cOK-G2obtd_M0YIQMT0QPDbV7eVLequXg2kyv2Ns6b_L2NhBBwM" target="_blank" rel="noopener" aria-label="MAX">
    <img class="header-network-icon" src="${site}/img/max.svg" alt="">
  </a>
  <a href="whatsapp://send?phone=79302125534" target="_blank" rel="noopener" aria-label="WhatsApp">
    <img class="header-network-icon header-network-icon-hover" src="${site}/img/whatsapp_hover.svg" alt="">
    <img class="header-network-icon" src="${site}/img/whatsapp.svg" alt="">
  </a>
</nav>`;

const preprodPhoneIcon = `<svg class="header-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 .86.49c.12 1.2.33 2.38.7 3.5a1 1 0 0 1-.25 1.04l-2.2 2.2Z"/></svg>`;
const preprodMessengerIcon = `<svg class="header-action-icon header-action-icon-messenger" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.145 2 11.258c0 2.912 1.453 5.51 3.726 7.207V22l3.405-1.868c.908.25 1.87.384 2.869.384 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2Zm.994 12.468-2.548-2.719-4.973 2.719 5.47-5.807 2.61 2.72 4.91-2.72-5.469 5.807Z" clip-rule="evenodd"/></svg>`;
const preprodFavoriteIcon = `<svg class="header-action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.1 3.6 13.2C-.7 9.1 1.5 2.5 7 2.5c2.1 0 4 1 5 2.6 1-1.6 2.9-2.6 5-2.6 5.5 0 7.7 6.6 3.4 10.7L12 21.1Z"/></svg>`;

function getPreprodHeaderMarkup() {
  const withPreprodLinks = preprodLinkReplacements.reduce<string>(
    (markup, [from, to]) => markup.replaceAll(from, to),
    homeMarkup.chrome,
  );

  return withPreprodLinks
    .replace(
      /(<button class="header-phone"[^>]*>)[\s\S]*?(<\/button>)/,
      `$1${preprodPhoneIcon}$2`,
    )
    .replace(
      /(<button class="header-networks"[^>]*>)[\s\S]*?(<\/button>)/,
      `$1${preprodMessengerIcon}$2`,
    )
    .replace(
      /(<a class="header-favorites"[^>]*>)[\s\S]*?(<\/a>)/,
      `$1${preprodFavoriteIcon}$2`,
    )
    .replace(/<section class="header-mega" id="header-panel-services"[\s\S]*?<\/section>/, servicesPanel)
    .replace(/<section class="header-mega" id="header-panel-voices"[\s\S]*?<\/section>/, voicesPanel)
    .replace(/<section class="header-mega" id="header-panel-ai"[\s\S]*?<\/section>/, aiPanel)
    .replace(/<section class="header-mega" id="header-panel-info"[\s\S]*?<\/section>/, infoPanel)
    .replace(
      /<details><summary>ИИ сервисы <span aria-hidden="true">\+<\/span><\/summary><div>[\s\S]*?<\/div><\/details>/,
      `<details><summary>ИИ сервисы <span aria-hidden="true">+</span></summary><div>${preprodAiMobileLinks}</div></details>`,
    )
    .replace(
      /<nav class="header-action-popover header-networks-popover"[\s\S]*?<\/nav>/,
      preprodNetworksPopover,
    );
}

export function Header() {
  return <RenderHomeMarkup markup={getPreprodHeaderMarkup()} />;
}
