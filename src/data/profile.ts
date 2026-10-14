import type { Localized, TimelineItem } from "../types";

export const bio: Localized = {
  fr: "Étudiant en 3e année de Bachelor Concepteur Développeur Web Full Stack à l'IUC de Douala, je conçois des applications web, mobiles et de bureau. Lors de mon stage chez Zygnixis SARL, j'ai réalisé seul un tableau de bord décisionnel pour Camlait Cameroun.",
  en: "A third-year Full Stack Web Developer Bachelor student at IUC in Douala, I design web, mobile and desktop applications. During my internship at Zygnixis SARL, I built a decision-making dashboard for Camlait Cameroun on my own.",
};

export const timeline: TimelineItem[] = [
  {
    kind: "education",
    title: {
      fr: "Bachelor Concepteur Développeur Web Full Stack (3e année)",
      en: "Bachelor in Full Stack Web Development (3rd year)",
    },
    organization: "Institut Universitaire de la Côte (IUC), Douala",
    description: {
      fr: "Formation en conception et développement d'applications web et mobiles.",
      en: "Training in designing and developing web and mobile applications.",
    },
  },
  {
    kind: "work",
    title: { fr: "Stage académique", en: "Academic internship" },
    organization: "Zygnixis SARL",
    description: {
      fr: "Intégrateur Odoo au Cameroun. Développement du module Camlait_Dashboard pour le client Camlait Cameroun.",
      en: "Odoo integrator in Cameroon. Development of the Camlait_Dashboard module for the client Camlait Cameroun.",
    },
  },
  {
    kind: "education",
    title: { fr: "DEC", en: "DEC" },
    organization: "Institut Universitaire de la Côte (IUC), Douala",
    description: { fr: "Diplôme obtenu.", en: "Diploma obtained." },
  },
];
