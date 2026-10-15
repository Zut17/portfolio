import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { SkillRow } from "../lib/db";
import type { SkillCategory } from "../types";
import { useRows } from "./useRows";
import { btnPrimary, inputClass } from "./ui";

const categories: { key: SkillCategory; label: string }[] = [
  { key: "backend", label: "Backend et données" },
  { key: "frontend", label: "Frontend" },
  { key: "desktop", label: "Applications de bureau" },
  { key: "tools", label: "Outils" },
];

export default function SkillsAdmin() {
  const { rows, loading, error, setError, load, nextOrder, swap, remove } =
    useRows<SkillRow>("skills");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SkillCategory>("backend");
  const [adding, setAdding] = useState(false);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    setError("");
    try {
      const { error: insertError } = await supabase
        .from("skills")
        .insert({ name: name.trim(), category, sort_order: nextOrder });
      if (insertError) setError(insertError.message);
      else setName("");
      await load();
    } catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Impossible d'ajouter cette compétence.",
      );
    } finally {
      setAdding(false);
    }
  };

  const rename = async (skill: SkillRow, value: string) => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === skill.name) return;
    setError("");
    try {
      const { error: updateError } = await supabase
        .from("skills")
        .update({ name: trimmed })
        .eq("id", skill.id);
      if (updateError) setError(updateError.message);
      await load();
    } catch (renameError) {
      setError(
        renameError instanceof Error
          ? renameError.message
          : "Impossible de modifier cette compétence.",
      );
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Compétences</h1>
      <p className="mt-1 text-muted">
        Modifie un nom directement dans sa case, puis clique ailleurs pour
        enregistrer.
      </p>

      <form onSubmit={add} className="mt-6 flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nouvelle compétence"
          className={`${inputClass} max-w-xs`}
        />
        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as SkillCategory)
          }
          className={`${inputClass} max-w-xs`}
        >
          {categories.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={adding} className={btnPrimary}>
          <Plus size={16} /> {adding ? "Ajout…" : "Ajouter"}
        </button>
      </form>

      {error && (
        <p className="mt-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-muted">Chargement…</p>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {categories.map((item) => {
            const list = rows.filter((row) => row.category === item.key);
            return (
              <section
                key={item.key}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h2 className="mb-4 font-display text-lg font-semibold text-primary">
                  {item.label}
                </h2>
                {list.length === 0 && (
                  <p className="text-sm text-muted">Aucune compétence.</p>
                )}
                <ul className="space-y-2">
                  {list.map((skill, index) => (
                    <li key={skill.id} className="flex items-center gap-2">
                      <input
                        key={`${skill.id}-${skill.name}`}
                        defaultValue={skill.name}
                        onBlur={(event) => void rename(skill, event.target.value)}
                        aria-label={`Nom de la compétence ${skill.name}`}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const previous = list[index - 1];
                          if (previous) void swap(skill, previous);
                        }}
                        disabled={index === 0}
                        aria-label="Monter"
                        className="rounded-lg p-2 text-muted transition hover:text-primary disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = list[index + 1];
                          if (next) void swap(skill, next);
                        }}
                        disabled={index === list.length - 1}
                        aria-label="Descendre"
                        className="rounded-lg p-2 text-muted transition hover:text-primary disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(skill.id)}
                        aria-label={`Supprimer ${skill.name}`}
                        className="rounded-lg p-2 text-muted transition hover:text-accent"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
