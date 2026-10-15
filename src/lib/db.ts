import type { SkillCategory } from "../types";

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