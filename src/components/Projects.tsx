import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Code, ExternalLink } from "lucide-react";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import ProjectCover from "./ProjectCover";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";
import { isHttpUrl } from "../lib/links";
import { PROJECT_CATEGORIES, type ProjectCategory, type ProjectStatus } from "../types";

const statusStyle: Record<ProjectStatus, string> = {
  in_progress: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  deploying: "bg-primary/10 text-primary",
  personal: "bg-foreground/[0.06] text-muted",
};

type Filter = "all" | ProjectCategory;

export default function Projects() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { projects } = useContent();
  const [filter, setFilter] = useState<Filter>("all");

  // Seules les catégories réellement utilisées apparaissent dans les filtres.
  const categories = PROJECT_CATEGORIES.map((category) => ({
    category,
    count: projects.filter((project) => project.category === category).length,
  })).filter(({ count }) => count > 0);

  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <Section id="projects" title={t("projects.title")} intro={t("projects.intro")}>
      {categories.length > 1 && (
        <div role="group" aria-label={t("projects.filter")} className="mb-8 flex flex-wrap gap-2">
          {[{ category: "all" as Filter, count: projects.length }, ...categories].map(({ category, count }) => {
            const active = filter === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(category)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
                  active
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-border text-muted hover:border-accent/60 hover:text-foreground"
                }`}
              >
                {category === "all" ? t("projects.all") : t(`projects.category.${category}`)}
                <span aria-hidden="true" className="text-xs opacity-70">{count}</span>
                <span className="sr-only">({t("projects.count", { count })})</span>
              </button>
            );
          })}
        </div>
      )}

      <ul className="grid gap-5">
        {visible.map((project) => {
          const repo = isHttpUrl(project.repoUrl) ? project.repoUrl : undefined;
          const demo = isHttpUrl(project.demoUrl) ? project.demoUrl : undefined;
          return (
            <li key={project.slug}>
              <SpotlightCard className="p-5 md:p-6">
                <article className="grid gap-6 md:min-h-[17rem] md:grid-cols-[340px_1fr]">
                  <ProjectCover
                    src={project.cover}
                    title={project.title}
                    alt={t("projects.coverAlt", { title: project.title })}
                    className="aspect-video w-full md:aspect-auto md:h-full md:min-h-52"
                  />

                  <div className="flex flex-col">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="eyebrow">{t(`projects.category.${project.category}`)}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[project.status]}`}>
                        {t(`projects.status.${project.status}`)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                    {l(project.role) && <p className="mt-1 text-sm font-medium text-primary">{l(project.role)}</p>}
                    <p className="mt-3 flex-1 leading-relaxed text-muted">{l(project.summary)}</p>

                    {project.techStack.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <li key={tech} className="chip">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 flex flex-wrap gap-5 border-t border-border pt-4 text-sm font-medium">
                      {demo && (
                        <a href={demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">
                          <ExternalLink size={14} aria-hidden="true" /> {t("projects.demo")}
                          <span className="sr-only"> {project.title} {t("projects.newTab")}</span>
                        </a>
                      )}
                      {repo && (
                        <a href={repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">
                          <Code size={14} aria-hidden="true" /> {t("projects.code")}
                          <span className="sr-only"> {project.title} {t("projects.newTab")}</span>
                        </a>
                      )}
                      {!demo && !repo && <span className="text-muted">{t("projects.soon")}</span>}
                    </div>
                  </div>
                </article>
              </SpotlightCard>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
