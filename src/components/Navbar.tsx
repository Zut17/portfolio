import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useActiveSection } from "../hooks/useActiveSection";
import type { Lang } from "../i18n";

const items = ["home", "about", "skills", "projects", "services", "contact"];

export default function Navbar({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const active = useActiveSection(items);
  const other: Lang = lang === "fr" ? "en" : "fr";

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="glass mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full px-5">
        <a href="#home" className="font-display text-lg font-bold">
          HWZ<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((k) => (
            <li key={k}>
              <a
                href={`#${k}`}
                className={`relative isolate block rounded-full px-4 py-1.5 text-sm transition ${
                  active === k
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {active === k && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/15"
                  />
                )}
                {t(`nav.${k}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={`/${other}`}
            className="rounded-full border border-border px-3 py-1 font-mono text-xs font-semibold uppercase transition hover:border-primary hover:text-primary"
          >
            {other}
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-full border border-border p-2 transition hover:border-accent hover:text-accent"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
            className="rounded-full border border-border p-2 md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-2 flex max-w-5xl flex-col gap-4 rounded-3xl p-6 md:hidden"
        >
          {items.map((k) => (
            <li key={k}>
              <a
                href={`#${k}`}
                onClick={() => setOpen(false)}
                className="font-display text-xl hover:text-primary"
              >
                {t(`nav.${k}`)}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  );
}
