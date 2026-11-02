import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Lang } from "../i18n";

const SITE_NAME = "Henry William Zuteu";
const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || window.location.origin;

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string, extra: Record<string, string> = {}) {
  const selector = rel === "alternate" && extra.hreflang
    ? `link[rel="alternate"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
  Object.entries(extra).forEach(([key, value]) => element!.setAttribute(key, value));
}

export default function Seo({ lang }: { lang: Lang }) {
  const { t } = useTranslation();

  useEffect(() => {
    const current = {
      title: t("meta.title", { lng: lang }),
      description: t("meta.description", { lng: lang }),
    };
    const url = `${SITE_ORIGIN}/${lang}`;
    document.documentElement.lang = lang;
    document.title = current.title;

    setMeta("name", "description", current.description);
    setMeta("name", "robots", "index,follow,max-image-preview:large");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", current.title);
    setMeta("property", "og:description", current.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", `${SITE_ORIGIN}/photo-placeholder.svg`);
    setMeta("property", "og:locale", lang === "fr" ? "fr_FR" : "en_US");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", current.title);
    setMeta("name", "twitter:description", current.description);
    setMeta("name", "twitter:image", `${SITE_ORIGIN}/photo-placeholder.svg`);
    setLink("canonical", url);
    setLink("alternate", `${SITE_ORIGIN}/fr`, { hreflang: "fr" });
    setLink("alternate", `${SITE_ORIGIN}/en`, { hreflang: "en" });
    setLink("alternate", `${SITE_ORIGIN}/fr`, { hreflang: "x-default" });

    const oldSchema = document.getElementById("portfolio-schema");
    oldSchema?.remove();
    const schema = document.createElement("script");
    schema.id = "portfolio-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE_NAME,
      jobTitle: lang === "fr" ? "Développeur full stack" : "Full stack developer",
      url,
      address: { "@type": "PostalAddress", addressLocality: "Douala", addressCountry: "CM" },
    });
    document.head.appendChild(schema);
  }, [lang, t]);

  return null;
}
