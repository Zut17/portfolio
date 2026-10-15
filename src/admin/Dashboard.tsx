import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const tables = [
  { key: "projects", label: "Projets", to: "/admin/projets" },
  { key: "skills", label: "Compétences", to: "/admin/competences" },
  { key: "timeline", label: "Parcours", to: "/admin/parcours" },
  { key: "services", label: "Services", to: "/admin/services" },
] as const;

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const result: Record<string, number> = {};
      for (const t of tables) {
        const { count, error } = await supabase
          .from(t.key)
          .select("*", { count: "exact", head: true });
        if (error) {
          setError(error.message);
          return;
        }
        result[t.key] = count ?? 0;
      }
      const { count: unread } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      result.messages = unread ?? 0;
      setCounts(result);
    })();
  }, []);

  const cards = [
    ...tables.map((t) => ({ label: t.label, to: t.to, value: counts?.[t.key] })),
    { label: "Messages non lus", to: "/admin/messages", value: counts?.messages },
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
