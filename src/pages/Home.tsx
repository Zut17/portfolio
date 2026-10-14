import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

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

export default function Home() {
  const { t } = useTranslation();
  const [photoFailed, setPhotoFailed] = useState(false);

  const stats = [
    { value: "3", label: t("home.stats.projects") },
    { value: "28", label: t("home.stats.indicators") },
    { value: "1", label: t("home.stats.internship") },
  ];

  return (
    <section
      id="home"
      className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pb-16 pt-28"
    >
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <motion.span
            {...fade(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t("home.available")}
          </motion.span>

          <h1 className="font-display text-6xl font-semibold leading-[1.05] tracking-tight md:text-8xl">
            <span className="block overflow-hidden pb-2">
              <motion.span
                custom={0}
                variants={line}
                initial="hidden"
                animate="show"
                className="block"
              >
                Henry William
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                custom={1}
                variants={line}
                initial="hidden"
                animate="show"
                className="block text-primary"
              >
                Zuteu<span className="text-accent">.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            {...fade(0.5)}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
          >
            {t("home.role")}
          </motion.p>

          <motion.div {...fade(0.65)} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-accent px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
            >
              {t("home.cta")}
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border px-7 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              {t("home.ctaContact")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm md:col-span-5"
        >
          <div className="absolute -right-3 -top-3 h-full w-full rounded-3xl border-2 border-accent" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-card">
            {photoFailed ? (
              <div className="flex h-full items-center justify-center font-display text-7xl text-primary">
                HWZ
              </div>
            ) : (
              <img
                src="/photo.jpg"
                alt="Henry William Zuteu"
                onError={() => setPhotoFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </motion.div>
      </div>

      <motion.dl
        {...fade(0.9)}
        className="mt-20 grid grid-cols-3 gap-6 border-t border-border pt-8"
      >
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="font-display text-4xl font-semibold text-primary md:text-5xl">
              {s.value}
            </dt>
            <dd className="mt-1 text-sm text-muted">{s.label}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
