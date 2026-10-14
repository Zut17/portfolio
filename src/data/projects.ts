import type { Project } from "../types";

export const projects: Project[] = [
  {
    slug: "camlait-dashboard",
    title: "Camlait Dashboard",
    summary: {
      fr: "Module Odoo 15 Community de tableau de bord décisionnel de 28 indicateurs (Achats, Ventes, Stock, Maintenance) pour Camlait Cameroun, réalisé en solo lors de mon stage chez Zygnixis SARL.",
      en: "Odoo 15 Community decision-making dashboard module with 28 indicators (Purchasing, Sales, Inventory, Maintenance) for Camlait Cameroun, built solo during my internship at Zygnixis SARL.",
    },
    role: { fr: "Développeur unique", en: "Sole developer" },
    status: "deploying",
    techStack: ["Python / ORM", "OWL", "XML", "Chart.js", "PostgreSQL", "Git / Jira"],
  },
  {
    slug: "algocraft",
    title: "AlgoCraft",
    summary: {
      fr: "Compilateur et exécuteur de pseudo-code, similaire à Algobox, développé en équipe.",
      en: "Pseudo-code compiler and runner, similar to Algobox, developed as a team.",
    },
    role: { fr: "Équipe de 5 développeurs", en: "Team of 5 developers" },
    status: "in_progress",
    techStack: ["C# / .NET", "Windows Forms"],
  },
  {
    slug: "churchtools",
    title: "ChurchTools",
    summary: {
      fr: "Application de gestion des chants d'église : catalogue, recherche et organisation des morceaux pour les répétitions et les cultes.",
      en: "Church song management app: catalog, search and organization of songs for rehearsals and services.",
    },
    role: { fr: "Développement en autonomie", en: "Independent development" },
    status: "personal",
    techStack: [],
  },
];
