-- =====================================================================
-- Nouvelles sections du portfolio (toutes éditables depuis l'admin)
-- - profil : accroche, téléphone, centres d'intérêt, langues, ambition
-- - parcours : statut (obtenu / en cours)
-- - projets : catégorie (filtres web / mobile / desktop / jeu / autre)
-- - tables certifications et goals (objectifs)
-- Idempotente : peut être rejouée sans erreur.
-- =====================================================================

begin;

-- ---------- Profil ----------
alter table public.profile
  add column if not exists tagline_fr   text,
  add column if not exists tagline_en   text,
  add column if not exists phone        text,
  add column if not exists interests_fr text,
  add column if not exists interests_en text,
  -- [{ "name_fr": "Français", "name_en": "French", "level_fr": "Langue maternelle", "level_en": "Native" }]
  add column if not exists languages    jsonb not null default '[]'::jsonb,
  add column if not exists goal_fr      text,
  add column if not exists goal_en      text;

-- ---------- Parcours ----------
alter table public.timeline
  add column if not exists status text not null default 'done';
alter table public.timeline drop constraint if exists timeline_status_check;
alter table public.timeline
  add constraint timeline_status_check check (status in ('done', 'in_progress'));

-- ---------- Projets ----------
alter table public.projects
  add column if not exists category text not null default 'web';
alter table public.projects drop constraint if exists projects_category_check;
alter table public.projects
  add constraint projects_category_check
  check (category in ('web', 'mobile', 'desktop', 'game', 'other'));

-- ---------- Certifications ----------
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issuer         text not null default '',
  issued_on      text not null default '',      -- ex. « Octobre 2026 »
  description_fr text not null default '',
  description_en text not null default '',
  image_url      text,
  verify_url     text,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ---------- Objectifs ----------
create table if not exists public.goals (
  id             uuid primary key default gen_random_uuid(),
  horizon        text not null default 'next'
                 check (horizon in ('past', 'now', 'next')),
  label_fr       text not null default '',      -- ex. « 2026 », « Aujourd'hui », « Demain »
  label_en       text not null default '',
  title_fr       text not null default '',
  title_en       text not null default '',
  description_fr text not null default '',
  description_en text not null default '',
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ---------- RLS : lecture publique, écriture admin ----------
alter table public.certifications enable row level security;
alter table public.goals          enable row level security;

drop policy if exists certifications_read  on public.certifications;
drop policy if exists certifications_admin on public.certifications;
drop policy if exists goals_read           on public.goals;
drop policy if exists goals_admin          on public.goals;

create policy certifications_read  on public.certifications for select to anon, authenticated using (true);
create policy certifications_admin on public.certifications for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy goals_read           on public.goals          for select to anon, authenticated using (true);
create policy goals_admin          on public.goals          for all    to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.certifications, public.goals to anon, authenticated;
grant insert, update, delete on public.certifications, public.goals to authenticated;

commit;
