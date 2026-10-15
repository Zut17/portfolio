import { useTranslation } from "react-i18next";
import { Code, ExternalLink } from "lucide-react";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import ProjectCover from "./ProjectCover";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";
import type { ProjectStatus } from "../types";

const statusStyle: Record<ProjectStatus, string> = {
  in_progress: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  deploying: "bg-primary/10 text-primary",
  personal: "bg-foreground/[0.06] text-muted",
};

export default function Projects() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { projects } = useContent();

  return (
    <Section id="projects" index="03" title={t("projects.title")}>
      <div className="grid gap-5">
        {projects.map((project, index) => (
          <SpotlightCard key={project.slug} className="p-5 md:p-6">
            <div className="grid gap-6 md:min-h-[17rem] md:grid-cols-[340px_1fr]">
              <ProjectCover
                src={project.cover}
                title={project.title}
                className="aspect-video min-h-52 md:aspect-auto md:h-full"
              />

              <div className="flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <span className="eyebrow">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyle[project.status]
                    }`}
                  >
                    {t(`projects.status.${project.status}`)}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">
                  {l(project.role)}
                </p>
                <p className="mt-3 flex-1 leading-relaxed text-muted">
                  {l(project.summary)}
                </p>

                {project.techStack.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}

                {(project.demoUrl || project.repoUrl) && (
                  <div className="mt-5 flex gap-5 border-t border-border pt-4">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium hover:text-primary"
                      >
                        <Code size={14} /> Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium hover:text-primary"
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
