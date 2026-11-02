/**
 * Routes de l'application d'administration (servie à la racine de son
 * propre domaine, ex. https://<projet-admin>.vercel.app/).
 */
export const ADMIN = "";
export const ADMIN_HOME = "/";

/** URL publique du portfolio, pour le lien « Voir le site ». */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "/";
