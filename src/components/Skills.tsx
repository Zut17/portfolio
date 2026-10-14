import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Section from "./Section";
import { skills } from "../data/skills";
import type { SkillCategory } from "../types";

const categories: SkillCategory[] = ["backend", "frontend", "desktop", "tools"];

export default function Skills() {
  const { t } = useTranslation();

  return (
    <Section id="skills" index="02" title={t("skills.title")}>
      <div className="divide-y divide-border border-y border-border">
        {categories.map((cat) => (
          <motion.div
            key={cat}
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline"
          >
            <h3 className="font-display text-2xl md:col-span-4">
              {t(`skills.categories.${cat}`)}
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lg text-muted md:col-span-8">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <li key={s.name} className="transition hover:text-primary">
                    {s.name}
                  </li>
                ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
