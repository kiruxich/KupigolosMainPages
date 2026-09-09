import Link from "next/link";

function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.04em] text-[#273778]">
      <svg className="h-8 w-8 text-[#f24b2b]" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <path d="M4 22h4m4-7v14m5-20v26m6-20v14m6-9v4m6-9v14m5-7h4" />
      </svg>
      <span>купи<span className="text-[#f24b2b]">голос</span></span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-[18px] sm:px-5">
      <div className="mx-auto flex min-h-[60px] max-w-[1320px] items-center gap-4 rounded-2xl border border-white/80 bg-white/90 px-4 shadow-[0_18px_48px_rgba(39,55,120,.14)] backdrop-blur-xl sm:min-h-[72px] sm:px-6">
        <Link href="/" aria-label="КупиГолос, на главную"><Logo /></Link>
        <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold text-[#56618f] lg:flex" aria-label="Основная навигация">
          <Link className="transition-colors hover:text-[#f24b2b]" href="/diktory">Дикторы</Link>
          <Link className="transition-colors hover:text-[#f24b2b]" href="/perevod">Локализация</Link>
          <a className="transition-colors hover:text-[#f24b2b]" href="https://kupigolos.ru/services">Услуги</a>
          <a className="transition-colors hover:text-[#f24b2b]" href="https://kupigolos.ru/ai">ИИ-сервисы</a>
        </nav>
        <a className="ml-auto hidden text-sm font-bold text-[#273778] sm:block lg:ml-4" href="tel:88002004551">8 800 200-45-51</a>
        <a className="rounded-xl bg-[#f24b2b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d94326]" href="#contacts">Обсудить проект</a>
      </div>
    </header>
  );
}

