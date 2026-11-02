import { useTranslation } from "react-i18next";
import { Briefcase, CheckCircle2, CircleDot, GraduationCap, MapPin } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

/**
 * Parcours en « barre de progression » : chaque étape est un segment d'une
 * jauge continue (horizontale sur grand écran, verticale sur mobile).
 * Segments pleins = obtenu ; segment hachuré animé = en cours.
 * L'admin liste les étapes du plus récent au plus ancien (comme un CV) ;
 * le site les affiche dans l'ordre chronologique, de gauche à droite.
 */
export default function Journey() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { timeline } = useContent();

  if (timeline.length === 0) return null;

  const steps = [...timeline].reverse();
  const done = steps.filter((step) => step.status === "done").length;
  const current = steps.length - done;
  const columns = Math.min(steps.length, 5);

  return (
    <Section id="journey" title={t("journey.title")} intro={t("journey.intro")}>
      <p className="mb-6 text-sm font-medium text-muted">
        {t("journey.summary", { done, current })}
      </p>

      <ol
        aria-label={t("journey.progress")}
        className="journey grid gap-4 md:gap-3"
        style={{ ["--journey-cols" as string]: columns }}
      >
        {steps.map((step, index) => {
          const inProgress = step.status === "in_progress";
          const KindIcon = step.kind === "work" ? Briefcase : GraduationCap;
          const StatusIcon = inProgress ? CircleDot : CheckCircle2;
          return (
            <li key={`${step.organization}-${index}`} className="journey-step">
              <span
                aria-hidden="true"
                className={`journey-segment ${inProgress ? "journey-segment--current" : ""}`}
              />
              <div
                className={`bento flex h-full flex-col p-5 ${
                  inProgress ? "border-accent/60 ring-1 ring-accent/30" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted">
                    {step.period || t(`journey.kind.${step.kind}`)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      inProgress
                        ? "bg-accent/15 text-accent"
                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    <StatusIcon size={12} aria-hidden="true" />
                    {t(`journey.status.${step.status}`)}
                  </span>
                </div>

                <span aria-hidden="true" className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                  <KindIcon size={18} />
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{l(step.title)}</h3>
                {step.organization && (
                  <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-primary">
                    <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
                    {step.organization}
                  </p>
                )}
                {l(step.description) && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{l(step.description)}</p>
                )}
                <p className="sr-only">{t(`journey.kind.${step.kind}`)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
