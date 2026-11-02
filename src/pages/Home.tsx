import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

export default function Home() {
  const { t } = useTranslation();
  const { profile } = useContent();
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

  return (
    <section id="home" aria-labelledby="home-title" className="pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-6 pb-8">
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

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              {l(profile.bio)}
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
            </div>
          </motion.div>

          <motion.div
            {...fade(0.15)}
            className="mx-auto w-full max-w-sm md:max-w-none"
          >
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
      </div>
    </section>
  );
}
