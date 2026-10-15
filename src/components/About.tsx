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
    <Section id="about" index="01" title={t("about.title")} tone="blue">
      <div className="grid gap-10 md:grid-cols-12">
        <SpotlightCard className="p-8 md:col-span-7">
          <p className="text-xl leading-relaxed md:text-2xl">{l(profile.bio)}</p>
        </SpotlightCard>

        <div className="md:col-span-5">
          <h3 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">
            {t("about.timeline")}
          </h3>
          <ol className="border-l border-primary/30">
            {timeline.map((item, i) => (
              <li key={i} className="relative pb-8 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                <p className="font-mono text-xs uppercase tracking-widest text-primary">
                  {t(`about.kind.${item.kind}`)}
                </p>
                <h4 className="mt-1 font-display text-lg font-semibold">
                  {l(item.title)}
                </h4>
                <p className="text-sm text-accent">{item.organization}</p>
                <p className="mt-2 text-sm text-muted">{l(item.description)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
