import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import Section from "./Section";
import { useContent } from "../content/ContentContext";
import { supabase, supabaseConfigured } from "../lib/supabase";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const { t } = useTranslation();
  const { profile: contact } = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (trap) return;
    setStatus("sending");

    if (!supabaseConfigured) {
      const subject = encodeURIComponent(
        `${t("contact.subjectPrefix")} ${name}`,
      );
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      setStatus("idle");
      return;
    }

    try {
      const { error } = await supabase.from("messages").insert({
        name: name.trim(),
        email: email.trim(),
        content: message.trim(),
      });
      if (error) {
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
    contact.email && {
      icon: Mail,
      label: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      href: `https://wa.me/${contact.whatsapp}`,
    },
    contact.linkedin && {
      icon: Link2,
      label: "LinkedIn",
      href: contact.linkedin,
    },
    contact.github && {
      icon: Link2,
      label: "GitHub",
      href: contact.github,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];

  return (
    <Section id="contact" title={t("contact.title")}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bento p-8">
          <p className="text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
            {t("contact.heading")}
          </p>
          <p className="mt-3 text-muted">{t("contact.intro")}</p>
          <ul className="mt-8 space-y-2">
            {links.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border p-2.5 pr-4 text-sm font-medium transition hover:bg-foreground/[0.05]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-foreground">
                    <Icon size={16} />
                  </span>
                  {label}
                </a>
              </li>
            ))}
            {contact.location && (
              <li className="flex items-center gap-3 pl-2.5 pt-2 text-sm text-muted">
                <MapPin size={16} />
                {contact.location}
              </li>
            )}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="bento space-y-4 p-8">
          <input
            required
            maxLength={200}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("contact.name")}
            className={field}
          />
          <input
            required
            type="email"
            maxLength={320}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("contact.email")}
            className={field}
          />
          <textarea
            required
            rows={5}
            maxLength={5000}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t("contact.message")}
            className={field}
          />
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
          >
            <Send size={16} />{" "}
            {status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>
          {status === "sent" && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {t("contact.sent")}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {t("contact.error")}
            </p>
          )}
        </form>
      </div>
    </Section>
  );
}
