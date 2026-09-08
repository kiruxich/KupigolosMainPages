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
  const h1Count = (html.match(/<h1\b/gi) || []).length;
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
  check(/class="top-stage hero-option hero-option-director"/.test(html), 'html: opening hero option is missing');
  check((html.match(/class="hero-option-backdrop"/g) || []).length === 5, 'html: expected five full hero backdrops');
  check((html.match(/data-hero-option="0[1-5]"/g) || []).length === 5, 'html: expected five full hero sections');
  for (const file of [
    '01-directors-desk.png', '02-through-glass.png', '03-human-voice.png',
    '04-recording-archive.png', '05-night-control-room.png',
  ]) {
    check(existsSync(resolve(root, 'assets', 'hero-options', file)), `asset: missing hero option ${file}`);
  }
  check(!/assets\/[12]\.png/.test(html) && !/class="top-hero-microphone"/.test(html), 'html: retired atomic hero artwork remains');
  check(/id="site-menu"/.test(html) && /class="menu-close"/.test(html), 'html: expanded navigation panel is missing');
  check(/class="studio-rail"/.test(html) && (html.match(/data-rail-target=/g) || []).length === 13, 'html: studio navigation rail is incomplete');
  check(!/font-switcher|data-font-choice/.test(html), 'html: obsolete font switcher is still present');
  check(/Cormorant\+Garamond/.test(html) && /Manrope:wght/.test(html) && !/Jost:wght/.test(html), 'html: selected Cormorant/Manrope pair is not locked');
  check((html.match(/class="hero-cta"/g) || []).length === 5 && !/cta-option-/.test(html), 'html: expected one CTA in each full hero option');
  check(!/hero-concepts-stage|hero-concept-preview/.test(html), 'html: old miniature hero comparison remains');
  check(!/hero-option-id|Вариант 0[1-5]/.test(html), 'html: temporary hero option labels remain');
  check(/data-hero-blur-input/.test(html) && /type="range"/.test(html) && /data-hero-blur-output/.test(html), 'html: hero background blur control is missing');
  check(!/simple-liquid-glass|liquid-web/.test(html), 'html: rejected liquid button libraries are still present');
  check(/class="talent-stage voice-categories-stage"/.test(html), 'html: voice category component scope is missing');
  check(!/data-cinema|data-story-frame|data-shader-canvas/.test(html), 'html: retired cinematic scene hooks are still present');
  check(!/class="voice-stage/.test(html), 'html: legacy voice card section is still present');
  check(!/class="ai-stage/.test(html), 'html: legacy AI list section is still present');
  check(/data-audio-src/.test(html), 'html: audio controls are missing');
  check((html.match(/class="voice-concept voice-concept-/g) || []).length === 1, 'html: expected one retained voice design concept');
  check(html.includes('assets/voices/alexey-kolgan-v2.jpg'), 'html: enhanced local Alexey Kolgan portrait is missing');
  check((html.match(/data-scroll-track/g) || []).length === 1 && (html.match(/data-scroll-for=/g) || []).length === 2, 'html: casting controls are incomplete');
  check(/class="ai-voice-lab/.test(html), 'html: AI voice lab is missing');
  check((html.match(/data-ai-picker/g) || []).length === 6, 'html: expected six AI model selectors');
  check((html.match(/assets\/ai-voices\/[a-z]+-enhanced-v[23]\.jpg/g) || []).length >= 6, 'html: enhanced local AI portraits are missing');
  check(html.includes('data-ai-image src="assets/ai-voices/ilya-enhanced-v2.jpg"') && html.includes('data-ai-name>Илья</h3>'), 'html: Ilya must be the default AI model');
  check(/class="ai-toolkit reveal"/.test(html), 'html: full AI tools section is missing');
  check((html.match(/class="ai-tool-card ai-tool-card-/g) || []).length === 6, 'html: expected six featured AI tools');
  check(!/class="ai-tool-links/.test(html), 'html: collapsed AI tool link list remains');
  check(/class="portfolio-reel"/.test(html) && (html.match(/data-project data-project-name=/g) || []).length === 3, 'html: editorial portfolio reel is missing');
  check(/class="calculator-summary"/.test(html) && /aria-live="polite"/.test(html), 'html: calculator estimate summary is missing');
  check(/class="service-index/.test(html), 'html: crawlable service index is missing');
  check((html.match(/class="voice-directory-links"[\s\S]*?<\/div>/)?.[0].match(/<a href=/g) || []).length === 19, 'html: expected 19 crawlable featured voice links');
  check((html.match(/class="service-index-groups"[\s\S]*?<\/nav>/)?.[0].match(/<a href=/g) || []).length >= 19, 'html: service index must expose the live service taxonomy');
  check(/action="mailto:info@kupigolos\.ru"/.test(html), 'html: contact form must have an honest static-site delivery path');
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
  check(css.includes(':focus-visible'), 'css: visible focus styles are missing');
  check(css.includes('.top-stage') && css.includes('.top-hero'), 'css: opening layout styles are missing');
  check(css.includes('.top-stage-backdrop') && css.includes('.site-menu'), 'css: base hero composition or menu panel styles are missing');
  check(!css.includes('assets/1.png') && !css.includes('top-hero-microphone'), 'css: retired atomic hero artwork remains');
  check(!refresh.includes('.font-switcher') && !refresh.includes('data-font="airy"'), 'refresh: obsolete font comparison styles are still present');
  check(refresh.includes('.hero-cta') && !refresh.includes('.cta-option-clear') && !refresh.includes('.cta-option-orbit'), 'refresh: final hero CTA is missing or comparison styles remain');
  check(refresh.includes('.hero-option-director') && refresh.includes('.hero-option-night'), 'refresh: full hero option styles are missing');
  check(!refresh.includes('.hero-concepts-stage') && !refresh.includes('.hero-concept-preview'), 'refresh: old miniature hero comparison styles remain');
  check(refresh.includes('.hero-blur-control') && refresh.includes('--hero-background-blur'), 'refresh: hero blur control styles are missing');
  check(refresh.includes('.studio-rail-console') && refresh.includes('studio-active-signal') && refresh.includes('.studio-rail-progress'), 'refresh: studio signal monitor treatment is missing');
  check(refresh.includes('.casting-row') && !refresh.includes('.featured-layout') && !refresh.includes('.portrait-grid'), 'refresh: retained voice concept is incomplete or rejected portrait concept remains');
  check(refresh.includes('.ai-voice-lab') && refresh.includes('.ai-model-list') && refresh.includes('.ai-player'), 'refresh: AI voice lab treatment is incomplete');
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
  check(js.includes('updateHeroBackgroundBlur') && js.includes('--hero-blur-fill'), 'js: hero blur interaction is missing');
  check(js.includes('HTMLAudioElement'), 'js: audio feature check is missing');
  check(js.includes('function selectPortfolioProject(project)'), 'js: portfolio project controller is missing');
  check(js.includes('function syncHeaderTone()') && js.includes("classList.toggle('on-light'"), 'js: automatic header contrast switching is missing');
  check(js.includes('function setMenu(isOpen)') && js.includes("event.key === 'Escape'"), 'js: navigation panel interaction is missing');
  check(js.includes('function setStudioRailSection(sectionId)') && js.includes('studioRailObserver'), 'js: studio navigation rail controller is missing');
  check(!js.includes('data-featured-picker') && !js.includes('data-featured-play'), 'js: removed featured voice picker remains');
  check(js.includes('data-ai-picker') && js.includes('data-ai-play'), 'js: AI model picker is missing');
  check(js.includes('fitAiModelName') && refresh.includes('--ai-name-size'), 'AI model names are not fitted to their available width');
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
