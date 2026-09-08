import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const paths = {
  html: resolve(root, 'index.html'),
  css: resolve(root, 'styles.css'),
  refresh: resolve(root, 'refresh.css'),
  js: resolve(root, 'script.js'),
};

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const [name, file] of Object.entries(paths)) {
  check(existsSync(file), `${name}: missing ${file}`);
}

if (!failures.length) {
  const html = readFileSync(paths.html, 'utf8');
  const css = readFileSync(paths.css, 'utf8');
  const refresh = readFileSync(paths.refresh, 'utf8');
  const js = readFileSync(paths.js, 'utf8');
  const stripTags = (value) => value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const railCss = `${css}\n${refresh}`;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const heroVariantMatches = [...html.matchAll(/<section\b[^>]*data-hero-variant(?:="[^"]*")?[^>]*>[\s\S]*?<\/section>/gi)]
    .map((match) => ({
      html: match[0],
      index: match.index ?? -1,
      endIndex: (match.index ?? -1) + match[0].length,
      text: stripTags(match[0]),
    }));
  const voicesSectionMatches = [...html.matchAll(/<section\b[^>]*id="voices"[^>]*>/gi)]
    .map((match) => ({
      html: match[0],
      index: match.index ?? -1,
    }));
  const requiredSections = [
    'start', 'voices', 'ai-services', 'about', 'services', 'portfolio',
    'calculator', 'advantages', 'guarantees', 'process', 'reviews',
    'clients', 'contacts',
  ];
  const aiServices = [
    'Генератор голоса', 'Озвучка текста', 'ИИ-озвучка',
    'Озвучка видео', 'Генератор музыки', 'Генератор песен',
  ];
  const featuredVoices = [
    'Сергей Набиев', 'Алексей Колган', 'Елена Соловьёва',
    'Александр Головчанский', 'Ольга Плетнёва', 'Владимир Ерёмин',
    'Пётр Иващенко', 'Игорь Старосельцев', 'Владимир Зайцев',
    'Всеволод Полищук', 'Руслан Габидуллин', 'Илья Исаев', 'Артём Кретов',
    'Владимир Антоник', 'Сергей Чонишвили', 'Татьяна Шитова',
    'Юрий Брежнев', 'Алексей Неклюдов', 'Борис Репетур',
  ];

  check(h1Count === 1, `html: expected one h1, found ${h1Count}`);
  check(/<title>КупиГолос - Студия озвучивания и дубляжа в Москве<\/title>/.test(html), 'html: SEO title is missing');
  check(/name="description"/.test(html), 'html: meta description is missing');
  check(/rel="canonical" href="https:\/\/kupigolos\.ru\/"/.test(html), 'html: canonical is missing');
  check(/property="og:title"/.test(html) && /property="og:image"/.test(html), 'html: social sharing metadata is missing');
  check(/application\/ld\+json/.test(html), 'html: JSON-LD is missing');
  check(/<html lang="ru" data-theme="brand">/.test(html), 'html: brand direction must be active');
  check(!/data-theme-option=/.test(html), 'html: obsolete theme switcher is still present');
  check(!/class="theme-dock"/.test(html), 'html: obsolete theme dock is still present');
  check(!/class="marquee"/.test(html), 'html: decorative marquee is still present');
  check(heroVariantMatches.length === 1, `html: expected exactly one hero section via [data-hero-variant], found ${heroVariantMatches.length}`);
  check(!/data-hero-option|hero-option-|hero-option-label|hero-option-id|Вариант\s*\d+/iu.test(html), 'html: option labels remain');
  check(!/data-hero-blur-control|data-hero-blur-input|data-hero-blur-output|hero-blur-control/iu.test(html), 'html: hero blur controls remain');
  check((html.match(/class="hero-proof"/g) || []).length === 1, 'html: hero proof row is missing or duplicated');
  check(!/<form\b[^>]*action="(?!mailto:)[^"]+"/i.test(html), 'html: backend form submission remains');
  check(voicesSectionMatches.length === 1, `html: expected exactly one #voices section, found ${voicesSectionMatches.length}`);
  if (heroVariantMatches.length === 1) {
    const heroCopy = {
      kicker: 'Профессиональная',
      title: 'Студия озвучивания в Москве',
      lead: 'Подготовим профессиональную озвучку диктором на любом языке мира за один день. Работаем на оборудовании мировых брендов.',
      cta: 'Обсудить проект',
    };
    const { html: sectionHtml, text } = heroVariantMatches[0];
    const ctaCount = (sectionHtml.match(/class="[^"]*hero-action-primary[^"]*"/g) || []).length;
    check(text.includes(heroCopy.kicker), 'html: hero is missing the original kicker');
    check(text.includes(heroCopy.title), 'html: hero is missing the original title');
    check(text.includes(heroCopy.lead), 'html: hero is missing the original lead');
    check(ctaCount === 1, `html: hero must contain exactly one primary CTA, found ${ctaCount}`);
    check(text.includes(heroCopy.cta) && sectionHtml.includes('data-order-open'), 'html: hero is missing the primary project discussion action');
    check(/<h1\b/i.test(sectionHtml), 'html: hero title must be h1');
    check(['Более 800 голосов', '60 языков', 'Озвучка за один день'].every((fact) => text.includes(fact)), 'html: hero proof facts are incomplete');
    check(sectionHtml.includes('assets/hero-studio-session-v1.png'), 'html: studio-window hero asset is missing');
    check(existsSync(resolve(root, 'assets/hero-studio-session-v1.png')), 'assets: studio-window hero image is missing');
    check(sectionHtml.includes('href="#calculator"'), 'html: calculator action is missing from hero');
    check(sectionHtml.includes('href="#portfolio"'), 'html: portfolio listening action is missing from hero');
    if (voicesSectionMatches.length === 1) {
      check(voicesSectionMatches[0].index > heroVariantMatches[0].endIndex, 'html: #voices must occur after the hero');
    }
  }
  check(!/assets\/[12]\.png/.test(html) && !/class="top-hero-microphone"/.test(html), 'html: retired atomic hero artwork remains');
  check((html.match(/data-header-trigger=/g) || []).length === 4, 'html: expected four desktop mega-menu triggers');
  check((html.match(/data-header-panel=/g) || []).length === 4, 'html: expected four desktop mega menus');
  check((html.match(/data-header-popover-trigger=/g) || []).length === 2, 'html: header action popovers are incomplete');
  check(/data-header-utility/.test(html), 'html: desktop utility menu is missing');
  check(/data-callback-drawer/.test(html), 'html: callback drawer is missing');
  check(/data-order-modal/.test(html), 'html: quick order modal is missing');
  check(/data-mobile-menu/.test(html), 'html: mobile navigation drawer is missing');
  check(/class="studio-rail"/.test(html) && (html.match(/data-rail-target=/g) || []).length === 13, 'html: studio navigation rail is incomplete');
  check(!/font-switcher|data-font-choice/.test(html), 'html: obsolete font switcher is still present');
  check(/Cormorant\+Garamond/.test(html) && /Manrope:wght/.test(html) && !/Jost:wght/.test(html), 'html: selected Cormorant/Manrope pair is not locked');
  check(!/cta-option-/.test(html), 'html: comparison CTA options remain');
  check(!/hero-concepts-stage|hero-concept-preview/.test(html), 'html: old miniature hero comparison remains');
  check(!/hero-option-id|Вариант 0[1-5]/.test(html), 'html: temporary hero option labels remain');
  check(!/data-hero-blur-control|data-hero-blur-output/.test(html), 'html: obsolete hero blur control remains');
  check(!/simple-liquid-glass|liquid-web/.test(html), 'html: rejected liquid button libraries are still present');
  check(/class="talent-stage voice-categories-stage"/.test(html), 'html: voice category component scope is missing');
  check(html.includes('href="https://kupigolos.ru/diktory/detskie_golosa"'), 'html: children voice category is missing');
  check(html.includes('href="https://kupigolos.ru/diktory/izvestnye_golosa"'), 'html: famous voice category is missing');
  check(!/data-cinema|data-story-frame|data-shader-canvas/.test(html), 'html: retired cinematic scene hooks are still present');
  check(!/class="voice-stage/.test(html), 'html: legacy voice card section is still present');
  check(!/class="ai-stage/.test(html), 'html: legacy AI list section is still present');
  check(/data-audio-src/.test(html), 'html: audio controls are missing');
  check(/class="figma-voices-panel"/.test(html), 'html: Figma voice panel is missing');
  check((html.match(/class="figma-voice-card"/g) || []).length === 5, 'html: expected five Figma voice cards');
  check(html.includes('assets/voices/alexey-kolgan-v2.jpg'), 'html: enhanced local Alexey Kolgan portrait is missing');
  check(!/Кастинг-лист|voice-concept|casting-row|data-scroll-for="casting-track"/.test(html), 'html: obsolete casting or featured voice block remains');
  check(!/ИИ-модели|class="ai-voice-lab|data-ai-picker/.test(html), 'html: removed AI model showcase remains');
  check(/class="ai-toolkit reveal"/.test(html), 'html: full AI tools section is missing');
  check((html.match(/class="ai-tool-card ai-tool-card-/g) || []).length === 6, 'html: expected six featured AI tools');
  check(!/class="ai-tool-links/.test(html), 'html: collapsed AI tool link list remains');
  check(/class="portfolio-reel"/.test(html) && (html.match(/data-project data-project-name=/g) || []).length === 3, 'html: editorial portfolio reel is missing');
  check(/class="calculator-summary"/.test(html) && /aria-live="polite"/.test(html), 'html: calculator estimate summary is missing');
  check(/class="service-index/.test(html), 'html: crawlable service index is missing');
  check((html.match(/class="service-index-groups"[\s\S]*?<\/nav>/)?.[0].match(/<a href=/g) || []).length >= 19, 'html: service index must expose the live service taxonomy');
  check((html.match(/\brequired\b/g) || []).length >= 3, 'html: contact fields must be required');
  check(!/[\u2013\u2014]/.test(html), 'html: en/em dash detected');

  for (const id of requiredSections) {
    check(new RegExp(`id="${id}"`).test(html), `html: missing #${id}`);
  }
  for (const title of aiServices) {
    check(html.includes(title), `html: missing AI service "${title}"`);
  }
  for (const name of featuredVoices) {
    check(js.includes(name), `js: missing featured voice "${name}"`);
  }
  const voiceDataBlock = js.match(/const voiceSlides = \[([\s\S]*?)\n\];/);
  check(Boolean(voiceDataBlock), 'js: featured voice data is missing');
  check((voiceDataBlock?.[1].match(/\{ name:/g) || []).length === 19, 'js: expected 19 featured voices from the live homepage');

  check(!css.includes('[data-theme="console"]'), 'css: console theme is still present');
  check(!css.includes('[data-theme="studio"]'), 'css: studio theme is still present');
  for (const width of ['1100px', '820px', '560px']) {
    check(css.includes(`max-width: ${width}`), `css: missing ${width} breakpoint`);
  }
  check(css.includes('prefers-reduced-motion'), 'css: reduced-motion support is missing');
  check(!/\.reveal\s*\{[^}]*\btransform\s*:/s.test(css), 'css: legacy reveal transform conflicts with interactive element transforms');
  check(css.includes(':focus-visible'), 'css: visible focus styles are missing');
  check(!css.includes('assets/1.png') && !css.includes('top-hero-microphone'), 'css: retired atomic hero artwork remains');
  check(!refresh.includes('.font-switcher') && !refresh.includes('data-font="airy"'), 'refresh: obsolete font comparison styles are still present');
  check(!refresh.includes('.hero-concepts-stage') && !refresh.includes('.hero-concept-preview'), 'refresh: old miniature hero comparison styles remain');
  check(refresh.includes('.studio-rail-console') && refresh.includes('studio-active-signal') && refresh.includes('.studio-rail-progress'), 'refresh: studio signal monitor treatment is missing');
  check(refresh.includes('height: var(--rail-progress-height, 0%)') && refresh.includes('transform: none'), 'refresh: rail progress must grow by height instead of scaleY');
  check(refresh.includes('@supports (animation-timeline: view())') && refresh.includes('animation-timeline: view(block)'), 'refresh: continuous scroll-driven reveals are missing');
  check(refresh.includes('translate: 0 18px') && refresh.includes('studio-reveal-scroll'), 'refresh: restrained compositor-only reveal motion is missing');
  check(refresh.includes('#main-content > section { padding-left: var(--rail-width); }'), 'refresh: section backgrounds must continue beneath the translucent rail');
  check(!/\.studio-rail(?::(?:hover|focus-within)|:is\([^{}]*?(?:hover|focus-within)[^{}]*?\))/s.test(railCss), 'css: rail expansion selectors remain');
  check(!refresh.includes('.hero-blur-control') && !refresh.includes('--hero-blur-fill'), 'refresh: hero blur controls remain');
  check(refresh.includes('.figma-voices-panel') && refresh.includes('.figma-voice-card') && !refresh.includes('.featured-layout'), 'refresh: Figma voice section is incomplete or featured voice block remains');
  check(refresh.includes('.ai-tool-grid') && refresh.includes('.ai-tool-card-video') && refresh.includes('.ai-toolkit-facts'), 'refresh: AI tool section treatment is incomplete');
  check(refresh.includes('.service-item::before') && refresh.includes('.service-action'), 'refresh: full service cards are missing');
  check(refresh.includes('.voice-categories-stage .talent-card'), 'refresh: voice category card treatment is missing');
  check(/\.talent-grid \{[^}]*grid-template-columns:\s*repeat\(6,/s.test(css), 'css: six-card desktop shelf is missing');
  check(css.includes('#f54622'), 'css: public brand accent is missing');
  check(/\.site-header \.header-project\.button \{[^}]*color:\s*white/s.test(css), 'css: header project link must be visible before hover');
  check((html.match(/class="service-item service-item-/g) || []).length === 6, 'html: expected six full service cards');
  check(!css.includes('transition: color .22s, padding-left .22s'), 'css: link interactions must avoid layout-triggering padding animation');
  check(/\.portfolio-reel \{[^}]*grid-template-columns:/s.test(css), 'css: editorial portfolio layout is missing');
  check(/\.calculator-choice \{[^}]*grid-template-columns:/s.test(css), 'css: calculator option rows are missing');
  check(/\.site-header\.on-light \{[^}]*color:\s*var\(--ink\)/s.test(css), 'css: light-surface header contrast state is missing');
  check(/\.site-nav \{[^}]*font-size:\s*\.92rem[^}]*font-weight:\s*600/s.test(css), 'css: header navigation type must remain legible');

  check(!js.includes('localStorage'), 'js: obsolete theme persistence is still present');
  check(!js.includes('themechange'), 'js: obsolete theme switching is still present');
  check(!js.includes("event.preventDefault();\n  const button = event.currentTarget.querySelector('button[type=\"submit\"]')"), 'js: fake contact submission handler is still present');
  check(js.includes('IntersectionObserver'), 'js: reveal observer is missing');
  check(js.includes('function openHeaderPanel(') && js.includes('function closeHeaderPanels('), 'js: header panel controller is missing');
  check(!js.includes('updateHeroBackgroundBlur') && !js.includes('--hero-blur-fill'), 'js: obsolete hero blur controller remains');
  check(js.includes('HTMLAudioElement'), 'js: audio feature check is missing');
  check(js.includes('function selectPortfolioProject(project)'), 'js: portfolio project controller is missing');
  check(js.includes('function syncHeaderTone()') && js.includes("classList.toggle('on-light'"), 'js: automatic header contrast switching is missing');
  check(js.includes('function setDrawer(') && js.includes("event.key === 'Escape'"), 'js: drawer interaction is missing');
  check(js.includes('function setStudioRailSection(sectionId)') && js.includes('studioRailObserver'), 'js: studio navigation rail controller is missing');
  check(js.includes('calculateSectionProgress(window.scrollY, studioRailSectionAnchors)'), 'js: rail progress must interpolate continuously between section anchors');
  check(js.includes("window.addEventListener('scroll', () => scheduleStudioRailProgress()"), 'js: rail progress must update throughout scrolling');
  check(js.includes("CSS.supports('animation-timeline: view()')") && js.includes("item.dataset.scrollReveal = ''"), 'js: native scroll-driven reveal enhancement is missing');
  check(!js.includes('window.scrollY / scrollableHeight'), 'js: rail progress must not use whole-document scroll percentage');
  check(js.includes("setProperty('--rail-progress-height'"), 'js: rail progress must set height without compressing its tick pattern');
  check(!js.includes('data-featured-picker') && !js.includes('data-featured-play'), 'js: removed featured voice picker remains');
  check(!js.includes('data-ai-picker') && !js.includes('fitAiModelName'), 'js: removed AI model controller remains');
  check(js.includes('function syncVoiceScroll(track)') && js.includes('track.scrollBy'), 'js: voice carousel controls are missing');
  check(!js.includes('setFontMode') && !js.includes('fontChoices'), 'js: obsolete font comparison controller is still present');
  check(!js.includes('window.LiquidWeb') && !js.includes('initializeLiquidButton'), 'js: obsolete Liquid Web controller is still present');
}

if (failures.length) {
  console.error(`Validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Validation passed: structure, themes, motion and interaction hooks are present.');
