import { useTranslation } from "react-i18next";
import { useContent } from "../content/ContentContext";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();
  const { profile } = useContent();
  const lastName = profile.fullName.split(/\s+/).pop() ?? profile.fullName;

  return (
    <footer className="border-t border-border pt-10">
      <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted md:text-left">
        <p>
          © {currentYear} {profile.fullName}. {t("footer.rights")}
        </p>
      </div>
      <div aria-hidden="true" className="wordmark mt-10 text-center text-[22vw] md:text-[18vw]">
        {lastName.toUpperCase()}
      </div>
    </footer>
  );
}
