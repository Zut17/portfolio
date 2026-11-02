export type Localized = { fr: string; en: string };

export type ProjectStatus = "in_progress" | "deploying" | "personal";

export const PROJECT_CATEGORIES = ["web", "mobile", "desktop", "game", "other"] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface Project {
  slug: string;
  title: string;
  summary: Localized;
  role: Localized;
  status: ProjectStatus;
  category: ProjectCategory;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  cover?: string;
}

export type SkillCategory = "backend" | "frontend" | "desktop" | "tools";

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface TimelineItem {
  kind: "education" | "work";
  title: Localized;
  organization: string;
  /** Période libre, ex. « 2023 – 2026 » ou « juin – août 2026 ». */
  period?: string;
  status: "done" | "in_progress";
  description: Localized;
}

export interface Service {
  id: string;
  icon: "web" | "odoo" | "desktop";
  title: Localized;
  description: Localized;
}

export interface ProfileData {
  fullName: string;
  title: Localized;
  bio: Localized;
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  location: string;
  photoUrl: string | null;
  cvUrl: Localized;
  tagline: Localized;
  phone: string;
  interests: Localized;
  languages: Language[];
  goal: Localized;
}

export interface Language {
  name: Localized;
  level: Localized;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuedOn: string;
  description: Localized;
  imageUrl?: string;
  verifyUrl?: string;
}

export type GoalHorizon = "past" | "now" | "next";

export interface Goal {
  id: string;
  horizon: GoalHorizon;
  label: Localized;
  title: Localized;
  description: Localized;
}