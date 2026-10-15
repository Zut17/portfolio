import { useEffect, useState } from "react";
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
  const fr = lang === "fr";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition hover:border-accent hover:text-accent";

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-4">
      <nav
        aria-label={fr ? "Navigation principale" : "Main navigation"}
        className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-2xl border border-border bg-card/85 px-4 shadow-[var(--shadow)] backdrop-blur-xl"
      >
        <a href="#home" className="text-lg font-bold tracking-tight">
          HWZ
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                aria-current={active === key ? "location" : undefined}
                className={`relative isolate block rounded-lg px-4 py-2 text-[15px] font-medium transition ${
                  active === key
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {active === key && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-accent/15"
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
            hrefLang={other}
            aria-label={fr ? "Switch to English" : "Passer en français"}
            className={`${iconBtn} text-xs font-bold uppercase`}
          >
            {other}
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={
              theme === "dark"
                ? fr
                  ? "Activer le thème clair"
                  : "Switch to light theme"
                : fr
                  ? "Activer le thème sombre"
                  : "Switch to dark theme"
            }
            className={iconBtn}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((previous) => !previous)}
            aria-label={
              open
                ? fr
                  ? "Fermer le menu"
                  : "Close menu"
                : fr
                  ? "Ouvrir le menu"
                  : "Open menu"
            }
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`${iconBtn} md:hidden`}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.ul
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 flex max-w-5xl flex-col gap-1 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow)] md:hidden"
        >
          {items.map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                onClick={() => setOpen(false)}
                aria-current={active === key ? "location" : undefined}
                className={`flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition ${
                  active === key
                    ? "bg-accent/15 text-accent"
                    : "hover:bg-foreground/[0.06]"
                }`}
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
