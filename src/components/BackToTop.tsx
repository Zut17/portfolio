import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const { i18n } = useTranslation();
  const label = i18n.language.startsWith("fr")
    ? "Retour en haut"
    : "Back to top";

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#home"
      aria-label={label}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`btn-primary fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={20} />
    </a>
  );
}
