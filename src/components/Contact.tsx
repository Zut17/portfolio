import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import { contact } from "../data/contact";

const field =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 outline-none transition focus:border-primary focus:shadow-[0_0_20px_-6px_var(--color-primary)]";

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${t("contact.subjectPrefix")} ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const links = [
    { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
    ...(contact.whatsapp
      ? [
          {
            icon: MessageCircle,
            label: "WhatsApp",
            href: `https://wa.me/${contact.whatsapp}`,
          },
        ]
      : []),
    ...(contact.linkedin
      ? [{ icon: Link2, label: "LinkedIn", href: contact.linkedin }]
      : []),
    ...(contact.github
      ? [{ icon: Link2, label: "GitHub", href: contact.github }]
      : []),
  ];

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
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="glass flex items-center gap-3 rounded-full py-2 pl-2 pr-5 transition hover:border-primary hover:text-primary"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon size={16} />
                  </span>
                  {label}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3 pl-2 text-muted">
              <MapPin size={16} className="text-accent" />
              {contact.location}
            </li>
          </ul>
        </div>

        <SpotlightCard className="p-6 md:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.name")}
              className={field}
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.email")}
              className={field}
            />
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.message")}
              className={field}
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold text-white shadow-[0_0_30px_-5px_var(--color-accent)] transition hover:-translate-y-0.5"
            >
              <Send size={16} /> {t("contact.send")}
            </button>
          </form>
        </SpotlightCard>
      </div>
    </Section>
  );
}
