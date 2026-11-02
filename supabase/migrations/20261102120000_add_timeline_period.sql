-- Période affichée pour chaque étape du parcours (ex. « 2023 – 2026 »).
alter table public.timeline
  add column if not exists period text;
