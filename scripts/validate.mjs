import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const paths = {
  html: resolve(root, 'index.html'),
  css: resolve(root, 'styles.css'),
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
  check(/<html lang="ru" data-theme="script">/.test(html), 'html: script direction must be the only active theme');
  check(!/data-theme-option=/.test(html), 'html: obsolete theme switcher is still present');
  check(!/class="theme-dock"/.test(html), 'html: obsolete theme dock is still present');
  check(!/class="marquee"/.test(html), 'html: decorative marquee is still present');
  check(/rel="preload" href="assets\/hero-script\.jpg"/.test(html), 'html: script hero must be preloaded');
  check(/data-shader-canvas/.test(html), 'html: shader canvas hook is missing');
  check(/data-cinema/.test(html), 'html: cinematic scroll scene is missing');
  check((html.match(/data-story-frame=/g) || []).length === 4, 'html: expected four cinematic story frames');
  check(/data-story-progress/.test(html), 'html: story progress control is missing');
  check(!/class="voice-stage/.test(html), 'html: legacy voice card section is still present');
  check(!/class="ai-stage/.test(html), 'html: legacy AI list section is still present');
  check(/data-audio-src/.test(html), 'html: audio controls are missing');
  check(/data-voice-carousel/.test(html), 'html: featured voice carousel is missing');
  check(/aria-roledescription="слайдер"/.test(html), 'html: carousel semantics are missing');
  check(/data-voice-prev/.test(html) && /data-voice-next/.test(html), 'html: carousel navigation is missing');
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
  check(css.includes('.cinema-sticky'), 'css: sticky cinematic viewport is missing');
  check(css.includes('.story-glass'), 'css: optical glass surface is missing');
  check(/\.story-metrics \.hero-index \{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s.test(css), 'css: metrics frame must use a horizontal three-column layout');
  check(/\.story-metrics \.hero-index strong \{[^}]*white-space:\s*nowrap/s.test(css), 'css: metric values must not wrap');
  check(/\.story-ai \.ai-row:is\(:hover,\s*:focus-visible\) \{[^}]*background:\s*transparent/s.test(css), 'css: AI service hover must keep a transparent background');
  check(/\.story-ai \.ai-row:is\(:hover,\s*:focus-visible\)::after \{[^}]*transform:\s*scaleX\(1\)/s.test(css), 'css: AI service hover accent line is missing');
  check(/\.site-header \.header-project\.button \{[^}]*color:\s*white/s.test(css), 'css: header project link must be visible before hover');
  check(/\.service-item a:is\(:hover,\s*:focus-visible\) \{[^}]*transform:\s*translateX\(8px\)/s.test(css), 'css: coral service links must shift right on interaction');
  check(!css.includes('transition: color .22s, padding-left .22s'), 'css: link interactions must avoid layout-triggering padding animation');
  check(/\.portfolio-reel \{[^}]*grid-template-columns:/s.test(css), 'css: editorial portfolio layout is missing');
  check(/\.calculator-choice \{[^}]*grid-template-columns:/s.test(css), 'css: calculator option rows are missing');
  check(/\.site-header\.on-light \{[^}]*color:\s*var\(--ink\)/s.test(css), 'css: light-surface header contrast state is missing');
  check(/\.site-nav \{[^}]*font-size:\s*\.92rem[^}]*font-weight:\s*600/s.test(css), 'css: header navigation type must remain legible');

  check(!js.includes('localStorage'), 'js: obsolete theme persistence is still present');
  check(!js.includes('themechange'), 'js: obsolete theme switching is still present');
  check(!js.includes("event.preventDefault();\n  const button = event.currentTarget.querySelector('button[type=\"submit\"]')"), 'js: fake contact submission handler is still present');
  check(js.includes('IntersectionObserver'), 'js: reveal observer is missing');
  check(js.includes('requestAnimationFrame'), 'js: animation loop is missing');
  check(js.includes('data-story-frame'), 'js: story frame controller is missing');
  check(js.includes('const isHidden = !reducedMotion.matches && frameStep !== step'), 'js: reduced-motion story frames must remain exposed to assistive technology');
  check(js.includes('WebGLRenderingContext'), 'js: WebGL capability check is missing');
  check(js.includes('HTMLAudioElement'), 'js: audio feature check is missing');
  check(js.includes("event.key === 'ArrowLeft'") && js.includes("event.key === 'ArrowRight'"), 'js: carousel keyboard navigation is missing');
  check(js.includes("pointerdown") && js.includes("pointerup"), 'js: carousel swipe navigation is missing');
  check(js.includes('function selectPortfolioProject(project)'), 'js: portfolio project controller is missing');
  check(js.includes('function syncHeaderTone()') && js.includes("classList.toggle('on-light'"), 'js: automatic header contrast switching is missing');
}

if (failures.length) {
  console.error(`Validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Validation passed: structure, themes, motion and interaction hooks are present.');
