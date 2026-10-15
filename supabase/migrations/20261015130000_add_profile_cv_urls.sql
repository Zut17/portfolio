alter table public.profile
  add column if not exists cv_url_fr text,
  add column if not exists cv_url_en text;
