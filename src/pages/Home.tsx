import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import Counter from "../components/Counter";
import { useTypewriter } from "../hooks/useTypewriter";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

const line: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.1 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const chips = [
  { label: "Odoo", className: "-left-4 top-10", delay: "0s" },
  { label: "React", className: "-right-2 top-1/3", delay: "1s" },
  { label: ".NET", className: "-left-6 bottom-1/4", delay: "2s" },
  { label: "TypeScript", className: "right-2 -bottom-3", delay: "3s" },
];

export default function Home() {
  const { t } = useTranslation();
  const { profile } = useContent();
  const l = useLocalized();
  const [photoFailed, setPhotoFailed] = useState(false);
  const nameParts = profile.fullName.trim().split(" ");
  const lastName = nameParts.length > 1 ? (nameParts.pop() as string) : "";
  const firstName = nameParts.join(" ");
  const cvHref = profile.cvUrl
    ? l(profile.cvUrl) || profile.cvUrl.fr || profile.cvUrl.en
    : "";
  const typed = useTypewriter(t("home.typed", { returnObjects: true }) as string[]);

  const stats = [
    { value: 3, label: t("home.stats.projects") },
    { value: 28, label: t("home.stats.indicators") },
    { value: 1, label: t("home.stats.internship") },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="animate-float absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
        <div
          className="animate-float absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-accent/25 blur-[120px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
        <div className="grid items-center gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <motion.span
              {...fade(0)}
              className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-muted"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t("home.available")}
            </motion.span>

            <h1 className="font-display text-6xl font-bold leading-[1.05] tracking-tight md:text-8xl">
              <span className="block overflow-hidden pb-2">
                <motion.span
                  custom={0}
                  variants={line}
                  initial="hidden"
                  animate="show"
                  className="block"
                >
                  {firstName}
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  custom={1}
                  variants={line}
                  initial="hidden"
                  animate="show"
                  className="block"
                >
                  <span className="text-gradient">{lastName}</span>
                  <span className="text-accent">.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              {...fade(0.5)}
              className="mt-6 h-8 font-mono text-lg text-primary md:text-xl"
            >
              {"> "}
              {typed}
              <span className="animate-pulse">|</span>
            </motion.p>

            <motion.p
              {...fade(0.6)}
              className="mt-4 max-w-xl text-lg leading-relaxed text-muted"
            >
              {l(profile.title)}
            </motion.p>

            <motion.div {...fade(0.75)} className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow-[0_0_30px_-5px_var(--color-accent)] transition hover:-translate-y-0.5"
              >
                {t("home.cta")}
              </a>
              <a
                href="#contact"
                className="glass rounded-full px-7 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {t("home.ctaContact")}
              </a>
              {cvHref && (
                <a
                  href={cvHref}
                  target="_blank"
                  rel="noreferrer"
                  className="glass rounded-full px-7 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  {t("home.cv")}
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm md:col-span-5"
          >
            <div className="absolute -inset-2 animate-pulse rounded-[2rem] bg-linear-to-br from-primary via-transparent to-accent opacity-50 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-primary/40 bg-card">
              {photoFailed ? (
                <div className="flex h-full items-center justify-center font-display text-7xl font-bold text-primary">
                  {profile.fullName
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 3)}
                </div>
              ) : (
                <img
                  src={profile.photoUrl ?? "/photo.jpg"}
                  alt={profile.fullName}
                  onError={() => setPhotoFailed(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {chips.map((c) => (
              <span
                key={c.label}
                style={{ animationDelay: c.delay }}
                className={`glass animate-float absolute rounded-full px-3 py-1 font-mono text-xs text-primary ${c.className}`}
              >
                {c.label}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.dl
          {...fade(1)}
          className="mt-20 grid grid-cols-3 gap-6 border-t border-border pt-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-4xl font-bold text-gradient md:text-5xl">
                <Counter to={s.value} />
              </dt>
              <dd className="mt-1 text-sm text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
