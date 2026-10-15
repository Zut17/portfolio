import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import Section from "./Section";
import { useContent } from "../content/ContentContext";
import { supabase, supabaseConfigured } from "../lib/supabase";

const field =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 outline-none transition focus:border-primary focus:shadow-[0_0_20px_-6px_var(--color-primary)]";

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
    <Section id="contact" index="05" title={t("contact.title")} tone="mix">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <p className="font-display text-3xl font-bold leading-tight md:text-4xl">
            <span className="text-gradient">{t("contact.heading")}</span>
          </p>
          <p className="mt-4 text-muted">{t("contact.intro")}</p>
          <ul className="mt-8 space-y-3">
            {links.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex items-center gap-3 rounded-full py-2 pl-2 pr-5 transition hover:border-primary hover:text-primary"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon size={16} />
                  </span>
                  {label}
                </a>
              </li>
            ))}
            {contact.location && (
              <li className="flex items-center gap-3 pl-2 text-muted">
                <MapPin size={16} className="text-accent" />
                {contact.location}
              </li>
            )}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass space-y-4 rounded-2xl p-6 md:p-8"
        >
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
            className="flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-white shadow-[0_0_30px_-5px_var(--color-accent)] transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Send size={16} />{" "}
            {status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>
          {status === "sent" && (
            <p className="text-sm text-primary">{t("contact.sent")}</p>
          )}
          {status === "error" && (
            <p className="text-sm text-accent">{t("contact.error")}</p>
          )}
        </form>
      </div>
    </Section>
  );
}
