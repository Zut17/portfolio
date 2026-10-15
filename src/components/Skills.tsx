import { Globe, Monitor, Server, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import { useContent } from "../content/ContentContext";
import type { SkillCategory } from "../types";

const categories: { key: SkillCategory; icon: typeof Server }[] = [
  { key: "backend", icon: Server },
  { key: "frontend", icon: Globe },
  { key: "desktop", icon: Monitor },
  { key: "tools", icon: Wrench },
];

export default function Skills() {
  const { t } = useTranslation();
  const { skills } = useContent();

  return (
    <Section id="skills" index="02" title={t("skills.title")}>
      <div className="grid auto-rows-fr gap-5 md:grid-cols-2">
        {categories.map(({ key, icon: Icon }) => (
          <SpotlightCard key={key} className="p-6">
            <div className="flex min-h-40 gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-accent/10 text-accent">
                <Icon size={24} />
              </span>
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  {t(`skills.categories.${key}`)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((skill) => skill.category === key)
                    .map((skill) => (
                      <span key={skill.name} className="chip">
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
