import { useTranslation } from "react-i18next";
import { GraduationCap, Heart, Languages, Mail, MapPin, Phone } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

export default function About() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { profile, timeline } = useContent();

  const current = timeline.find((item) => item.status === "in_progress" && item.kind === "education");
  const paragraphs = l(profile.bio)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  // Ordre pensé pour la grille 2 colonnes : longues valeurs en pleine largeur.
  const facts = [
    current && {
      wide: true,
      icon: GraduationCap,
      label: t("about.studies"),
      value: [l(current.title), current.organization].filter(Boolean).join(" — "),
    },
    profile.location && { icon: MapPin, label: t("about.location"), value: profile.location },
    profile.phone && {
      icon: Phone,
      label: t("about.phone"),
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
    },
    profile.email && {
      wide: true,
      icon: Mail,
      label: t("about.email"),
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    l(profile.interests) && { wide: true, icon: Heart, label: t("about.interests"), value: l(profile.interests) },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string; wide?: boolean }[];

  return (
    <Section id="about" title={t("about.title")} intro={t("about.intro")}>
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
        <div className="space-y-5 text-lg leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="space-y-6">
          {facts.length > 0 && (
            <div>
              <h3 className="sr-only">{t("about.facts")}</h3>
              <dl className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {facts.map(({ icon: Icon, label, value, href, wide }) => (
                  <div key={label} className={`bento p-4 ${wide ? "sm:col-span-2 md:col-span-1 lg:col-span-2" : ""}`}>
                    <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
                      <Icon size={14} aria-hidden="true" className="text-accent" />
                      {label}
                    </dt>
                    <dd className="mt-1.5 break-words text-sm font-medium">
                      {href ? (
                        <a href={href} className="underline-offset-4 hover:underline">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {profile.languages.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted">
                <Languages size={14} aria-hidden="true" />
                {t("about.languages")}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {profile.languages.map((language) => (
                  <li key={language.name.fr} className="bento flex items-baseline gap-2 px-4 py-2.5 text-sm">
                    <span className="font-semibold">{l(language.name)}</span>
                    {l(language.level) && <span className="text-accent">{l(language.level)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
