import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link2, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import Section from "./Section";
import { contact } from "../data/contact";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary";

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
    <Section id="contact" index="05" title={t("contact.title")}>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="mb-6 text-muted">{t("contact.intro")}</p>
          <ul className="space-y-4">
            {links.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="flex items-center gap-3 transition hover:text-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-accent">
                    <Icon size={18} />
                  </span>
                  {label}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-accent">
                <MapPin size={18} />
              </span>
              {contact.location}
            </li>
          </ul>
        </div>

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
            className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Send size={16} /> {t("contact.send")}
          </button>
        </form>
      </div>
    </Section>
  );
}
