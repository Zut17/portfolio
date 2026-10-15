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
    <Section id="services" index="04" title={t("services.title")}>
      <p className="mb-8 max-w-2xl text-lg text-muted">
        {t("services.intro")}
      </p>
      <div className="grid auto-rows-fr gap-5 md:grid-cols-3">
        {services.map((service) => {
          const Icon = icons[service.icon];
          return (
            <SpotlightCard key={service.id} className="p-6">
              <div className="flex min-h-44 gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-accent/10 text-accent">
                  <Icon size={24} />
                </span>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {l(service.title)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {l(service.description)}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </Section>
  );
}
