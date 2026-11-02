import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import Section from "./Section";
import { useContent } from "../content/ContentContext";
import { supabase, supabaseConfigured } from "../lib/supabase";
 
const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/20";
const label = "mb-1.5 block text-sm font-semibold";
type Status = "idle" | "sending" | "sent" | "error";
 
function validHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
 
export default function Contact() {
  const { t } = useTranslation();
  const { profile: contact } = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState("");
 
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setValidationError("");
    if (trap) return;
 
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();
    if (cleanName.length < 2 || cleanName.length > 200) {
      setValidationError(t("contact.validationName"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setValidationError(t("contact.validationEmail"));
      return;
    }
    if (cleanMessage.length < 10 || cleanMessage.length > 5000) {
      setValidationError(t("contact.validationMessage"));
      return;
    }
 
    setStatus("sending");
    if (!supabaseConfigured) {
      const subject = encodeURIComponent(`${t("contact.subjectPrefix")} ${cleanName}`);
      const body = encodeURIComponent(`${cleanMessage}\n\n${cleanName}\n${cleanEmail}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      setStatus("idle");
      return;
    }
 
    try {
      const { error } = await supabase.from("messages").insert({
        name: cleanName,
        email: cleanEmail,
        content: cleanMessage,
      });
      if (error) {
        // P0001 : limite d'envoi atteinte (trigger messages_before_insert).
        if (error.code === "P0001") setValidationError(t("contact.rateLimited"));
        setStatus("error");
        return;
      }
      setName("");
      setEmail("");
      setMessage("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };
 
  const links = [
    contact.email && { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
    contact.whatsapp && { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${contact.whatsapp}` },
    contact.linkedin && validHttpUrl(contact.linkedin) && { icon: Link2, label: "LinkedIn", href: contact.linkedin },
    contact.github && validHttpUrl(contact.github) && { icon: Link2, label: "GitHub", href: contact.github },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];
 
  return (
    <Section id="contact" index="05" title={t("contact.title")}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bento min-w-0 p-6 sm:p-8">
          <p className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{t("contact.heading")}</p>
          <p className="mt-3 text-muted">{t("contact.intro")}</p>
          <ul className="mt-8 space-y-2">
            {links.map(({ icon: Icon, label: linkLabel, href }) => (
              <li key={linkLabel}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl border border-border p-2.5 pr-4 text-base font-medium transition hover:bg-foreground/[0.05]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-foreground"><Icon size={16} /></span>
                  <span className="min-w-0 break-words">{linkLabel}</span>
                </a>
              </li>
            ))}
            {contact.location && <li className="flex items-center gap-3 pl-2.5 pt-2 text-sm text-muted"><MapPin size={16} />{contact.location}</li>}
          </ul>
        </div>
 
        <form onSubmit={onSubmit} className="bento min-w-0 space-y-5 p-6 sm:p-8" noValidate>
          <div>
            <label htmlFor="c-name" className={label}>{t("contact.name")}</label>
            <input id="c-name" name="name" autoComplete="name" required minLength={2} maxLength={200} value={name} onChange={(event) => setName(event.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="c-email" className={label}>{t("contact.email")}</label>
            <input id="c-email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={320} value={email} onChange={(event) => setEmail(event.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="c-message" className={label}>{t("contact.message")}</label>
            <textarea id="c-message" name="message" required minLength={10} rows={5} maxLength={5000} value={message} onChange={(event) => setMessage(event.target.value)} className={`${field} resize-y`} />
            <p className="mt-1 text-right text-xs text-muted">{message.length} / 5000</p>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(event) => setTrap(event.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" />
 
          {(validationError || status === "error") && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{validationError || t("contact.error")}</p>}
          <button type="submit" disabled={status === "sending"} className="btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold disabled:opacity-60 sm:w-auto">
            <Send size={18} />{status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>
          <div role="status" aria-live="polite" className="min-h-6">
            {status === "sent" && <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">✓ {t("contact.sent")}</p>}
          </div>
        </form>
      </div>
    </Section>
  );
}
