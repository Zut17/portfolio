import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pt-16 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-muted"
      >
        {t("home.greeting")}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-5xl font-bold text-primary md:text-6xl"
      >
        Henry William Zuteu
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-xl text-lg"
      >
        {t("home.role")}
      </motion.p>
      <motion.a
        href="#projects"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        {t("home.cta")}
      </motion.a>
    </section>
  );
}
