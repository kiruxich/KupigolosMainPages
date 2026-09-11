import { homeMarkup } from "./home-markup.generated";
import { RenderHomeMarkup } from "./render-home-markup";

const site = "https://kupigolos.ru";

type HeaderLink = readonly [label: string, path: string];
type AiGroup = { title: string; links: readonly HeaderLink[] };

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

const aiPanel = `<section class="header-mega" id="header-panel-ai" data-header-panel="ai" aria-hidden="true" aria-label="ИИ сервисы">
  <div class="shell header-mega-grid header-mega-grid-ai header-mega-grid-ai-preprod">
    ${aiGroups.map(({ title, links }) => `<div><p>${title}</p>${links.map(([label, path]) => `<a href="${fullUrl(path)}">${label}</a>`).join("")}</div>`).join("")}
    <a class="header-mega-feature" href="${site}/ai"><span>ИИ сервисы</span><strong>Озвучьте свой проект с помощью нейросети</strong><i aria-hidden="true">Перейти в сервисы →</i></a>
  </div>
</section>`;

const infoPanel = `<section class="header-mega" id="header-panel-info" data-header-panel="info" aria-hidden="true" aria-label="Инфопортал">
  <div class="shell header-mega-grid header-mega-grid-info">
    <div><a class="header-mega-group-link" href="${site}/kto-ozvuchivaet">Кто озвучивает <small>Актёры озвучки, персонажи и известные роли</small></a></div>
    <div><a class="header-mega-group-link" href="https://info.kupigolos.ru/">Что посмотреть <small>Фильмы, сериалы и идеи для просмотра</small></a></div>
  </div>
</section>`;

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
