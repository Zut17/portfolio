import type { GoalHorizon, ProjectCategory, SkillCategory } from "../types";

export type ProjectStatus = "in_progress" | "deploying" | "personal";

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  summary_fr: string;
  summary_en: string;
  role_fr: string;
  role_en: string;
  status: ProjectStatus;
  category: ProjectCategory;
  tech_stack: string[];
  demo_url: string | null;
  repo_url: string | null;
  cover_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface ProfileRow {
  id: number;
  full_name: string;
  title_fr: string;
  title_en: string;
  bio_fr: string;
  bio_en: string;
  email: string | null;
  whatsapp: string | null;
  linkedin: string | null;
  github: string | null;
  location: string | null;
  photo_url: string | null;
  cv_url_fr: string | null;
  cv_url_en: string | null;
  tagline_fr: string | null;
  tagline_en: string | null;
  phone: string | null;
  interests_fr: string | null;
  interests_en: string | null;
  languages: LanguageRow[] | null;
  goal_fr: string | null;
  goal_en: string | null;
}

export interface LanguageRow {
  name_fr: string;
  name_en: string;
  level_fr: string;
  level_en: string;
}

export interface CertificationRow {
  id: string;
  title: string;
  issuer: string;
  issued_on: string;
  description_fr: string;
  description_en: string;
  image_url: string | null;
  verify_url: string | null;
  sort_order: number;
}

export interface GoalRow {
  id: string;
  horizon: GoalHorizon;
  label_fr: string;
  label_en: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  sort_order: number;
}

export interface SkillRow {
  id: string;
  name: string;
  category: SkillCategory;
  sort_order: number;
}

export interface TimelineRow {
  id: string;
  kind: "education" | "work";
  title_fr: string;
  title_en: string;
  organization: string;
  period: string | null;
  status: "done" | "in_progress" | null;
  description_fr: string;
  description_en: string;
  sort_order: number;
}

export interface ServiceRow {
  id: string;
  icon: "web" | "odoo" | "desktop";
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  sort_order: number;
}