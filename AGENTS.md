<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Любые проверки — только по явному запросу пользователя

Не запускай никакие проверки, пока пользователь явно не попросит их выполнить. Просьба реализовать, исправить или закончить задачу сама по себе не разрешает проверки.

Без отдельного явного запроса запрещены:

- Любые тесты: unit, integration, end-to-end, визуальные и другие.
- Линтеры, проверка типов и проверка форматирования: ESLint, `tsc`, `typecheck`, Prettier check и аналоги.
- Сборка ради проверки, команды `build`, `validate` и диагностические скрипты.
- Проверки через браузер, скриншоты, Playwright, HTTP-запросы (`curl` и аналоги), проверки доступности страниц и ресурсов.
- Самописные проверки, assertions и любые другие способы верификации результата.

Не подменяй запрещённые проверки «быстрой проверкой», «валидацией» или «ручной проверкой». Если пользователь разрешил конкретную проверку, выполняй только её, не расширяя объём самостоятельно.

Чтение файлов для выполнения задачи, внесение изменений и сохранение локального коммита разрешены. В отчёте не утверждай, что результат проверен, если проверки не были явно разрешены и выполнены.
