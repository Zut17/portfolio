# Portfolio — Henry William Zuteu

Portfolio bilingue français/anglais (React, TypeScript, Vite, Tailwind CSS, Framer Motion, Supabase), composé de **deux applications** issues du même dépôt :

| Application | Entrée | Sortie | Rôle |
|---|---|---|---|
| Site public | `index.html` → `src/main.tsx` | `dist/` | Pages `/fr` et `/en`, aucun code d'administration |
| Administration | `admin/index.html` → `src/admin/main.tsx` | `dist-admin/` | Gestion du contenu, connexion + double authentification |

## Installation

```bash
npm ci
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev          # site public  → http://localhost:5173
npm run dev:admin    # administration → http://localhost:5174
```

## Scripts

| Commande | Effet |
|---|---|
| `npm run build` | Génère le sitemap puis construit le site public dans `dist/` |
| `npm run build:admin` | Construit l'administration dans `dist-admin/` |
| `npm run lint` / `npm run typecheck` | Qualité du code |
| `npm run preview` / `npm run preview:admin` | Prévisualisation des builds |

## Déploiement Vercel (deux projets, même dépôt)

1. **Site public** (projet existant) : réglages par défaut (`npm run build`, sortie `dist`).
2. **Administration** (nouveau projet, ex. `williamzuteuportfolio-admin`) :
   - *Build Command* : `npm run build:admin`
   - *Output Directory* : `dist-admin`
   - mêmes variables d'environnement que le site.

Les deux projets partagent `vercel.json` (réécritures SPA et en-têtes de sécurité). L'administration est en `noindex` et son `robots.txt` interdit toute indexation.

## Sécurité

- Le navigateur n'utilise que la clé *publishable* : toute la protection repose sur la **RLS Supabase** (`supabase/migrations/`).
- `is_admin()` exige un compte présent dans `public.admins` **et** une session vérifiée par code TOTP (`aal2`). Un mot de passe seul ne donne aucun droit.
- Formulaire de contact : validation en base, 3 messages / 15 min par IP et 30 / h au total (trigger `messages_before_insert`).
- Dans Supabase → Authentication : désactiver les inscriptions publiques (*Allow new users to sign up*).

## Migrations Supabase (SQL Editor, dans l'ordre)

1. `20261015130000_add_profile_cv_urls.sql`
2. `20261102120000_add_timeline_period.sql`
3. `20261102130000_clean_rls_and_rate_limit.sql`
4. `20261102140000_is_admin_require_mfa.sql` — **seulement après** avoir déployé l'administration et configuré l'application d'authentification.
5. `20261102150000_portfolio_sections.sql` — accroche, téléphone, langues, centres d'intérêt, ambition, statut du parcours, catégorie des projets, tables `certifications` et `goals`.
