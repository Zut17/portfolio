import { useTranslation } from "react-i18next";
import Section from "./Section";
import { skills } from "../data/skills";
import type { SkillCategory } from "../types";

const categories: SkillCategory[] = ["backend", "frontend", "desktop", "tools"];

export default function Skills() {
  const { t } = useTranslation();

  return (
    <Section id="skills" title={t("skills.title")}>
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="mb-4 font-semibold text-primary">
              {t(`skills.categories.${cat}`)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <span
                    key={s.name}
                    className="rounded-full border border-border px-3 py-1 text-sm transition hover:border-accent hover:text-accent"
                  >
                    {s.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
