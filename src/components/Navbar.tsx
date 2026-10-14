import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import type { Lang } from "../i18n";

const items = ["home", "about", "projects", "skills", "services", "contact"];

export default function Navbar({ lang }: { lang: Lang }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const other: Lang = lang === "fr" ? "en" : "fr";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#home" className="text-lg font-bold text-primary">
          HWZ
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {items.map((k) => (
            <li key={k}>
              <a
                href={`#${k}`}
                className="text-sm text-muted transition hover:text-primary"
              >
                {t(`nav.${k}`)}
              </a>
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
        <ul className="flex flex-col gap-4 border-t border-border bg-background px-6 py-4 md:hidden">
          {items.map((k) => (
            <li key={k}>
              <a
                href={`#${k}`}
                onClick={() => setOpen(false)}
                className="text-sm text-muted hover:text-primary"
              >
                {t(`nav.${k}`)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
