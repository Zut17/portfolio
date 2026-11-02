import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
 
const origin = (process.env.VITE_SITE_URL || "https://williamzuteuportfolio.vercel.app").replace(/\/$/, "");
const urls = ["fr", "en"];
const links = urls
  .map((lang) => `  <url>\n    <loc>${origin}/${lang}</loc>\n    <xhtml:link rel="alternate" hreflang="fr" href="${origin}/fr" />\n    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/fr" />\n  </url>`)
  .join("\n");
 
writeFileSync(
  resolve("public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${links}\n</urlset>\n`,
);
