import { useTranslation } from "react-i18next";
import { Code, ExternalLink } from "lucide-react";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import ProjectCover from "./ProjectCover";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";
import type { ProjectStatus } from "../types";

const statusStyle: Record<ProjectStatus, string> = {
  in_progress: "border-accent/60 bg-accent/10 text-accent",
  deploying: "border-primary/60 bg-primary/10 text-primary",
  personal: "border-border text-muted",
};

export default function Projects() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { projects } = useContent();

  return (
    <Section id="projects" index="03" title={t("projects.title")} tone="mix">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <SpotlightCard
            key={p.slug}
            className={`flex flex-col p-8 ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <ProjectCover
              src={p.cover}
              title={p.title}
              className={`mb-6 ${i === 0 ? "aspect-[16/7]" : "aspect-video"}`}
            />
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-sm text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-mono text-xs ${statusStyle[p.status]}`}
              >
                {t(`projects.status.${p.status}`)}
              </span>
            </div>

            <h3
              className={`font-display font-bold tracking-tight transition-colors group-hover:text-primary ${
                i === 0 ? "text-4xl md:text-5xl" : "text-3xl"
              }`}
            >
              {p.title}
            </h3>
            <p className="mt-2 font-mono text-sm text-accent">{l(p.role)}</p>
            <p className="mt-4 flex-1 text-lg leading-relaxed text-muted">
              {l(p.summary)}
            </p>

            {p.techStack.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {p.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            {(p.demoUrl || p.repoUrl) && (
              <div className="mt-6 flex gap-5">
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm hover:text-primary"
                  >
                    <Code size={14} /> Code
                  </a>
                )}
                {p.demoUrl && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm hover:text-primary"
                  >
                    <ExternalLink size={14} /> Demo
                  </a>
                )}
              </div>
            )}
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
