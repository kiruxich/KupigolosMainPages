# КупиГолос — страницы проектов

Стек: Next.js 16 (App Router), React 19, strict TypeScript 5, Tailwind CSS 4 и pnpm 10.

```bash
pnpm install
pnpm dev
```

Основные маршруты:

- `/` — карточки проектов;
- `/home` — главная страница КупиГолос;
- `/files/afisha-suppliers.docx` — файл поставщиков Афиши.

Проверки:

```bash
pnpm validate
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm test:visual
```

Исходный CSS подключён через `app/globals.css` как compatibility layer поверх Tailwind, чтобы миграция не меняла существующий дизайн. Отключённый вариант секций сохранён в `styles/figma-sections.css` и `components/home/figma-alternatives.tsx`.
