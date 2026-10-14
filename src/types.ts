export type Localized = { fr: string; en: string };

export type ProjectStatus = "in_progress" | "deploying" | "personal";

export interface Project {
  slug: string;
  title: string;
  summary: Localized;
  role: Localized;
  status: ProjectStatus;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
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
  description: Localized;
}

export interface Service {
  id: string;
  icon: "web" | "odoo" | "desktop";
  title: Localized;
  description: Localized;
}