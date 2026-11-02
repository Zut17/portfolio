import { useTranslation } from "react-i18next";
import { Award, ArrowUpRight } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";
import { isHttpUrl } from "../lib/links";

export default function Certifications() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { certifications } = useContent();

  if (certifications.length === 0) return null;

  return (
    <Section id="certifications" title={t("certifications.title")} intro={t("certifications.intro")}>
      <ul className="grid gap-5">
        {certifications.map((certification) => (
          <li key={certification.id} className="bento grid items-center gap-6 p-5 md:grid-cols-[minmax(0,320px)_1fr] md:p-6">
            {certification.imageUrl ? (
              <img
                src={certification.imageUrl}
                alt={`${certification.title} — ${certification.issuer}`}
                loading="lazy"
                width={640}
                height={480}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div aria-hidden="true" className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Award size={48} />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{certification.title}</h3>
              {(certification.issuer || certification.issuedOn) && (
                <p className="mt-1 text-sm text-muted">
                  {[certification.issuer, certification.issuedOn].filter(Boolean).join(" · ")}
                </p>
              )}
              {l(certification.description) && (
                <p className="mt-4 leading-relaxed text-muted">{l(certification.description)}</p>
              )}
              {isHttpUrl(certification.verifyUrl) && (
                <a
                  href={certification.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 hover:text-primary"
                >
                  {t("certifications.verify")}
                  <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> {certification.title} {t("certifications.newTab")}</span>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
