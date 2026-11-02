/** Vérifie qu'une URL saisie dans l'admin est un lien http(s) valide. */
export function isHttpUrl(value?: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Version courte d'une URL pour l'affichage (sans protocole ni « www. »). */
export function shortUrl(value: string) {
  return value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
