import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Application d'administration, construite séparément du site public.
 * - Entrée : admin/index.html → src/admin/main.tsx
 * - Sortie : dist-admin/ (projet Vercel distinct)
 * Le site public (vite.config.ts) ne contient aucun code d'administration.
 */
export default defineConfig({
  root: fileURLToPath(new URL("./admin", import.meta.url)),
  envDir: fileURLToPath(new URL(".", import.meta.url)),
  publicDir: "public",
  plugins: [react(), tailwindcss()],
  server: { port: 5174 },
  preview: { port: 4174 },
  build: {
    outDir: fileURLToPath(new URL("./dist-admin", import.meta.url)),
    emptyOutDir: true,
  },
});
