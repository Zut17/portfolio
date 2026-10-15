import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabaseConfigured } from "../lib/supabaseConfig";
import type {
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
  TimelineRow,
} from "../lib/db";
import type {
  ProfileData,
  Project,
  Service,
  Skill,
  TimelineItem,
} from "../types";
import { projects as localProjects } from "../data/projects";
import { skills as localSkills } from "../data/skills";
import { services as localServices } from "../data/services";
import { bio as localBio, timeline as localTimeline } from "../data/profile";
import { contact as localContact } from "../data/contact";

export interface Content {
  profile: ProfileData;
  projects: Project[];
  skills: Skill[];
  timeline: TimelineItem[];
  services: Service[];
}

const fallback: Content = {
  profile: {
    fullName: "Henry William Zuteu",
    title: {
      fr: "Analyste, concepteur-développeur web et mobile full stack junior",
      en: "Junior Full Stack Web & Mobile Developer and Analyst",
    },
    bio: localBio,
    email: localContact.email,
    whatsapp: localContact.whatsapp,
    linkedin: localContact.linkedin,
    github: localContact.github,
    location: localContact.location,
    photoUrl: null,
    cvUrl: { fr: "", en: "" },
  },
  projects: localProjects,
  skills: localSkills,
  timeline: localTimeline,
  services: localServices,
};

const toProfile = (row: ProfileRow): ProfileData => ({
  fullName: row.full_name || fallback.profile.fullName,
  title: {
    fr: row.title_fr || fallback.profile.title.fr,
    en: row.title_en || fallback.profile.title.en,
  },
  bio: {
    fr: row.bio_fr || fallback.profile.bio.fr,
    en: row.bio_en || fallback.profile.bio.en,
  },
  email: row.email ?? "",
  whatsapp: row.whatsapp ?? "",
  linkedin: row.linkedin ?? "",
  github: row.github ?? "",
  location: row.location ?? "",
  photoUrl: row.photo_url,
  cvUrl: { fr: row.cv_url_fr ?? "", en: row.cv_url_en ?? "" },
});

const toProject = (row: ProjectRow): Project => ({
  slug: row.slug,
  title: row.title,
  summary: { fr: row.summary_fr, en: row.summary_en },
  role: { fr: row.role_fr, en: row.role_en },
  status: row.status,
  techStack: row.tech_stack,
  demoUrl: row.demo_url ?? undefined,
  repoUrl: row.repo_url ?? undefined,
  cover: row.cover_url ?? undefined,
});

const toSkill = (row: SkillRow): Skill => ({
  name: row.name,
  category: row.category,
});

const toTimeline = (row: TimelineRow): TimelineItem => ({
  kind: row.kind,
  title: { fr: row.title_fr, en: row.title_en },
  organization: row.organization,
  description: { fr: row.description_fr, en: row.description_en },
});

const toService = (row: ServiceRow): Service => ({
  id: row.id,
  icon: row.icon,
  title: { fr: row.title_fr, en: row.title_en },
  description: { fr: row.description_fr, en: row.description_en },
});

async function fetchContent(): Promise<Content | null> {
  if (!supabaseConfigured) return null;

  try {
    const { supabase } = await import("../lib/supabase");
    const [profileResult, projectsResult, skillsResult, timelineResult, servicesResult] =
      await Promise.all([
        supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
        supabase
          .from("projects")
          .select("*")
          .eq("published", true)
          .order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("timeline").select("*").order("sort_order"),
        supabase.from("services").select("*").order("sort_order"),
      ]);

    if (
      profileResult.error ||
      projectsResult.error ||
      skillsResult.error ||
      timelineResult.error ||
      servicesResult.error
    ) {
      return null;
    }

    const profileRow = profileResult.data as ProfileRow | null;
    const projectRows = (projectsResult.data ?? []) as ProjectRow[];
    const skillRows = (skillsResult.data ?? []) as SkillRow[];
    const timelineRows = (timelineResult.data ?? []) as TimelineRow[];
    const serviceRows = (servicesResult.data ?? []) as ServiceRow[];

    if (
      !profileRow &&
      projectRows.length === 0 &&
      skillRows.length === 0 &&
      timelineRows.length === 0 &&
      serviceRows.length === 0
    ) {
      return null;
    }

    return {
      profile: profileRow ? toProfile(profileRow) : fallback.profile,
      projects: projectRows.map(toProject),
      skills: skillRows.map(toSkill),
      timeline: timelineRows.map(toTimeline),
      services: serviceRows.map(toService),
    };
  } catch {
    return null;
  }
}

const CACHE_KEY = "portfolio-content-v2";

function readCache(): Content | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Content) : null;
  } catch {
    return null;
  }
}

const ContentContext = createContext<Content>(fallback);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>(() => readCache() ?? fallback);

  useEffect(() => {
    let cancelled = false;

    fetchContent().then((nextContent) => {
      if (!nextContent || cancelled) return;
      setContent(nextContent);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(nextContent));
      } catch {
        // Cached content is optional; the provider state remains usable.
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
