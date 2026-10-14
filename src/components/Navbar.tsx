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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#home" className="font-display text-xl font-semibold">
          HWZ<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {items.map((k) => (
            <li key={k} className="relative">
              <a
                href={`#${k}`}
                className={`text-sm transition ${
                  active === k
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {t(`nav.${k}`)}
              </a>
              {active === k && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={`/${other}`}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase transition hover:border-primary hover:text-primary"
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
          className="flex flex-col gap-5 border-t border-border bg-background px-6 py-6 md:hidden"
        >
          {items.map((k) => (
            <li key={k}>
              <a
                href={`#${k}`}
                onClick={() => setOpen(false)}
                className="font-display text-2xl hover:text-primary"
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
