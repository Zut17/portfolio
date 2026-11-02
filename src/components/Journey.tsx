import { useTranslation } from "react-i18next";
import { Briefcase, GraduationCap } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

export default function Journey() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { timeline } = useContent();

  if (timeline.length === 0) return null;

  return (
    <Section id="journey" index="02" title={t("journey.title")}>
      <ol className="relative grid gap-5 border-l border-border pl-8 md:pl-10">
        {timeline.map((item, index) => {
          const Icon = item.kind === "work" ? Briefcase : GraduationCap;
          return (
            <li key={`${item.organization}-${index}`} className="bento relative p-6">
              <span
                aria-hidden="true"
                className="absolute -left-[3.05rem] top-6 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-accent md:-left-[3.55rem]"
              >
                <Icon size={16} />
              </span>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wider text-muted">
                <span>{t(`journey.kind.${item.kind}`)}</span>
                {item.period && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{item.period}</span>
                  </>
                )}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{l(item.title)}</h3>
              <p className="text-sm font-medium text-primary">{item.organization}</p>
              {l(item.description) && (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {l(item.description)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
