import type { Service } from "../types";

export const services: Service[] = [
  {
    id: "web",
    icon: "web",
    title: { fr: "Développement web full stack", en: "Full stack web development" },
    description: {
      fr: "Conception et réalisation de sites et d'applications web sur mesure, du design à la mise en ligne.",
      en: "Design and development of custom websites and web applications, from design to deployment.",
    },
  },
  {
    id: "odoo",
    icon: "odoo",
    title: {
      fr: "Modules et tableaux de bord Odoo",
      en: "Odoo modules and dashboards",
    },
    description: {
      fr: "Développement de modules personnalisés et de tableaux de bord décisionnels pour Odoo Community.",
      en: "Development of custom modules and decision-making dashboards for Odoo Community.",
    },
  },
  {
    id: "desktop",
    icon: "desktop",
    title: { fr: "Applications de bureau", en: "Desktop applications" },
    description: {
      fr: "Création d'applications Windows en C# / .NET adaptées à vos besoins métier.",
      en: "Windows applications built with C# / .NET tailored to your business needs.",
    },
  },
];
