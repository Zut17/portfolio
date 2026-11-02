import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Award, Briefcase, Download, GraduationCap, Sparkles } from "lucide-react";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";
import { isHttpUrl } from "../lib/links";

export default function Home() {
  const { t } = useTranslation();
  const { profile, timeline, certifications } = useContent();
  const l = useLocalized();
  const reduce = useReducedMotion();
  const [photoFailed, setPhotoFailed] = useState(false);
  const cvHref = l(profile.cvUrl) || profile.cvUrl.fr || profile.cvUrl.en;

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };

  const initials = profile.fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3);

  const socials = [
    isHttpUrl(profile.github) && { label: "GitHub", href: profile.github, external: true },
    isHttpUrl(profile.linkedin) && { label: "LinkedIn", href: profile.linkedin, external: true },
    profile.email && { label: "Email", href: `mailto:${profile.email}`, external: false },
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  // Repères clés, déduits du contenu géré dans l'admin.
  const current = timeline.find((item) => item.status === "in_progress");
  const lastDegree = timeline.find((item) => item.status === "done" && item.kind === "education");
  const lastWork = timeline.find((item) => item.status === "done" && item.kind === "work");
  const certification = certifications[0];

  const highlights = [
    current && {
      key: "now",
      icon: Sparkles,
      label: t("hero.now"),
      title: l(current.title),
      detail: [current.organization, current.period].filter(Boolean).join(" · "),
      href: "#journey",
    },
    lastDegree && {
      key: "degree",
      icon: GraduationCap,
      label: t("hero.degree"),
      title: l(lastDegree.title),
      detail: [lastDegree.organization, lastDegree.period].filter(Boolean).join(" · "),
      href: "#journey",
    },
    certification
      ? {
          key: "certification",
          icon: Award,
          label: t("hero.certification"),
          title: certification.title,
          detail: [certification.issuer, certification.issuedOn].filter(Boolean).join(" · "),
          href: "#certifications",
        }
      : lastWork && {
          key: "work",
          icon: Briefcase,
          label: t("hero.work"),
          title: l(lastWork.title),
          detail: [lastWork.organization, lastWork.period].filter(Boolean).join(" · "),
          href: "#journey",
        },
  ].filter(Boolean) as {
    key: string;
    icon: typeof Sparkles;
    label: string;
    title: string;
    detail: string;
    href: string;
  }[];

  return (
    <section id="home" aria-labelledby="home-title" className="pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-6 pb-6">
        <div className="grid items-center gap-14 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <motion.div {...fade(0)}>
            <p className="chip">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400" />
              {t("home.available")}
            </p>

            <h1 id="home-title" className="display mt-6 text-6xl md:text-8xl">
              {profile.fullName}
            </h1>

            <p className="mt-4 text-xl font-semibold leading-snug md:text-2xl">
              {l(profile.title)}
            </p>

            {l(profile.tagline) && (
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                {l(profile.tagline)}
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold">
                {t("home.cta")}
              </a>
              {cvHref && (
                <a
                  href={cvHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium"
                >
                  <Download size={16} aria-hidden="true" />
                  {t("home.cv")}
                </a>
              )}
              <a href="#contact" className="btn-ghost rounded-xl px-6 py-3 text-sm font-medium">
                {t("home.ctaContact")}
              </a>
            </div>

            {socials.length > 0 && (
              <ul aria-label={t("hero.social")} className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      {...(social.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-1 text-muted underline-offset-4 transition hover:text-foreground hover:underline"
                    >
                      {social.label}
                      {social.external && <ArrowUpRight size={14} aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div {...fade(0.15)} className="mx-auto w-full max-w-sm md:max-w-none">
            <div className="photo-frame mr-5 mb-5">
              {photoFailed || !profile.photoUrl ? (
                <div
                  role="img"
                  aria-label={profile.fullName}
                  className="flex aspect-[4/5] items-center justify-center rounded-[1.75rem] bg-card-2 text-6xl font-semibold text-muted shadow-2xl"
                >
                  {initials}
                </div>
              ) : (
                <img
                  src={profile.photoUrl}
                  alt={t("home.photoAlt", { name: profile.fullName })}
                  width={640}
                  height={800}
                  fetchPriority="high"
                  onError={() => setPhotoFailed(true)}
                  className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-20px_rgb(20_50_100/0.45)]"
                />
              )}
            </div>
          </motion.div>
        </div>

        {highlights.length > 0 && (
          <motion.div {...fade(0.3)} className="mt-14">
            <h2 className="sr-only">{t("hero.highlights")}</h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {highlights.map(({ key, icon: Icon, label, title, detail, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="bento group flex h-full items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:border-accent/50"
                  >
                    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
                      <span className="mt-1 block font-semibold leading-snug">{title}</span>
                      {detail && <span className="mt-1 block text-sm text-muted">{detail}</span>}
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-muted transition group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
}
