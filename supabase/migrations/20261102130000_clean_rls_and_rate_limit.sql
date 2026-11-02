-- =====================================================================
-- Nettoyage des politiques RLS + limitation du formulaire de contact
-- ---------------------------------------------------------------------
-- Problèmes corrigés :
-- 1. messages : la politique « envoi public » (WITH CHECK true) annulait
--    la validation de « messages_insert » (les politiques permissives se
--    cumulent par OU) : n'importe qui pouvait insérer n'importe quoi.
-- 2. Doublons : 2 à 4 politiques identiques par table (admin, *_admin,
--    lecture publique, *_read…). On repart d'un jeu unique et lisible.
-- 3. Storage : la lecture publique de storage.objects permettait de
--    LISTER tout le bucket. Un bucket public sert déjà ses fichiers par
--    URL publique sans politique SELECT ; seule l'admin peut lister.
-- 4. Contact : limitation de débit côté serveur (par IP et globale) et
--    colonnes protégées (read, created_at) forcées à l'insertion.
--
-- Prérequis : la fonction public.is_admin() existe déjà (inchangée ici).
-- Migration idempotente : peut être rejouée sans erreur.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Suppression de toutes les anciennes politiques
-- ---------------------------------------------------------------------
drop policy if exists messages_admin   on public.messages;
drop policy if exists messages_insert  on public.messages;
drop policy if exists admin            on public.messages;
drop policy if exists "envoi public"   on public.messages;

drop policy if exists profile_read       on public.profile;
drop policy if exists profile_admin      on public.profile;
drop policy if exists admin              on public.profile;
drop policy if exists "lecture publique" on public.profile;

drop policy if exists projects_read      on public.projects;
drop policy if exists projects_admin     on public.projects;
drop policy if exists admin              on public.projects;
drop policy if exists "lecture publique" on public.projects;

drop policy if exists services_read      on public.services;
drop policy if exists services_admin     on public.services;
drop policy if exists admin              on public.services;
drop policy if exists "lecture publique" on public.services;

drop policy if exists skills_read        on public.skills;
drop policy if exists skills_admin       on public.skills;
drop policy if exists admin              on public.skills;
drop policy if exists "lecture publique" on public.skills;

drop policy if exists timeline_read      on public.timeline;
drop policy if exists timeline_admin     on public.timeline;
drop policy if exists admin              on public.timeline;
drop policy if exists "lecture publique" on public.timeline;

drop policy if exists "admin ajout de fichiers"         on storage.objects;
drop policy if exists "admin modification de fichiers"  on storage.objects;
drop policy if exists "admin suppression de fichiers"   on storage.objects;
drop policy if exists "lecture publique des fichiers"   on storage.objects;
drop policy if exists portfolio_admin_insert            on storage.objects;
drop policy if exists portfolio_admin_update            on storage.objects;
drop policy if exists portfolio_admin_delete            on storage.objects;
drop policy if exists portfolio_admin_select            on storage.objects;

-- ---------------------------------------------------------------------
-- 2. RLS activée partout (déjà le cas, rappel explicite)
-- ---------------------------------------------------------------------
alter table public.admins   enable row level security;
alter table public.profile  enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.skills   enable row level security;
alter table public.timeline enable row level security;
alter table public.messages enable row level security;
-- public.admins : aucune politique => inaccessible via l'API.
-- Seule is_admin() (SECURITY DEFINER) la lit.

-- ---------------------------------------------------------------------
-- 3. Contenu public : lecture pour tous, écriture admin uniquement
-- ---------------------------------------------------------------------
create policy profile_read  on public.profile  for select to anon, authenticated using (true);
create policy profile_admin on public.profile  for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy projects_read  on public.projects for select to anon, authenticated using (published or public.is_admin());
create policy projects_admin on public.projects for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy services_read  on public.services for select to anon, authenticated using (true);
create policy services_admin on public.services for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy skills_read  on public.skills for select to anon, authenticated using (true);
create policy skills_admin on public.skills for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy timeline_read  on public.timeline for select to anon, authenticated using (true);
create policy timeline_admin on public.timeline for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. Messages : insertion publique validée, lecture/gestion admin
-- ---------------------------------------------------------------------
create policy messages_insert on public.messages
  for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 2 and 200
    and char_length(btrim(content)) between 10 and 5000
    and char_length(email) <= 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

create policy messages_admin on public.messages
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Empreinte de l'IP (hachée, jamais stockée en clair) pour la limitation.
alter table public.messages add column if not exists ip_hash text;
create index if not exists messages_ip_hash_created_idx
  on public.messages (ip_hash, created_at desc);
create index if not exists messages_created_idx
  on public.messages (created_at desc);

create or replace function public.messages_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  headers json;
  client_ip text;
  recent_from_ip int;
  recent_total int;
begin
  -- L'admin n'est pas limité.
  if public.is_admin() then
    return new;
  end if;

  -- Colonnes que le visiteur ne doit pas pouvoir choisir.
  new.read := false;
  new.created_at := now();
  new.name := btrim(new.name);
  new.email := lower(btrim(new.email));
  new.content := btrim(new.content);

  -- IP du client transmise par l'API Supabase (en-têtes de la requête).
  begin
    headers := current_setting('request.headers', true)::json;
  exception when others then
    headers := null;
  end;
  client_ip := split_part(
    coalesce(headers ->> 'cf-connecting-ip', headers ->> 'x-forwarded-for', 'inconnue'),
    ',', 1);
  new.ip_hash := encode(extensions.digest(btrim(client_ip), 'sha256'), 'hex');

  -- Au plus 3 messages par IP sur 15 minutes.
  select count(*) into recent_from_ip
  from public.messages
  where ip_hash = new.ip_hash
    and created_at > now() - interval '15 minutes';
  if recent_from_ip >= 3 then
    raise exception 'Trop de messages envoyés. Réessayez plus tard.'
      using errcode = 'P0001';
  end if;

  -- Garde-fou global : au plus 30 messages par heure, toutes IP confondues.
  select count(*) into recent_total
  from public.messages
  where created_at > now() - interval '1 hour';
  if recent_total >= 30 then
    raise exception 'Service de contact temporairement saturé.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.messages_before_insert() from public, anon, authenticated;

drop trigger if exists messages_before_insert on public.messages;
create trigger messages_before_insert
  before insert on public.messages
  for each row execute function public.messages_before_insert();

-- ---------------------------------------------------------------------
-- 5. Storage (bucket « portfolio ») : écriture et listage admin seulement
--    Les fichiers restent visibles par leur URL publique.
-- ---------------------------------------------------------------------
create policy portfolio_admin_select on storage.objects
  for select to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

create policy portfolio_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_admin());

create policy portfolio_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

create policy portfolio_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_admin());

commit;
