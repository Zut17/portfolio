import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Code, ExternalLink } from "lucide-react";
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
    <Section id="projects" title={t("projects.title")}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <motion.article
            key={p.slug}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <span
              className={`mb-4 w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle[p.status]}`}
            >
              {t(`projects.status.${p.status}`)}
            </span>
            <h3 className="text-xl font-bold">{p.title}</h3>
            <p className="mt-1 text-sm text-accent">{l(p.role)}</p>
            <p className="mt-3 flex-1 text-muted">{l(p.summary)}</p>

            {p.techStack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-background px-2 py-1 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {(p.demoUrl || p.repoUrl) && (
              <div className="mt-4 flex gap-4">
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
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
