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