import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ADMIN } from "../lib/adminPath";

const tables = [
  { key: "projects", label: "Projets", to: `${ADMIN}/projets` },
  { key: "skills", label: "Compétences", to: `${ADMIN}/competences` },
  { key: "timeline", label: "Parcours", to: `${ADMIN}/parcours` },
  { key: "certifications", label: "Certifications", to: `${ADMIN}/certifications` },
  { key: "services", label: "Services", to: `${ADMIN}/services` },
  { key: "goals", label: "Objectifs", to: `${ADMIN}/objectifs` },
] as const;

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const result: Record<string, number> = {};
      const failures: string[] = [];
      // Requêtes en parallèle ; une table manquante n'empêche pas l'affichage des autres.
      const responses = await Promise.all(
        tables.map((t) =>
          supabase.from(t.key).select("*", { count: "exact", head: true }),
        ),
      );
      responses.forEach(({ count, error }, index) => {
        const table = tables[index];
        if (error) failures.push(`${table.label} : ${error.message}`);
        else result[table.key] = count ?? 0;
      });
      const { count: unread, error: unreadError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      if (unreadError) failures.push(`Messages : ${unreadError.message}`);
      else result.messages = unread ?? 0;
      if (failures.length) setError(failures.join(" — "));
      setCounts(result);
    })();
  }, []);

  const cards = [
    ...tables.map((t) => ({ label: t.label, to: t.to, value: counts?.[t.key] })),
    { label: "Messages non lus", to: `${ADMIN}/messages`, value: counts?.messages },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-muted">Vue d'ensemble du contenu de ton portfolio.</p>

      {error && (
        <p className="mt-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
          Erreur de lecture de la base : {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary"
          >
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-bold text-primary">
              {c.value ?? "…"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
