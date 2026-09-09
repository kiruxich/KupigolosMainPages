export type ProjectStatus = "in-progress" | "completed" | "deferred";

export interface ProjectDefinition {
  id: string;
  order: number;
  title: string;
  description: string;
  date: string;
  href: string;
  external?: boolean;
  defaultStatus: ProjectStatus;
}

export const projects: readonly ProjectDefinition[] = [
  { id: "afisha-suppliers", order: 1, title: "Поставщики Афиши", description: "Модель подключения билетных поставщиков", date: "2026-09-09", href: "/files/afisha-suppliers.docx", defaultStatus: "completed" },
  { id: "ozvychka", order: 2, title: "Озвучка", description: "Страницы актёров русского дубляжа", date: "2026-09-08", href: "https://kupigolos-ozvychka-g84p.vercel.app", external: true, defaultStatus: "in-progress" },
  { id: "homepage", order: 3, title: "Главная страница", description: "Текущая версия сайта КупиГолос", date: "2026-09-09", href: "/home", defaultStatus: "completed" },
] as const;
