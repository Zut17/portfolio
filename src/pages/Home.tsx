import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import Counter from "../components/Counter";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function Home() {
  const { t } = useTranslation();
  const { profile } = useContent();
  const l = useLocalized();
  const [photoFailed, setPhotoFailed] = useState(false);
  const cvHref =
    (profile.cvUrl
      ? l(profile.cvUrl) || profile.cvUrl.fr || profile.cvUrl.en
      : "") || "/cv.pdf";

  const roles = (t("home.typed", { returnObjects: true }) as string[]).join(
    " · ",
  );

  const stats = [
    { value: 3, label: t("home.stats.projects") },
    { value: 28, label: t("home.stats.indicators") },
    { value: 1, label: t("home.stats.internship") },
  ];

  return (
    <section id="home" className="pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-14 md:grid-cols-[1.15fr_1fr] md:gap-20">
          <motion.div {...fade(0)}>
            <span className="chip">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {t("home.available")}
            </span>

            <h1 className="display mt-6 text-6xl md:text-8xl">
              {profile.fullName}
            </h1>

            <p className="script mt-4 text-2xl">{roles}</p>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              {l(profile.title)}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold"
              >
                {t("home.cta")}
              </a>
              <a
                href="#contact"
                className="btn-ghost rounded-xl px-6 py-3 text-sm font-medium"
              >
                {t("home.ctaContact")}
              </a>
              <a
                href={cvHref}
                download
                target="_blank"
                rel="noreferrer"
                className="btn-ghost inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium"
              >
                <Download size={16} />
                {t("home.cv")}
              </a>
            </div>
          </motion.div>

          <motion.div
            {...fade(0.15)}
            className="mx-auto w-full max-w-sm md:max-w-none"
          >
            <div className="photo-frame mr-5 mb-5">
              {photoFailed ? (
                <div className="flex aspect-[4/5] items-center justify-center rounded-[1.75rem] bg-card-2 text-6xl font-semibold text-muted shadow-2xl">
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
                  className="aspect-[4/5] w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-20px_rgb(20_50_100/0.45)]"
                />
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              {...fade(0.3 + index * 0.08)}
              className="bento p-6"
            >
              <p className="display text-6xl text-accent">
                <Counter to={stat.value} />
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
