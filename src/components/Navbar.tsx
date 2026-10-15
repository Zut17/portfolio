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
    <header className="fixed inset-x-0 top-3 z-50 px-4">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-2xl border border-border bg-card/70 px-4 shadow-sm backdrop-blur-xl">
        <a href="#home" className="text-base font-semibold tracking-tight">
          HWZ
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className={`relative isolate block rounded-lg px-3.5 py-1.5 text-sm transition ${
                  active === key
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {active === key && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-foreground/[0.07]"
                  />
                )}
                {t(`nav.${key}`)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={`/${other}`}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium uppercase transition hover:bg-foreground/[0.06]"
          >
            {other}
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-lg border border-border p-2 transition hover:bg-foreground/[0.06]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            aria-label="Menu"
            aria-expanded={open}
            className="rounded-lg border border-border p-2 md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 flex max-w-5xl flex-col gap-1 rounded-2xl border border-border bg-card p-3 md:hidden"
        >
          {items.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium hover:bg-foreground/[0.06]"
              >
                {t(`nav.${key}`)}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </header>
  );
}
