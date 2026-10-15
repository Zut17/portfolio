import { useTranslation } from "react-i18next";
import { Globe, LayoutDashboard, Monitor } from "lucide-react";
import Section from "./Section";
import SpotlightCard from "./SpotlightCard";
import { useLocalized } from "../hooks/useLocalized";
import { useContent } from "../content/ContentContext";

const icons = { web: Globe, odoo: LayoutDashboard, desktop: Monitor };

export default function Services() {
  const { t } = useTranslation();
  const l = useLocalized();
  const { services } = useContent();

  return (
    <Section id="services" index="04" title={t("services.title")} tone="orange">
      <p className="mb-10 max-w-2xl text-lg text-muted">{t("services.intro")}</p>
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => {
          const Icon = icons[s.icon];
          return (
            <SpotlightCard key={s.id} className="p-7">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent shadow-[0_0_24px_-4px_var(--color-accent)]">
                <Icon size={22} />
              </span>
              <h3 className="mb-2 font-display text-xl font-semibold">
                {l(s.title)}
              </h3>
              <p className="text-muted">{l(s.description)}</p>
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
