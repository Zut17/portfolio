import { useTranslation } from "react-i18next";
import type { Localized } from "../types";

export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "fr";
  return (value: Localized) => value[lang];
}
