import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-border py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
        <p>
          © {currentYear} Henry William Zuteu. {t("footer.rights")}
        </p>
        <a
          href="#home"
          className="flex items-center gap-2 font-mono text-xs transition hover:text-primary"
        >
          <ArrowUp size={14} /> {t("footer.top")}
        </a>
      </div>
    </footer>
  );
}
