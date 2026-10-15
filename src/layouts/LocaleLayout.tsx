import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import { LANGS, type Lang } from "../i18n";

export default function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const valid = !!lang && (LANGS as readonly string[]).includes(lang);

  useEffect(() => {
    if (valid && lang) {
      i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
      document.title = i18n.t("meta.title", { lng: lang });
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", i18n.t("meta.description", { lng: lang }));
    }
  }, [valid, lang, i18n]);

  if (!valid) return <Navigate to="/" replace />;

  return (
    <>
      <ScrollProgress />
      <Navbar lang={lang as Lang} />
      <Outlet />
    </>
  );
}
