import { useTranslation } from "react-i18next";
import { GraduationCap, Briefcase } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { bio, timeline } from "../data/profile";

export default function About() {
  const { t } = useTranslation();
  const l = useLocalized();

  return (
    <Section id="about" title={t("about.title")}>
      <p className="max-w-3xl text-lg leading-relaxed text-muted">{l(bio)}</p>

      <h3 className="mb-6 mt-12 text-xl font-semibold">
        {t("about.timeline")}
      </h3>
      <ol className="space-y-6 border-l-2 border-border pl-6">
        {timeline.map((item, i) => {
          const Icon = item.kind === "work" ? Briefcase : GraduationCap;
          return (
            <li key={i} className="relative">
              <span className="absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                <Icon size={14} />
              </span>
              <h4 className="font-semibold">{l(item.title)}</h4>
              <p className="text-sm text-accent">{item.organization}</p>
              <p className="mt-1 text-muted">{l(item.description)}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
