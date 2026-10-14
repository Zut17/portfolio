import { Globe, Monitor, Server, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import { skills } from "../data/skills";
import type { SkillCategory } from "../types";

const categories: { key: SkillCategory; icon: typeof Server; span: string }[] = [
  { key: "backend", icon: Server, span: "md:col-span-2" },
  { key: "frontend", icon: Globe, span: "md:col-span-1" },
  { key: "desktop", icon: Monitor, span: "md:col-span-1" },
  { key: "tools", icon: Wrench, span: "md:col-span-2" },
];

export default function Skills() {
  const { t } = useTranslation();

  return (
    <Section id="skills" index="02" title={t("skills.title")}>
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map(({ key, icon: Icon, span }) => (
          <SpotlightCard key={key} className={`p-7 ${span}`}>
            <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-[0_0_20px_-4px_var(--color-primary)]">
              <Icon size={20} />
            </span>
            <h3 className="mb-4 font-display text-xl font-semibold">
              {t(`skills.categories.${key}`)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === key)
                .map((s) => (
                  <span
                    key={s.name}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent hover:shadow-[0_0_14px_-2px_var(--color-accent)]"
                  >
                    {s.name}
                  </span>
                ))}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
