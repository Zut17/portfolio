import { useTranslation } from "react-i18next";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

export default function About() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { profile, timeline } = useContent();

  return (
    <Section
      id="about"
      index="01"
      kicker="qui suis-je ?"
      title={t("about.title")}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <SpotlightCard className="p-8">
          <p className="text-lg leading-relaxed md:text-xl">{l(profile.bio)}</p>
        </SpotlightCard>

        <SpotlightCard className="p-8">
          <h3 className="mb-6 text-xs font-medium uppercase tracking-wider text-muted">
            {t("about.timeline")}
          </h3>
          <ol className="border-l border-border">
            {timeline.map((item, index) => (
              <li key={index} className="relative pb-7 pl-6 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {t(`about.kind.${item.kind}`)}
                </p>
                <h4 className="mt-1 text-base font-semibold">
                  {l(item.title)}
                </h4>
                <p className="text-sm text-primary">{item.organization}</p>
                <p className="mt-2 text-sm text-muted">{l(item.description)}</p>
              </li>
            ))}
          </ol>
        </SpotlightCard>
      </div>
    </Section>
  );
}
