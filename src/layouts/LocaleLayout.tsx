import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { LANGS, type Lang } from "../i18n";

export default function LocaleLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const valid = !!lang && (LANGS as readonly string[]).includes(lang);

  useEffect(() => {
    if (valid && lang) {
      i18n.changeLanguage(lang);
      document.documentElement.lang = lang;
    }
  }, [valid, lang, i18n]);

  if (!valid) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar lang={lang as Lang} />
      <Outlet />
    </>
  );
}
