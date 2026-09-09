const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#site-nav');
const pageHeader = document.querySelector('[data-header]');
const headerTriggers = [...document.querySelectorAll('[data-header-trigger]')];
const headerPanels = [...document.querySelectorAll('[data-header-panel]')];
const headerPopoverTriggers = [...document.querySelectorAll('[data-header-popover-trigger]')];
const headerPopovers = [...document.querySelectorAll('[data-header-popover]')];
const headerUtilityMenu = document.querySelector('[data-header-utility]');
const callbackOpeners = [...document.querySelectorAll('[data-callback-open]')];
const orderOpeners = [...document.querySelectorAll('[data-order-open]')];
const callbackDrawer = document.querySelector('[data-callback-drawer]');
const orderModal = document.querySelector('[data-order-modal]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const siteOverlay = document.querySelector('[data-overlay]');
const drawers = [callbackDrawer, orderModal, mobileMenu].filter(Boolean);
const pointerCanHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const desktopHeader = window.matchMedia('(min-width: 901px)');
let activeHeaderTrigger = null;
let activeHeaderPopover = null;
let activeDrawer = null;
let activeDrawerOpener = null;
let headerCloseTimer = 0;
let popoverCloseTimer = 0;

function closeHeaderPopovers({ restoreFocus = false } = {}) {
  headerPopoverTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  headerPopovers.forEach((popover) => {
    popover.classList.remove('is-open');
    popover.setAttribute('aria-hidden', 'true');
  });
  if (restoreFocus) activeHeaderPopover?.focus();
  activeHeaderPopover = null;
}

function closeUtilityMenu({ restoreFocus = false } = {}) {
  if (!headerUtilityMenu) return;
  headerUtilityMenu.classList.remove('is-open');
  headerUtilityMenu.setAttribute('aria-hidden', 'true');
  if (desktopHeader.matches) navToggle?.setAttribute('aria-expanded', 'false');
  if (restoreFocus) navToggle?.focus();
}

function setHeaderPopover(name, isOpen) {
  window.clearTimeout(popoverCloseTimer);
  closeHeaderPopovers();
  if (!isOpen) return;
  closeHeaderPanels();
  closeUtilityMenu();
  const trigger = headerPopoverTriggers.find((item) => item.dataset.headerPopoverTrigger === name);
  const popover = headerPopovers.find((item) => item.dataset.headerPopover === name);
  if (!trigger || !popover) return;
  activeHeaderPopover = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  popover.classList.add('is-open');
  popover.setAttribute('aria-hidden', 'false');
}

function setUtilityMenu(isOpen) {
  if (!headerUtilityMenu) return;
  closeHeaderPanels();
  closeHeaderPopovers();
  headerUtilityMenu.classList.toggle('is-open', isOpen);
  headerUtilityMenu.setAttribute('aria-hidden', String(!isOpen));
  navToggle?.setAttribute('aria-expanded', String(isOpen));
}

function closeHeaderPanels({ restoreFocus = false } = {}) {
  headerTriggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
  headerPanels.forEach((panel) => {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  });
  if (restoreFocus) activeHeaderTrigger?.focus();
  activeHeaderTrigger = null;
}

function openHeaderPanel(panelName) {
  const trigger = headerTriggers.find((item) => item.dataset.headerTrigger === panelName);
  const panel = headerPanels.find((item) => item.dataset.headerPanel === panelName);
  closeHeaderPanels();
  closeHeaderPopovers();
  closeUtilityMenu();
  if (!trigger || !panel) return;
  activeHeaderTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
}

function syncOverlayState() {
  const isOpen = Boolean(activeDrawer);
  siteOverlay?.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('overlay-open', isOpen);
}

function setDrawer(drawer, isOpen, trigger = null, { restoreFocus = false } = {}) {
  if (!drawer) return;

  if (isOpen) {
    closeHeaderPanels();
    closeHeaderPopovers();
    closeUtilityMenu();
    drawers.forEach((item) => {
      item.classList.remove('is-open');
      item.setAttribute('aria-hidden', 'true');
    });
    callbackOpeners.forEach((item) => item.setAttribute('aria-expanded', String(drawer === callbackDrawer)));
    orderOpeners.forEach((item) => item.setAttribute('aria-expanded', String(drawer === orderModal)));
    navToggle?.setAttribute('aria-expanded', String(drawer === mobileMenu));
    activeDrawer = drawer;
    activeDrawerOpener = trigger?.closest('[data-mobile-menu]') ? navToggle : trigger;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    syncOverlayState();
    requestAnimationFrame(() => drawer.querySelector('[data-drawer-close]')?.focus());
    return;
  }

  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  callbackOpeners.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  orderOpeners.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  navToggle?.setAttribute('aria-expanded', 'false');
  const focusTarget = activeDrawerOpener;
  if (activeDrawer === drawer) {
    activeDrawer = null;
    activeDrawerOpener = null;
  }
  syncOverlayState();
  if (restoreFocus) focusTarget?.focus();
}

headerTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    if (isOpen && !pointerCanHover.matches) closeHeaderPanels({ restoreFocus: true });
    else openHeaderPanel(trigger.dataset.headerTrigger);
  });
  trigger.addEventListener('mouseenter', () => {
    window.clearTimeout(headerCloseTimer);
    if (pointerCanHover.matches) openHeaderPanel(trigger.dataset.headerTrigger);
  });
});

function scheduleHeaderClose() {
  window.clearTimeout(headerCloseTimer);
  headerCloseTimer = window.setTimeout(() => closeHeaderPanels(), 130);
}

pageHeader?.addEventListener('mouseleave', () => {
  if (pointerCanHover.matches && activeHeaderTrigger) scheduleHeaderClose();
});

const headerMegaLayer = document.querySelector('.header-mega-layer');
headerMegaLayer?.addEventListener('mouseenter', () => window.clearTimeout(headerCloseTimer));
headerMegaLayer?.addEventListener('mouseleave', () => {
  if (pointerCanHover.matches) scheduleHeaderClose();
});

headerPopoverTriggers.forEach((trigger) => {
  const wrapper = trigger.closest('.header-popover');
  trigger.addEventListener('click', (event) => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    if (pointerCanHover.matches && event.detail > 0) {
      if (!isOpen) setHeaderPopover(trigger.dataset.headerPopoverTrigger, true);
      return;
    }
    setHeaderPopover(trigger.dataset.headerPopoverTrigger, !isOpen);
  });
  wrapper?.addEventListener('mouseenter', () => {
    window.clearTimeout(popoverCloseTimer);
    if (pointerCanHover.matches) setHeaderPopover(trigger.dataset.headerPopoverTrigger, true);
  });
  wrapper?.addEventListener('mouseleave', () => {
    if (!pointerCanHover.matches) return;
    window.clearTimeout(popoverCloseTimer);
    popoverCloseTimer = window.setTimeout(() => closeHeaderPopovers(), 130);
  });
});

headerPanels.forEach((panel) => panel.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeHeaderPanels();
}));

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeHeaderPanels();
});

navToggle?.addEventListener('click', () => {
  const shouldOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  if (desktopHeader.matches) setUtilityMenu(shouldOpen);
  else setDrawer(mobileMenu, shouldOpen, navToggle, { restoreFocus: true });
});

callbackOpeners.forEach((trigger) => trigger.addEventListener('click', () => {
  setDrawer(callbackDrawer, true, trigger);
}));

orderOpeners.forEach((trigger) => trigger.addEventListener('click', () => {
  setDrawer(orderModal, true, trigger);
}));

document.querySelectorAll('[data-drawer-close]').forEach((button) => {
  button.addEventListener('click', () => setDrawer(button.closest('aside'), false, null, { restoreFocus: true }));
});

drawers.forEach((drawer) => drawer.addEventListener('click', (event) => {
  if (event.target.closest('a')) setDrawer(drawer, false);
}));

siteOverlay?.addEventListener('click', () => {
  if (activeDrawer) setDrawer(activeDrawer, false, null, { restoreFocus: true });
});

document.addEventListener('click', (event) => {
  if (activeHeaderTrigger && !event.target.closest('[data-header-trigger], [data-header-panel]')) closeHeaderPanels();
  if (activeHeaderPopover && !event.target.closest('.header-popover')) closeHeaderPopovers();
  if (headerUtilityMenu?.classList.contains('is-open') && !event.target.closest('[data-header-utility], .nav-toggle')) closeUtilityMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (activeDrawer) setDrawer(activeDrawer, false, null, { restoreFocus: true });
    else if (activeHeaderTrigger) closeHeaderPanels({ restoreFocus: true });
    else if (activeHeaderPopover) closeHeaderPopovers({ restoreFocus: true });
    else if (headerUtilityMenu?.classList.contains('is-open')) closeUtilityMenu({ restoreFocus: true });
  }
});

function syncNavToggleTarget() {
  navToggle?.setAttribute('aria-controls', desktopHeader.matches ? 'header-utility-menu' : 'mobile-menu');
  closeUtilityMenu();
}

desktopHeader.addEventListener('change', syncNavToggleTarget);
syncNavToggleTarget();

function syncHeaderTone() {
  if (!pageHeader) return;
  const sampleY = Math.min(window.innerHeight - 1, (pageHeader.offsetHeight || 82) + 1);
  const surface = document.elementFromPoint(window.innerWidth / 2, sampleY)
    ?.closest?.('main > section, .site-footer');
  const isDark = surface?.matches('.site-footer');
  pageHeader.classList.toggle('on-light', Boolean(surface) && !isDark);
}

const headerObserver = new IntersectionObserver(syncHeaderTone, { threshold: [0, 1] });
document.querySelectorAll('main > section, .site-footer').forEach((section) => headerObserver.observe(section));
window.addEventListener('resize', syncHeaderTone, { passive: true });
syncHeaderTone();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const supportsAudio = 'HTMLAudioElement' in window;
const audio = new Audio();
audio.preload = 'none';
const audioToast = document.querySelector('[data-audio-toast]');
const audioName = document.querySelector('[data-audio-name]');
const audioStop = document.querySelector('[data-audio-stop]');
let activeAudioButton = null;

function syncVoiceWaveform(button) {
  const waveform = button?.closest('.figma-voice-card')?.querySelector('.voice-waveform');
  if (!waveform) return;
  const duration = Number.isFinite(audio.duration) ? audio.duration : Number(waveform.dataset.duration);
  const progress = duration > 0 ? Math.min(100, (audio.currentTime / duration) * 100) : 0;
  waveform.style.setProperty('--voice-progress', `${progress}%`);
  waveform.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(Math.round(progress)));
  const elapsed = Math.floor(audio.currentTime || 0);
  waveform.querySelector('[data-voice-elapsed]').textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
}

function resetAudioUI() {
  syncVoiceWaveform(activeAudioButton);
  document.querySelectorAll('[data-audio-src]').forEach((button) => {
    button.classList.remove('is-playing');
    button.setAttribute('aria-pressed', 'false');
    button.style.removeProperty('--audio-progress');
  });
  audioToast?.classList.remove('is-visible');
  document.body.classList.remove('is-audio-playing');
  activeAudioButton = null;
}

async function toggleAudio(button) {
  const source = button.dataset.audioSrc;
  if (activeAudioButton === button && !audio.paused) {
    audio.pause();
    resetAudioUI();
    return;
  }

  audio.pause();
  resetAudioUI();
  activeAudioButton = button;
  button.classList.add('is-playing');
  button.setAttribute('aria-pressed', 'true');
  document.body.classList.add('is-audio-playing');
  if (audio.src !== new URL(source, document.baseURI).href) audio.src = source;
  syncVoiceWaveform(button);
  if (audioName) audioName.textContent = button.dataset.audioLabel || 'Демо';
  audioToast?.classList.add('is-visible');

  try {
    await audio.play();
  } catch {
    resetAudioUI();
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-audio-src]');
  if (button) toggleAudio(button);
});
document.addEventListener('voice-deck-change', (event) => {
  if (!activeAudioButton || !event.target.contains(activeAudioButton)) return;
  audio.pause();
  audio.currentTime = 0;
  syncVoiceWaveform(activeAudioButton);
  resetAudioUI();
});
audio.addEventListener('timeupdate', () => {
  syncVoiceWaveform(activeAudioButton);
  if (!activeAudioButton || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  activeAudioButton.style.setProperty('--audio-progress', `${(audio.currentTime / audio.duration) * 100}%`);
});
audio.addEventListener('ended', resetAudioUI);
audio.addEventListener('error', resetAudioUI);
audioStop?.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  resetAudioUI();
});

const studioRailLinks = [...document.querySelectorAll('[data-rail-target]')];
const studioRail = document.querySelector('[data-studio-rail]');
const studioRailProgress = document.querySelector('[data-rail-progress]');
const studioRailCurrent = document.querySelector('[data-rail-current]');
const studioRailSections = studioRailLinks
  .map((link) => document.getElementById(link.dataset.railTarget))
  .filter(Boolean);

function setStudioRailSection(sectionId) {
  const activeIndex = studioRailLinks.findIndex((link) => link.dataset.railTarget === sectionId);
  if (activeIndex < 0) return;
  studioRailLinks.forEach((link, index) => {
    const active = index === activeIndex;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (studioRailCurrent) studioRailCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
}

let studioRailSectionAnchors = [];
let studioRailProgressFrame = 0;

function cacheStudioRailSectionAnchors() {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  studioRailSectionAnchors = studioRailSections.map((section) => {
    const scrollOffset = Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const sectionY = section.getBoundingClientRect().top + window.scrollY - scrollOffset;
    return Math.min(maxScroll, Math.max(0, sectionY));
  });
}

function updateStudioRailProgress() {
  studioRailProgressFrame = 0;
  if (!studioRailProgress || studioRailSections.length < 2) return;
  if (studioRailSectionAnchors.length !== studioRailSections.length) cacheStudioRailSectionAnchors();

  const progress = window.KupiMotion?.calculateSectionProgress(window.scrollY, studioRailSectionAnchors) ?? 0;
  if (window.KupiMotion?.renderRailProgress) window.KupiMotion.renderRailProgress(studioRailProgress, progress);
  else {
    const hiddenPercent = Number(((1 - progress) * 100).toFixed(4));
    studioRailProgress.style.clipPath = `inset(0 0 ${hiddenPercent}% 0)`;
  }
}

function scheduleStudioRailProgress({ recalculate = false } = {}) {
  if (recalculate) studioRailSectionAnchors = [];
  if (!studioRailProgressFrame) studioRailProgressFrame = requestAnimationFrame(updateStudioRailProgress);
}

let studioRailScrollTarget = '';

function scrollStudioRailTo(target) {
  studioRailScrollTarget = target.id;
  target.scrollIntoView({
    behavior: reducedMotion.matches ? 'auto' : 'smooth',
    block: 'start'
  });
  studioRailScrollTarget = '';
  setStudioRailSection(target.id);
}

studioRailLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.getElementById(link.dataset.railTarget);
    if (!target) return;
    event.preventDefault();
    scrollStudioRailTo(target);
    history.replaceState(null, '', `#${target.id}`);
  });
});

if ('IntersectionObserver' in window && studioRailSections.length) {
  const studioRailObserver = new IntersectionObserver((entries) => {
    if (studioRailScrollTarget) return;
    const activeEntry = entries.find((entry) => entry.isIntersecting);
    if (activeEntry) setStudioRailSection(activeEntry.target.id);
  }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
  studioRailSections.forEach((section) => studioRailObserver.observe(section));
  setStudioRailSection(studioRailSections[0].id);
}

if (studioRailProgress && studioRailSections.length > 1) {
  window.KupiMotion?.configureScrollPerformance?.({
    rail: studioRail,
    progress: studioRailProgress,
    lazyImages: document.querySelectorAll('img[loading="lazy"]')
  });
  scheduleStudioRailProgress({ recalculate: true });
  window.addEventListener('scroll', () => scheduleStudioRailProgress(), { passive: true });
  window.addEventListener('resize', () => scheduleStudioRailProgress({ recalculate: true }), { passive: true });
  window.addEventListener('load', () => scheduleStudioRailProgress({ recalculate: true }), { once: true });
}

const voiceScrollTracks = [...document.querySelectorAll('[data-scroll-track]')];

function voiceScrollAxis(track) {
  return track.scrollWidth > track.clientWidth + 2 ? 'x' : 'y';
}

function syncVoiceScroll(track) {
  const axis = voiceScrollAxis(track);
  const position = axis === 'x' ? track.scrollLeft : track.scrollTop;
  const viewport = axis === 'x' ? track.clientWidth : track.clientHeight;
  const total = axis === 'x' ? track.scrollWidth : track.scrollHeight;
  const max = Math.max(0, total - viewport);
  const pages = Math.max(1, Math.ceil(total / Math.max(1, viewport)));
  const current = max <= 2 ? 1 : Math.min(pages, Math.round((position / max) * (pages - 1)) + 1);
  const status = document.querySelector(`[data-scroll-status-for="${track.id}"]`);
  const cue = document.querySelector(`[data-scroll-cue-for="${track.id}"]`);
  const previous = document.querySelector(`[data-scroll-for="${track.id}"][data-scroll-direction="-1"]`);
  const next = document.querySelector(`[data-scroll-for="${track.id}"][data-scroll-direction="1"]`);

  if (status) status.textContent = `${current} / ${pages}`;
  if (cue && max <= 2) cue.classList.add('is-dismissed');
  if (cue && position > 8) cue.classList.add('is-dismissed');
  if (previous) previous.disabled = position <= 2;
  if (next) next.disabled = position >= max - 2;
}

voiceScrollTracks.forEach((track) => {
  track.addEventListener('scroll', () => syncVoiceScroll(track), { passive: true });
  syncVoiceScroll(track);
});

document.querySelectorAll('[data-scroll-for]').forEach((control) => {
  control.addEventListener('click', () => {
    const track = document.getElementById(control.dataset.scrollFor);
    if (!track) return;
    const axis = voiceScrollAxis(track);
    const direction = Number(control.dataset.scrollDirection);
    const distance = (axis === 'x' ? track.clientWidth : track.clientHeight) * .92 * direction;
    track.scrollBy({
      left: axis === 'x' ? distance : 0,
      top: axis === 'y' ? distance : 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    });
  });
});

window.addEventListener('resize', () => voiceScrollTracks.forEach(syncVoiceScroll));

// Names, roles and demos: kupigolos.ru; advertising rates verified in each profile on 2026-09-08.
const voiceSlides = [
  { name: 'Сергей Набиев', role: 'телеканала Матч ТВ', audio: 'https://storage.kupigolos.ru/audio/demo/5d25e43d9f7a4.mp3', image: 'https://img.kupigolos.ru/voice/61a461e1de9cd.jpg?p=v&s=3fbcf7e49f147e530b81740014f7b24e', href: 'https://kupigolos.ru/diktory/nabiev-sergej', price: 'Реклама от 20 000 ₽' },
  { name: 'Алексей Колган', role: 'Шрека', audio: 'https://storage.kupigolos.ru/audio/demo/58986e384c0f0.mp3', image: 'assets/voices/alexey-kolgan-v2.jpg', href: 'https://kupigolos.ru/diktory/kolgan-aleksej', price: 'Цена договорная' },
  { name: 'Елена Соловьёва', role: 'телеканала Домашний', audio: 'https://storage.kupigolos.ru/audio/demo/5f68ce5485d99.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f6e512c0d.jpeg?p=v&s=f244e003b3a897c0ead731679fbb4d4a', href: 'https://kupigolos.ru/diktory/soloveva-elena', price: 'Реклама от 20 000 ₽' },
  { name: 'Александр Головчанский', role: 'Шерлока Холмса', audio: 'https://storage.kupigolos.ru/audio/demo/58c157649caee.mp3', image: 'https://img.kupigolos.ru/voice/61a3c8f91b460.jpg?p=v&s=2f50143fd1e19489787236a415e155c6', href: 'https://kupigolos.ru/diktory/golovchanskij-aleksandr', price: 'Реклама от 20 000 ₽' },
  { name: 'Ольга Плетнёва', role: 'Умы Турман', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d0682f142.mp3', image: 'https://img.kupigolos.ru/voice/5e80e73203a16.jpg?p=v&s=6f8b49e7b80d9850d948c54a43d35446', href: 'https://kupigolos.ru/diktory/pletneva-olga', price: 'Цена договорная' },
  { name: 'Владимир Ерёмин', role: 'Аль Пачино', audio: 'https://storage.kupigolos.ru/audio/demo/5f68ccd6d0fc4.mp3', image: 'https://img.kupigolos.ru/voice/5ab95307ee237.jpg?p=v&s=58c0d1ec10c31d9a56ea8a201d5bc63a', href: 'https://kupigolos.ru/diktory/eremin-vladimir', price: 'Реклама от 31 000 ₽' },
  { name: 'Пётр Иващенко', role: 'Дэдпула', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d0efd410d.mp3', image: 'https://img.kupigolos.ru/voice/5e80d69a61a3b.jpg?p=v&s=385198074237323c70db657ce3c806fa', href: 'https://kupigolos.ru/diktory/ivashchenko-petr', price: 'Реклама от 18 000 ₽' },
  { name: 'Игорь Старосельцев', role: 'Моргана Фримена', audio: 'https://storage.kupigolos.ru/audio/demo/592d35f316a2e.mp3', image: 'https://img.kupigolos.ru/voice/65e5e2327ec24.jpeg?p=v&s=555624c6649af5f6f6ec28dbdb081fd3', href: 'https://kupigolos.ru/diktory/staroselcev-igor', price: 'Реклама от 14 000 ₽' },
  { name: 'Владимир Зайцев', role: 'Роберта Дауни младшего', audio: 'https://storage.kupigolos.ru/audio/demo/5f68ccf1118e9.mp3', image: 'https://img.kupigolos.ru/voice/5ab7eec080324.jpg?p=v&s=c57bca7a82ee501a56531885a74025a9', href: 'https://kupigolos.ru/diktory/zajcev-vladimir', price: 'Цена договорная' },
  { name: 'Всеволод Полищук', role: 'телеканала ТНТ', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cd4dd0fce.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f4dea8e64.jpg?p=v&s=1f2fc2853a3aa7e2dfbea0be30242a34', href: 'https://kupigolos.ru/diktory/polishchuk-vsevolod', price: 'Реклама от 10 000 ₽' },
  { name: 'Руслан Габидуллин', role: 'студии «Кубик в Кубе»', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d125d82d3.mp3', image: 'https://img.kupigolos.ru/voice/5abaaf329e737.jpg?p=v&s=9a5ed390b68dcc96a6aafc395a2cb931', href: 'https://kupigolos.ru/diktory/gabidullin-ruslan', price: 'Реклама от 50 000 ₽' },
  { name: 'Илья Исаев', role: 'Тома Харди и Майкла Фассбендера', audio: 'https://storage.kupigolos.ru/audio/demo/592d2e96026d5.mp3', image: 'https://img.kupigolos.ru/voice/5aba34090931d.jpg?p=v&s=63d4d22e2593d73e7612e0fb186b5a36', href: 'https://kupigolos.ru/diktory/isaev-ilya', price: 'Реклама от 20 000 ₽' },
  { name: 'Артём Кретов', role: 'телеканала РЕН ТВ', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cbee0977e.mp3', image: 'https://img.kupigolos.ru/voice/5f8e9ded2f683.jpg?p=v&s=b8d4521e18df7875c1bee78ce1ab1eae', href: 'https://kupigolos.ru/diktory/kretov-artem', price: 'Реклама от 14 000 ₽' },
  { name: 'Владимир Антоник', role: 'Сильвестра Сталлоне', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cc74296ef.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f51c5a644.jpg?p=v&s=dc2dec602a793299380b01373ae079b3', href: 'https://kupigolos.ru/diktory/antonik-vladimir', price: 'Реклама от 30 000 ₽' },
  { name: 'Сергей Чонишвили', role: 'телеканала СТС и Вина Дизеля', audio: 'https://storage.kupigolos.ru/audio/demo/5881cd5a01f49.mp3', image: 'https://img.kupigolos.ru/voice/5cf2ffb54368b.jpeg?p=v&s=35f1168c623d6b99834de2b7aa0d7164', href: 'https://kupigolos.ru/diktory/chonishvili-sergej', price: 'Реклама от 16 000 ₽' },
  { name: 'Татьяна Шитова', role: 'Алисы от Яндекса', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d1b1252a6.mp3', image: 'https://img.kupigolos.ru/voice/5bbdea87a8583.jpg?p=v&s=818dc8a6499df88ad1db6f39f2d80f24', href: 'https://kupigolos.ru/diktory/shitova-tatyana', price: 'Цена договорная' },
  { name: 'Юрий Брежнев', role: 'Дуэйна Джонсона', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d1d2e6c93.mp3', image: 'https://img.kupigolos.ru/voice/5ab7eaad3fa32.jpg?p=v&s=45c5ab64052966222d905b15e85e2220', href: 'https://kupigolos.ru/diktory/brezhnev-yurij', price: 'Реклама от 20 000 ₽' },
  { name: 'Алексей Неклюдов', role: 'Первого канала', audio: 'https://storage.kupigolos.ru/audio/demo/5f68c9f442274.mp3', image: 'https://img.kupigolos.ru/voice/5ab8efd6cd064.jpeg?p=v&s=f2891789b450278af99e37def5ce510c', href: 'https://kupigolos.ru/diktory/neklyudov-aleksej', price: 'Цена договорная' },
  { name: 'Борис Репетур', role: '«Галилео»', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cc3a12082.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f4a78a84b.jpg?p=v&s=d633c52ab79603d901693a59ac3822eb', href: 'https://kupigolos.ru/diktory/repetur-boris', price: 'Реклама от 14 000 ₽' },
  { name: 'Станислав Концевич', role: 'Николаса Кейджа и Тома Хэнкса', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d18f728bf.mp3', image: 'https://img.kupigolos.ru/voice/5aba04eae31bb.jpg?p=v&s=989349f8f67bdef18f41c704f8c09e65', href: 'https://kupigolos.ru/diktory/koncevich-stanislav', price: 'Реклама от 3 000 ₽' },
];

const figmaVoiceOrder = ['Алексей Колган', 'Елена Соловьёва', 'Татьяна Шитова', 'Владимир Зайцев', 'Юрий Брежнев', 'Артём Кретов'];
voiceSlides.sort((a, b) => {
  const aIndex = figmaVoiceOrder.indexOf(a.name);
  const bIndex = figmaVoiceOrder.indexOf(b.name);
  return (aIndex < 0 ? figmaVoiceOrder.length : aIndex) - (bIndex < 0 ? figmaVoiceOrder.length : bIndex);
});

window.KupiVoiceCatalog = voiceSlides;

const voiceCarousel = document.querySelector('[data-voice-carousel]');
const voiceImage = document.querySelector('[data-voice-image]');
const voiceName = document.querySelector('[data-voice-name]');
const voiceRole = document.querySelector('[data-voice-role]');
const voiceLink = document.querySelector('[data-voice-link]');
const voicePlay = document.querySelector('[data-voice-play]');
const voiceCurrent = document.querySelector('[data-voice-current]');
const voiceTotal = document.querySelector('[data-voice-total]');
const voicePrevious = document.querySelector('[data-voice-prev]');
const voiceNext = document.querySelector('[data-voice-next]');
let voiceIndex = 0;
let voiceChangeTimer = 0;
let voicePointerStart = null;

function renderVoice() {
  const voice = voiceSlides[voiceIndex];
  if (!voice) return;
  if (voiceImage) {
    voiceImage.src = voice.image;
    voiceImage.alt = `Диктор ${voice.name}`;
  }
  if (voiceName) voiceName.textContent = voice.name;
  if (voiceRole) voiceRole.textContent = `Диктор · голос ${voice.role}`;
  if (voiceLink) voiceLink.href = voice.href;
  if (voicePlay) {
    voicePlay.dataset.audioSrc = voice.audio;
    voicePlay.dataset.audioLabel = voice.name;
    voicePlay.setAttribute('aria-label', `Слушать голос: ${voice.name}`);
  }
  if (voiceCurrent) voiceCurrent.textContent = String(voiceIndex + 1).padStart(2, '0');
  if (voiceTotal) voiceTotal.textContent = String(voiceSlides.length).padStart(2, '0');

  const nextVoice = voiceSlides[(voiceIndex + 1) % voiceSlides.length];
  const nextImage = new Image();
  nextImage.src = nextVoice.image;
}

function showVoice(nextIndex, direction = 1) {
  if (!voiceCarousel || voiceChangeTimer) return;
  const normalizedIndex = (nextIndex + voiceSlides.length) % voiceSlides.length;
  if (normalizedIndex === voiceIndex) return;

  audio.pause();
  audio.currentTime = 0;
  resetAudioUI();
  voiceCarousel.classList.toggle('is-backward', direction < 0);

  const commit = () => {
    voiceIndex = normalizedIndex;
    renderVoice();
    requestAnimationFrame(() => voiceCarousel.classList.remove('is-changing'));
    voiceChangeTimer = 0;
  };

  if (reducedMotion.matches) {
    commit();
    return;
  }

  voiceCarousel.classList.add('is-changing');
  voiceChangeTimer = window.setTimeout(commit, 180);
}

voicePrevious?.addEventListener('click', () => showVoice(voiceIndex - 1, -1));
voiceNext?.addEventListener('click', () => showVoice(voiceIndex + 1, 1));
voiceCarousel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showVoice(voiceIndex - 1, -1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showVoice(voiceIndex + 1, 1);
  }
});
voiceCarousel?.addEventListener('pointerdown', (event) => {
  voicePointerStart = event.clientX;
}, { passive: true });
voiceCarousel?.addEventListener('pointerup', (event) => {
  if (voicePointerStart === null) return;
  const distance = event.clientX - voicePointerStart;
  voicePointerStart = null;
  if (Math.abs(distance) < 44) return;
  showVoice(voiceIndex + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
}, { passive: true });
voiceCarousel?.addEventListener('pointercancel', () => { voicePointerStart = null; });

renderVoice();

const portfolio = document.querySelector('[data-portfolio]');
const portfolioTabs = [...(portfolio?.querySelectorAll('[data-portfolio-tab]') || [])];
const portfolioPanels = [...(portfolio?.querySelectorAll('[data-portfolio-panel]') || [])];
const portfolioMore = portfolio?.querySelector('[data-portfolio-more]');
const portfolioStatus = portfolio?.querySelector('[data-portfolio-status]');
const portfolioBatchSize = 3;
const portfolioVisibleCounts = new Map(portfolioTabs.map((tab) => [tab.dataset.portfolioTab, portfolioBatchSize]));
let activePortfolioCategory = portfolioTabs.find((tab) => tab.classList.contains('is-active'))?.dataset.portfolioTab || 'video';

function renderPortfolio() {
  portfolioTabs.forEach((tab) => {
    const isActive = tab.dataset.portfolioTab === activePortfolioCategory;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  let activeCards = [];
  portfolioPanels.forEach((panel) => {
    const isActive = panel.dataset.portfolioPanel === activePortfolioCategory;
    panel.hidden = !isActive;
    if (isActive) activeCards = [...panel.querySelectorAll('[data-portfolio-card]')];
  });

  const visibleCount = Math.min(portfolioVisibleCounts.get(activePortfolioCategory) || portfolioBatchSize, activeCards.length);
  activeCards.forEach((card, index) => { card.hidden = index >= visibleCount; });
  if (portfolioStatus) portfolioStatus.textContent = `Показано ${visibleCount} из ${activeCards.length}`;
  if (portfolioMore) portfolioMore.hidden = visibleCount >= activeCards.length;
}

function selectPortfolioCategory(category, moveFocus = false) {
  if (!portfolioVisibleCounts.has(category)) return;
  if (activeAudioButton?.closest('[data-portfolio-panel]')) {
    audio.pause();
    resetAudioUI();
  }
  activePortfolioCategory = category;
  renderPortfolio();
  if (moveFocus) portfolioTabs.find((tab) => tab.dataset.portfolioTab === category)?.focus();
}

portfolioTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPortfolioCategory(tab.dataset.portfolioTab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? portfolioTabs.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1);
    nextIndex = (nextIndex + portfolioTabs.length) % portfolioTabs.length;
    selectPortfolioCategory(portfolioTabs[nextIndex].dataset.portfolioTab, true);
  });
});

portfolioMore?.addEventListener('click', () => {
  const current = portfolioVisibleCounts.get(activePortfolioCategory) || portfolioBatchSize;
  portfolioVisibleCounts.set(activePortfolioCategory, current + portfolioBatchSize);
  renderPortfolio();
});

renderPortfolio();

const calculator = document.querySelector('[data-calculator]');
const calculatorTotal = document.querySelector('[data-calculator-total]');
calculator?.addEventListener('change', () => {
  const duration = Number(calculator.querySelector('[name="duration"]:checked')?.value || 0);
  const extras = [...calculator.querySelectorAll('[name="extra"]:checked')]
    .reduce((sum, input) => sum + Number(input.value), 0);
  if (calculatorTotal) calculatorTotal.textContent = `${(duration + extras).toLocaleString('ru-RU')} ₽`;
});

function createHeroShader() {
  const canvas = document.querySelector('[data-shader-canvas]');
  const hero = document.querySelector('[data-hero]');
  if (!canvas || !hero || reducedMotion.matches || !('WebGLRenderingContext' in window)) return;

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uImageSize;
    uniform vec2 uPointer;
    uniform float uScroll;
    uniform float uTime;
    uniform float uTheme;
    varying vec2 vUv;

    vec2 coverUv(vec2 uv) {
      float screenRatio = uResolution.x / uResolution.y;
      float imageRatio = uImageSize.x / uImageSize.y;
      vec2 scale = vec2(1.0);
      if (screenRatio > imageRatio) scale.y = imageRatio / screenRatio;
      else scale.x = screenRatio / imageRatio;
      return (uv - 0.5) * scale + 0.5;
    }

    void main() {
      vec2 uv = coverUv(vUv);
      float edge = smoothstep(0.0, 0.52, vUv.x) * smoothstep(1.0, 0.48, vUv.x);
      float scrollPulse = sin(vUv.y * 13.0 + uScroll * 8.0 + uTime * 0.12);
      float pointerField = 1.0 - smoothstep(0.0, 0.48, distance(vUv, uPointer));
      float strength = (0.0018 + uTheme * 0.0007) * (0.35 + uScroll);
      vec2 drift = vec2(scrollPulse * strength * edge, (uPointer.y - 0.5) * pointerField * 0.0025);
      float split = 0.0012 * uScroll * edge;
      float r = texture2D(uTexture, uv + drift + vec2(split, 0.0)).r;
      float g = texture2D(uTexture, uv + drift).g;
      float b = texture2D(uTexture, uv + drift - vec2(split, 0.0)).b;
      vec3 color = vec3(r, g, b);
      float vignette = smoothstep(0.92, 0.2, distance(vUv, vec2(0.54, 0.5)));
      color *= mix(0.62, 1.03, vignette);
      color *= mix(1.0, 0.88, uScroll * vUv.y);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch {
    return;
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'uResolution'),
    imageSize: gl.getUniformLocation(program, 'uImageSize'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    scroll: gl.getUniformLocation(program, 'uScroll'),
    time: gl.getUniformLocation(program, 'uTime'),
    theme: gl.getUniformLocation(program, 'uTheme'),
  };

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let imageSize = [1536, 1024];
  let pointer = [0.68, 0.5];
  let targetPointer = [...pointer];
  let pointerSurface = [1, 1];
  let previousShaderTime = 0;

  function loadTexture(theme) {
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imageSize = [image.naturalWidth, image.naturalHeight];
      canvas.classList.add('is-ready');
      cinemaMotion.invalidate();
    };
    image.src = theme.image;
  }

  function resize() {
    const clientWidth = Math.max(1, canvas.clientWidth);
    const clientHeight = Math.max(1, canvas.clientHeight);
    const compactViewport = window.innerWidth <= 820;
    const limitedCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const densityLimit = compactViewport || limitedCpu ? 1 : 1.25;
    const density = Math.min(window.devicePixelRatio || 1, densityLimit);
    const width = Math.round(clientWidth * density);
    const height = Math.round(clientHeight * density);
    pointerSurface = [clientWidth, clientHeight];
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  hero.addEventListener('pointermove', (event) => {
    targetPointer = [event.clientX / pointerSurface[0], 1 - event.clientY / pointerSurface[1]];
    cinemaMotion.invalidate();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetPointer = [0.68, 0.5];
    cinemaMotion.invalidate();
  }, { passive: true });
  window.addEventListener('resize', () => {
    resize();
    cinemaMotion.invalidate();
  }, { passive: true });

  resize();
  loadTexture(activeHero);
  const startedAt = performance.now();
  renderHeroShader = (now) => {
    const elapsed = previousShaderTime ? Math.min(64, Math.max(1, now - previousShaderTime)) : 1000 / 60;
    previousShaderTime = now;
    const pointerBlend = 1 - Math.exp(-11 * elapsed / 1000);
    const pointerDeltaX = targetPointer[0] - pointer[0];
    const pointerDeltaY = targetPointer[1] - pointer[1];
    pointer[0] += pointerDeltaX * pointerBlend;
    pointer[1] += pointerDeltaY * pointerBlend;
    const heroProgress = cinemaProgress;

    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.imageSize, imageSize[0], imageSize[1]);
    gl.uniform2f(uniforms.pointer, pointer[0], pointer[1]);
    gl.uniform1f(uniforms.scroll, heroProgress);
    gl.uniform1f(uniforms.time, (now - startedAt) / 1000);
    gl.uniform1f(uniforms.theme, 2);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return Math.abs(pointerDeltaX) + Math.abs(pointerDeltaY) > 0.0002;
  };
}

createHeroShader();
