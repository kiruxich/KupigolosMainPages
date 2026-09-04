const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const createMotionScheduler = window.KupiMotion?.createMotionScheduler;
let cinemaProgress = 0;
const activeHero = { image: 'assets/hero-script.jpg' };
let renderHeroShader = null;

const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#site-nav');

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navToggle?.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
});

const cinema = document.querySelector('[data-cinema]');
const storyFrames = [...document.querySelectorAll('[data-story-frame]')];
const storyJumps = [...document.querySelectorAll('[data-story-jump]')];
const pageHeader = document.querySelector('[data-header]');
let activeStoryStep = -1;
let cinemaStart = 0;
let cinemaRange = 1;
let cinemaEnd = 1;
let lastHeaderScrollY = Number.NaN;
let headerSampleY = 83;

function syncHeaderTone() {
  if (!pageHeader) return;
  const sampleY = Math.min(window.innerHeight - 1, headerSampleY);
  const surface = document.elementFromPoint(window.innerWidth / 2, sampleY)
    ?.closest?.('[data-cinema], main > section, .site-footer');
  const isDark = surface?.matches('[data-cinema], .section-dark, .founder-stage, .contact-stage, .site-footer');
  pageHeader.classList.toggle('on-light', Boolean(surface) && !isDark);
}

function measureCinema() {
  if (cinema) {
    cinemaStart = cinema.offsetTop;
    cinemaRange = Math.max(1, cinema.offsetHeight - window.innerHeight);
    cinemaEnd = cinemaStart + cinema.offsetHeight;
  }
  headerSampleY = (pageHeader?.offsetHeight || 82) + 1;
}

function setStoryStep(step) {
  if (!cinema || step === activeStoryStep) return;
  const previousStep = activeStoryStep;
  activeStoryStep = step;
  cinema.dataset.step = String(step);
  cinema.dataset.direction = previousStep < 0 || step >= previousStep ? 'forward' : 'backward';
  storyFrames.forEach((frame) => {
    const frameStep = Number(frame.dataset.storyFrame);
    const isHidden = !reducedMotion.matches && frameStep !== step;
    frame.dataset.storyState = frameStep === step ? 'active' : frameStep < step ? 'past' : 'future';
    frame.setAttribute('aria-hidden', String(isHidden));
  });
  storyJumps.forEach((button) => {
    if (Number(button.dataset.storyJump) === step) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

reducedMotion.addEventListener?.('change', () => {
  storyFrames.forEach((frame) => frame.setAttribute('aria-hidden', 'false'));
  activeStoryStep = -1;
  requestStoryFrame({ immediate: reducedMotion.matches });
});

storyJumps.forEach((button) => {
  button.addEventListener('click', () => {
    if (!cinema) return;
    const step = Number(button.dataset.storyJump);
    window.scrollTo({
      top: cinemaStart + cinemaRange * (step / Math.max(1, storyFrames.length - 1)),
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
  });
});

function renderStory(progress, now) {
  cinemaProgress = progress;
  if (cinema) {
    cinema.style.setProperty('--cinema-progress', cinemaProgress.toFixed(4));
    const storyPosition = cinemaProgress * storyFrames.length;
    const step = Math.min(storyFrames.length - 1, Math.floor(storyPosition));
    cinema.style.setProperty('--story-local-progress', Math.min(1, storyPosition - step).toFixed(4));
    setStoryStep(Math.max(0, step));
    const cinemaVisible = window.scrollY < cinemaEnd && window.scrollY + window.innerHeight > cinemaStart;
    if (renderHeroShader && cinemaVisible && !reducedMotion.matches) return renderHeroShader(now);
  }
  return false;
}

function syncScrollChrome() {
  if (window.scrollY === lastHeaderScrollY) return;
  lastHeaderScrollY = window.scrollY;
  pageHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
  syncHeaderTone();
}

const cinemaMotion = createMotionScheduler
  ? createMotionScheduler({
      initialValue: 0,
      precision: 0.00008,
      responsiveness: 20,
      render(progress, now) {
        syncScrollChrome();
        return renderStory(progress, now);
      },
    })
  : {
      getValue: () => cinemaProgress,
      invalidate() {
        renderStory(cinemaProgress, performance.now());
        syncScrollChrome();
      },
      isRunning: () => false,
      setTarget(value) {
        renderStory(value, performance.now());
        syncScrollChrome();
      },
    };

function requestStoryFrame({ immediate = false } = {}) {
  if (!cinema) {
    cinemaMotion.invalidate();
    return;
  }
  const progress = Math.min(1, Math.max(0, (window.scrollY - cinemaStart) / cinemaRange));
  cinemaMotion.setTarget(progress, { immediate });
}

measureCinema();
window.addEventListener('scroll', requestStoryFrame, { passive: true });
window.addEventListener('resize', () => {
  measureCinema();
  requestStoryFrame();
}, { passive: true });
if ('ResizeObserver' in window && cinema) new ResizeObserver(measureCinema).observe(cinema);
setStoryStep(0);
requestStoryFrame({ immediate: true });

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
const audioButtons = [...document.querySelectorAll('[data-audio-src]')];
const audioToast = document.querySelector('[data-audio-toast]');
const audioName = document.querySelector('[data-audio-name]');
const audioStop = document.querySelector('[data-audio-stop]');
let activeAudioButton = null;

function resetAudioUI() {
  audioButtons.forEach((button) => button.classList.remove('is-playing'));
  audioToast?.classList.remove('is-visible');
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
  audio.src = source;
  if (audioName) audioName.textContent = button.dataset.audioLabel || 'Демо';
  audioToast?.classList.add('is-visible');

  try {
    await audio.play();
  } catch {
    resetAudioUI();
  }
}

audioButtons.forEach((button) => button.addEventListener('click', () => toggleAudio(button)));
audio.addEventListener('ended', resetAudioUI);
audio.addEventListener('error', resetAudioUI);
audioStop?.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  resetAudioUI();
});

const voiceSlides = [
  { name: 'Сергей Набиев', role: 'телекана Матч ТВ', audio: 'https://storage.kupigolos.ru/audio/demo/5d25e43d9f7a4.mp3', image: 'https://img.kupigolos.ru/voice/61a461e1de9cd.jpg?p=v&s=3fbcf7e49f147e530b81740014f7b24e', href: 'https://kupigolos.ru/diktory/nabiev-sergej' },
  { name: 'Алексей Колган', role: 'Шрека', audio: 'https://storage.kupigolos.ru/audio/demo/58986e384c0f0.mp3', image: 'https://img.kupigolos.ru/voice/5ab7eb7985751.jpg?p=v&s=4f549f56b6f0ccc027da1c736ed7ec1d', href: 'https://kupigolos.ru/diktory/kolgan-aleksej' },
  { name: 'Елена Соловьёва', role: 'телекана Домашний', audio: 'https://storage.kupigolos.ru/audio/demo/5f68ce5485d99.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f6e512c0d.jpeg?p=v&s=f244e003b3a897c0ead731679fbb4d4a', href: 'https://kupigolos.ru/diktory/soloveva-elena' },
  { name: 'Александр Головчанский', role: 'Шерлока Холмса', audio: 'https://storage.kupigolos.ru/audio/demo/58c157649caee.mp3', image: 'https://img.kupigolos.ru/voice/61a3c8f91b460.jpg?p=v&s=2f50143fd1e19489787236a415e155c6', href: 'https://kupigolos.ru/diktory/golovchanskij-aleksandr' },
  { name: 'Ольга Плетнёва', role: 'Умы Турман', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d0682f142.mp3', image: 'https://img.kupigolos.ru/voice/5e80e73203a16.jpg?p=v&s=6f8b49e7b80d9850d948c54a43d35446', href: 'https://kupigolos.ru/diktory/pletneva-olga' },
  { name: 'Владимир Ерёмин', role: 'Аль Пачино', audio: 'https://storage.kupigolos.ru/audio/demo/5f68ccd6d0fc4.mp3', image: 'https://img.kupigolos.ru/voice/5ab95307ee237.jpg?p=v&s=58c0d1ec10c31d9a56ea8a201d5bc63a', href: 'https://kupigolos.ru/diktory/eremin-vladimir' },
  { name: 'Пётр Иващенко', role: 'Дэдпула', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d0efd410d.mp3', image: 'https://img.kupigolos.ru/voice/5e80d69a61a3b.jpg?p=v&s=385198074237323c70db657ce3c806fa', href: 'https://kupigolos.ru/diktory/ivashchenko-petr' },
  { name: 'Игорь Старосельцев', role: 'Моргана Фримена', audio: 'https://storage.kupigolos.ru/audio/demo/592d35f316a2e.mp3', image: 'https://img.kupigolos.ru/voice/65e5e2327ec24.jpeg?p=v&s=555624c6649af5f6f6ec28dbdb081fd3', href: 'https://kupigolos.ru/diktory/staroselcev-igor' },
  { name: 'Владимир Зайцев', role: 'Роберта Дауни младшего', audio: 'https://storage.kupigolos.ru/audio/demo/5f68ccf1118e9.mp3', image: 'https://img.kupigolos.ru/voice/5ab7eec080324.jpg?p=v&s=c57bca7a82ee501a56531885a74025a9', href: 'https://kupigolos.ru/diktory/zajcev-vladimir' },
  { name: 'Всеволод Полищук', role: 'телеканала ТНТ', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cd4dd0fce.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f4dea8e64.jpg?p=v&s=1f2fc2853a3aa7e2dfbea0be30242a34', href: 'https://kupigolos.ru/diktory/polishchuk-vsevolod' },
  { name: 'Руслан Габидуллин', role: 'студии «Кубик в Кубе»', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d125d82d3.mp3', image: 'https://img.kupigolos.ru/voice/5abaaf329e737.jpg?p=v&s=9a5ed390b68dcc96a6aafc395a2cb931', href: 'https://kupigolos.ru/diktory/gabidullin-ruslan' },
  { name: 'Илья Исаев', role: 'Тома Харди и Майкла Фассбендера', audio: 'https://storage.kupigolos.ru/audio/demo/592d2e96026d5.mp3', image: 'https://img.kupigolos.ru/voice/5aba34090931d.jpg?p=v&s=63d4d22e2593d73e7612e0fb186b5a36', href: 'https://kupigolos.ru/diktory/isaev-ilya' },
  { name: 'Артём Кретов', role: 'телеканала РЕН ТВ', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cbee0977e.mp3', image: 'https://img.kupigolos.ru/voice/5f8e9ded2f683.jpg?p=v&s=b8d4521e18df7875c1bee78ce1ab1eae', href: 'https://kupigolos.ru/diktory/kretov-artem' },
  { name: 'Владимир Антоник', role: 'Сильвестра Сталлоне', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cc74296ef.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f51c5a644.jpg?p=v&s=dc2dec602a793299380b01373ae079b3', href: 'https://kupigolos.ru/diktory/antonik-vladimir' },
  { name: 'Сергей Чонишвили', role: 'телеканала СТС и Вина Дизеля', audio: 'https://storage.kupigolos.ru/audio/demo/5881cd5a01f49.mp3', image: 'https://img.kupigolos.ru/voice/5cf2ffb54368b.jpeg?p=v&s=35f1168c623d6b99834de2b7aa0d7164', href: 'https://kupigolos.ru/diktory/chonishvili-sergej' },
  { name: 'Татьяна Шитова', role: 'Алисы от Яндекса', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d1b1252a6.mp3', image: 'https://img.kupigolos.ru/voice/5bbdea87a8583.jpg?p=v&s=818dc8a6499df88ad1db6f39f2d80f24', href: 'https://kupigolos.ru/diktory/shitova-tatyana' },
  { name: 'Юрий Брежнев', role: 'Дуэйна Джонсона', audio: 'https://storage.kupigolos.ru/audio/demo/5f68d1d2e6c93.mp3', image: 'https://img.kupigolos.ru/voice/5ab7eaad3fa32.jpg?p=v&s=45c5ab64052966222d905b15e85e2220', href: 'https://kupigolos.ru/diktory/brezhnev-yurij' },
  { name: 'Алексей Неклюдов', role: 'Первого канала', audio: 'https://storage.kupigolos.ru/audio/demo/5f68c9f442274.mp3', image: 'https://img.kupigolos.ru/voice/5ab8efd6cd064.jpeg?p=v&s=f2891789b450278af99e37def5ce510c', href: 'https://kupigolos.ru/diktory/neklyudov-aleksej' },
  { name: 'Борис Репетур', role: '«Галилео»', audio: 'https://storage.kupigolos.ru/audio/demo/5f68cc3a12082.mp3', image: 'https://img.kupigolos.ru/voice/5ab8f4a78a84b.jpg?p=v&s=d633c52ab79603d901693a59ac3822eb', href: 'https://kupigolos.ru/diktory/repetur-boris' },
];

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

const portfolioScreen = document.querySelector('.portfolio-screen');
const portfolioImage = document.querySelector('[data-project-image]');
const portfolioName = document.querySelector('[data-project-name]:not([data-project])');
const portfolioType = document.querySelector('[data-project-type]:not([data-project])');
const portfolioFrame = document.querySelector('[data-project-frame]:not([data-project])');
const portfolioProjects = [...document.querySelectorAll('[data-project]')];
let portfolioChangeTimer = 0;

function selectPortfolioProject(project) {
  if (!portfolioScreen || !portfolioImage || project.classList.contains('is-active')) return;

  window.clearTimeout(portfolioChangeTimer);
  portfolioProjects.forEach((item) => {
    const isActive = item === project;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });

  const commit = () => {
    portfolioImage.src = project.dataset.projectImage;
    portfolioImage.alt = project.dataset.projectAlt;
    if (portfolioName) portfolioName.textContent = project.dataset.projectName;
    if (portfolioType) portfolioType.textContent = project.dataset.projectType;
    if (portfolioFrame) portfolioFrame.textContent = project.dataset.projectFrame;
    portfolioScreen.classList.remove('is-changing');
    portfolioChangeTimer = 0;
  };

  if (reducedMotion.matches) {
    commit();
    return;
  }

  portfolioScreen.classList.add('is-changing');
  portfolioChangeTimer = window.setTimeout(commit, 170);
}

portfolioProjects.forEach((project) => {
  project.addEventListener('pointerenter', () => selectPortfolioProject(project));
  project.addEventListener('focus', () => selectPortfolioProject(project));
  project.addEventListener('click', () => selectPortfolioProject(project));

  const preview = new Image();
  preview.src = project.dataset.projectImage;
});

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
