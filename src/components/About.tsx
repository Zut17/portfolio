import { useTranslation } from "react-i18next";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { bio, timeline } from "../data/profile";

export default function About() {
  const { t } = useTranslation();
  const l = useLocalized();

  return (
    <Section id="about" index="01" title={t("about.title")}>
      <div className="grid gap-16 md:grid-cols-12">
        <p className="font-display text-2xl leading-snug md:col-span-7 md:text-3xl">
          {l(bio)}
        </p>

        <div className="md:col-span-5">
          <h3 className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted">
            {t("about.timeline")}
          </h3>
          <ol className="border-l border-border">
            {timeline.map((item, i) => (
              <li key={i} className="relative pb-10 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {t(`about.kind.${item.kind}`)}
                </p>
                <h4 className="mt-1 font-display text-xl">{l(item.title)}</h4>
                <p className="text-sm text-muted">{item.organization}</p>
                <p className="mt-2 text-muted">{l(item.description)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
