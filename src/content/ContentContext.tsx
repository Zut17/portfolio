import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabaseConfigured } from "../lib/supabaseConfig";
import type {
  CertificationRow,
  GoalRow,
  ProfileRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
  TimelineRow,
} from "../lib/db";
import type {
  Certification,
  Goal,
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
  certifications: Certification[];
  goals: Goal[];
}

const emptyLocalized = { fr: "", en: "" };

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
    tagline: emptyLocalized,
    phone: "",
    interests: emptyLocalized,
    languages: [],
    goal: emptyLocalized,
  },
  projects: localProjects,
  skills: localSkills,
  timeline: localTimeline,
  services: localServices,
  certifications: [],
  goals: [],
};

const text = (value: string | null | undefined) => value ?? "";

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
  email: text(row.email),
  whatsapp: text(row.whatsapp),
  linkedin: text(row.linkedin),
  github: text(row.github),
  location: text(row.location),
  photoUrl: row.photo_url,
  cvUrl: { fr: text(row.cv_url_fr), en: text(row.cv_url_en) },
  tagline: { fr: text(row.tagline_fr), en: text(row.tagline_en) },
  phone: text(row.phone),
  interests: { fr: text(row.interests_fr), en: text(row.interests_en) },
  languages: Array.isArray(row.languages)
    ? row.languages
        .filter((language) => language && (language.name_fr || language.name_en))
        .map((language) => ({
          name: { fr: text(language.name_fr), en: text(language.name_en) || text(language.name_fr) },
          level: { fr: text(language.level_fr), en: text(language.level_en) || text(language.level_fr) },
        }))
    : [],
  goal: { fr: text(row.goal_fr), en: text(row.goal_en) },
});

const toProject = (row: ProjectRow): Project => ({
  slug: row.slug,
  title: row.title,
  summary: { fr: row.summary_fr, en: row.summary_en },
  role: { fr: row.role_fr, en: row.role_en },
  status: row.status,
  category: row.category ?? "web",
  techStack: row.tech_stack ?? [],
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
  status: row.status === "in_progress" ? "in_progress" : "done",
  title: { fr: row.title_fr, en: row.title_en },
  organization: row.organization,
  period: row.period ?? undefined,
  description: { fr: row.description_fr, en: row.description_en },
});

const toService = (row: ServiceRow): Service => ({
  id: row.id,
  icon: row.icon,
  title: { fr: row.title_fr, en: row.title_en },
  description: { fr: row.description_fr, en: row.description_en },
});

const toCertification = (row: CertificationRow): Certification => ({
  id: row.id,
  title: row.title,
  issuer: row.issuer,
  issuedOn: row.issued_on,
  description: { fr: row.description_fr, en: row.description_en },
  imageUrl: row.image_url ?? undefined,
  verifyUrl: row.verify_url ?? undefined,
});

const toGoal = (row: GoalRow): Goal => ({
  id: row.id,
  horizon: row.horizon,
  label: { fr: row.label_fr, en: row.label_en || row.label_fr },
  title: { fr: row.title_fr, en: row.title_en || row.title_fr },
  description: { fr: row.description_fr, en: row.description_en || row.description_fr },
});

async function fetchContent(): Promise<Content | null> {
  if (!supabaseConfigured) return null;

  try {
    const { supabase } = await import("../lib/supabase");
    const ordered = (table: string) => supabase.from(table).select("*").order("sort_order");
    const [profileResult, projectsResult, skillsResult, timelineResult, servicesResult, certificationsResult, goalsResult] =
      await Promise.all([
        supabase.from("profile").select("*").eq("id", 1).maybeSingle(),
        supabase.from("projects").select("*").eq("published", true).order("sort_order"),
        ordered("skills"),
        ordered("timeline"),
        ordered("services"),
        ordered("certifications"),
        ordered("goals"),
      ]);

    // Les tables principales sont indispensables ; certifications et objectifs
    // sont facultatifs (migration éventuellement pas encore appliquée).
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
    const certificationRows = (certificationsResult.error ? [] : certificationsResult.data ?? []) as CertificationRow[];
    const goalRows = (goalsResult.error ? [] : goalsResult.data ?? []) as GoalRow[];

    if (!profileRow && projectRows.length === 0 && skillRows.length === 0) {
      return null;
    }

    return {
      profile: profileRow ? toProfile(profileRow) : fallback.profile,
      projects: projectRows.map(toProject),
      skills: skillRows.map(toSkill),
      timeline: timelineRows.map(toTimeline),
      services: serviceRows.map(toService),
      certifications: certificationRows.map(toCertification),
      goals: goalRows.map(toGoal),
    };
  } catch {
    return null;
  }
}

const CACHE_KEY = "portfolio-content-v3";

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

    void fetchContent().then((nextContent) => {
      if (!nextContent || cancelled) return;
      setContent(nextContent);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(nextContent));
      } catch {
        // Le cache est facultatif.
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
