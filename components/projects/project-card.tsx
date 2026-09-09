import Link from "next/link";
import type { ProjectDefinition } from "./project-data";
import { StatusSelect } from "./status-select";

const linkLabels: Readonly<Record<string, string>> = {
  "afisha-suppliers": "Открыть файл Поставщики Афиши",
  ozvychka: "Открыть страницу Озвучка",
  homepage: "Открыть главную страницу",
  "six-pages": "Открыть проект 6 страниц",
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function ProjectCard({ project }: Readonly<{ project: ProjectDefinition }>) {
  const linkProps = {
    className: "card__link",
    href: project.href,
    "aria-label": linkLabels[project.id] ?? `Открыть ${project.title}`,
  };

  return (
    <article className="card">
      {project.external ? <a {...linkProps} target="_blank" rel="noopener" /> : <Link {...linkProps} />}
      <div className="card__top"><span className="card__number">{String(project.order).padStart(2, "0")}</span></div>
      <div className="card__body"><h2>{project.title}</h2><p>{project.description}</p></div>
      <div className="card__footer">
        <time className="card__date" dateTime={project.date}>{formatDate(project.date)}</time>
        <StatusSelect projectId={project.id} defaultStatus={project.defaultStatus} />
      </div>
    </article>
  );
}
