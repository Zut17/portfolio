import { useTranslation } from "react-i18next";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";
import type { GoalHorizon } from "../types";

const order: Record<GoalHorizon, number> = { past: 0, now: 1, next: 2 };

export default function Goals() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { profile, goals } = useContent();
  const ambition = l(profile.goal);

  if (!ambition && goals.length === 0) return null;

  // Ordre : étapes franchies → aujourd'hui → prochaines étapes (puis ordre de l'admin).
  const steps = goals
    .map((goal, index) => ({ goal, index }))
    .sort((a, b) => order[a.goal.horizon] - order[b.goal.horizon] || a.index - b.index)
    .map(({ goal }) => goal);

  return (
    <Section id="goals" title={t("goals.title")} intro={t("goals.intro")}>
      {ambition && (
        <blockquote className="mb-10 max-w-3xl border-l-2 border-accent pl-5 text-xl font-medium leading-relaxed md:text-2xl">
          <p>{ambition}</p>
        </blockquote>
      )}

      {steps.length > 0 && (
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((goal) => {
            const now = goal.horizon === "now";
            const next = goal.horizon === "next";
            return (
              <li
                key={goal.id}
                className={`bento relative p-5 ${now ? "border-accent/60 ring-1 ring-accent/30" : ""} ${
                  next ? "border-dashed" : ""
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${now ? "text-accent" : "text-muted"}`}>
                  {l(goal.label) || t(`goals.horizon.${goal.horizon}`)}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{l(goal.title)}</h3>
                {l(goal.description) && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{l(goal.description)}</p>
                )}
                <p className="sr-only">{t(`goals.horizon.${goal.horizon}`)}</p>
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
