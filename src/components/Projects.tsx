import { useTranslation } from "react-i18next";
import { ArrowUpRight, Code, ExternalLink } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { projects } from "../data/projects";
import type { ProjectStatus } from "../types";

const statusStyle: Record<ProjectStatus, string> = {
  in_progress: "border-accent text-accent",
  deploying: "border-primary text-primary",
  personal: "border-border text-muted",
};

export default function Projects() {
  const { t } = useTranslation();
  const l = useLocalized();

  return (
    <Section id="projects" index="03" title={t("projects.title")}>
      <div className="border-t border-border">
        {projects.map((p, i) => (
          <article
            key={p.slug}
            className="group grid gap-6 border-b border-border py-12 transition-colors hover:bg-card/60 md:grid-cols-12 md:px-4"
          >
            <span className="font-display text-xl text-accent md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="md:col-span-5">
              <h3 className="font-display text-3xl font-semibold transition-transform duration-300 group-hover:translate-x-2 group-hover:text-primary md:text-4xl">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{l(p.role)}</p>
              <span
                className={`mt-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[p.status]}`}
              >
                {t(`projects.status.${p.status}`)}
              </span>
            </div>

            <div className="md:col-span-6">
              <p className="text-lg leading-relaxed text-muted">
                {l(p.summary)}
              </p>

              {p.techStack.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}

              {(p.demoUrl || p.repoUrl) && (
                <div className="mt-5 flex items-center gap-5">
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
                  <ArrowUpRight
                    size={18}
                    className="ml-auto text-muted transition group-hover:text-accent"
                  />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
