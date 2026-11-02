import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import Seo from "../components/Seo";
import { LANGS, type Lang } from "../i18n";

export default function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { t, i18n } = useTranslation();
  const valid = !!lang && (LANGS as readonly string[]).includes(lang);

  useEffect(() => {
    if (valid && lang && i18n.language !== lang) void i18n.changeLanguage(lang);
  }, [valid, lang, i18n]);

  if (!valid) return <Navigate to="/" replace />;

  return (
    <>
      <a href="#main" className="skip-link">
        {t("a11y.skip")}
      </a>
      <Seo lang={lang as Lang} />
      <ScrollProgress />
      <Navbar lang={lang as Lang} />
      <Outlet />
    </>
  );
}
