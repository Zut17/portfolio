-- =====================================================================
-- is_admin() exige désormais la double authentification (AAL2).
-- ---------------------------------------------------------------------
-- Un mot de passe volé ne suffit plus : sans le code TOTP, la session
-- reste en « aal1 » et toutes les politiques admin (tables + storage)
-- refusent l'accès.
--
-- ⚠ À appliquer UNIQUEMENT après avoir déployé la nouvelle application
--   d'administration ET configuré ton application d'authentification
--   (premier passage sur l'écran « Double authentification »).
--   Sinon tu ne pourras plus modifier le contenu.
--
-- Retour arrière d'urgence (SQL Editor) : réexécuter l'ancienne définition
--   select exists (select 1 from public.admins where user_id = auth.uid());
-- =====================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
    and exists (
      select 1 from public.admins a where a.user_id = auth.uid()
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
