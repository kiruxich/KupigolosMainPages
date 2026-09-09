import type { Metadata, Viewport } from "next";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/components/projects/project-data";
import "./projects.css";

export const metadata: Metadata = {
  title: "КупиГолос - проекты",
};

export const viewport: Viewport = {
  themeColor: "#f54622",
};

export default function ProjectIndexPage() {
  return (
    <main className="projects-index">
      <h1>Проекты</h1>
      <p>Рабочие страницы для показа.</p>
      <section className="grid" aria-label="Список проектов">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}
