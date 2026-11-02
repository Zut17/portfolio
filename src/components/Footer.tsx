import { useTranslation } from "react-i18next";
import { useContent } from "../content/ContentContext";
import { isHttpUrl } from "../lib/links";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();
  const { profile } = useContent();
  const lastName = profile.fullName.split(/\s+/).pop() ?? profile.fullName;

  const links = [
    isHttpUrl(profile.github) && { label: "GitHub", href: profile.github, external: true },
    isHttpUrl(profile.linkedin) && { label: "LinkedIn", href: profile.linkedin, external: true },
    profile.email && { label: "Email", href: `mailto:${profile.email}`, external: false },
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  return (
    <footer className="border-t border-border pt-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
        <p>
          © {currentYear} {profile.fullName}. {t("footer.rights")}
        </p>
        {links.length > 0 && (
          <nav aria-label={t("footer.links")}>
            <ul className="flex gap-5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="underline underline-offset-4 transition hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div aria-hidden="true" className="wordmark mt-10 text-center text-[22vw] md:text-[18vw]">
        {lastName.toUpperCase()}
      </div>
    </footer>
  );
}
