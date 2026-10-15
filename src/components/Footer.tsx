import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../content/ContentContext";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();
  const { profile } = useContent();

  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
        <p>
          © {currentYear} {profile.fullName}. {t("footer.rights")}
        </p>
        <a
          href="#home"
          className="flex items-center gap-2 text-xs font-medium transition hover:text-foreground"
        >
          <ArrowUp size={14} /> {t("footer.top")}
        </a>
      </div>
      <div className="wordmark mt-10 text-center text-[22vw] md:text-[18vw]">
        ZUTEU
      </div>
    </footer>
  );
}
