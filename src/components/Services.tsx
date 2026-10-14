import { useTranslation } from "react-i18next";
import { Globe, LayoutDashboard, Monitor } from "lucide-react";
import Section from "./Section";
import { useLocalized } from "../hooks/useLocalized";
import { services } from "../data/services";

const icons = { web: Globe, odoo: LayoutDashboard, desktop: Monitor };

export default function Services() {
  const { t } = useTranslation();
  const l = useLocalized();

  return (
    <Section id="services" title={t("services.title")}>
      <p className="mb-10 max-w-2xl text-muted">{t("services.intro")}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => {
          const Icon = icons[s.icon];
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} />
              </span>
              <h3 className="mb-2 text-lg font-semibold">{l(s.title)}</h3>
              <p className="text-muted">{l(s.description)}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
