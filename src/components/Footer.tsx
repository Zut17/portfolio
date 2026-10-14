import { useTranslation } from "react-i18next";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted">
      © {currentYear} Henry William Zuteu. {t("footer.rights")}
    </footer>
  );
}
