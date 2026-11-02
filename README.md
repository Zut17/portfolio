# Portfolio — Henry William Zuteu
 
Portfolio personnel bilingue français/anglais, construit avec React, TypeScript, Vite, Tailwind CSS, Framer Motion et Supabase.
 
## Fonctionnalités
 
- pages publiques `/fr` et `/en` ;
- thème clair/sombre avec respect de `prefers-reduced-motion` ;
- contenu éditable depuis l’espace admin ;
- authentification Supabase et contrôle `is_admin` ;
- projets, compétences, parcours, services et messages ;
- validation locale du contact, fallback `mailto:` sans Supabase ;
- métadonnées SEO, canonical, hreflang, Open Graph, JSON-LD et sitemap ;
- headers de sécurité Vercel et pipeline CI lint/typecheck/build.
 
## Installation
 
```bash
npm ci
cp .env.example .env.local
npm run dev

Renseigner ensuite VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SITE_URL et VITE_ADMIN_PATH. Ne jamais committer .env.local ni aucun mot de passe.

Scripts
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview

Supabase et sécurité
Le frontend utilise uniquement la clé publishable/anon. La protection réelle doit être assurée par Supabase : activer RLS sur toutes les tables, autoriser uniquement la lecture publique du contenu publié, limiter les insertions publiques de messages et réserver toutes les opérations d’administration à la fonction is_admin().

Le honeypot et la validation du formulaire améliorent l’UX mais ne remplacent pas une protection serveur. En production, ajouter une Edge Function avec rate limiting et, si nécessaire, CAPTCHA ou email transactionnel.

Les fichiers CV/photo sont gérés depuis l’administration. Aucun bouton CV n’est affiché tant qu’aucun fichier n’a été configuré ; cela évite les liens cassés.

SEO et déploiement
Remplacer https://example.com dans public/sitemap.xml et public/robots.txt par le domaine réel, ou générer ces fichiers dans le pipeline de déploiement. Définir VITE_SITE_URL avec la même origine.

Le projet est prévu pour Vercel. Vérifier les règles RLS, les politiques Storage, les variables d’environnement Preview/Production et les sauvegardes Supabase avant publication.
