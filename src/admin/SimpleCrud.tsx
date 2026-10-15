import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRows } from "./useRows";
import { btnGhost, btnPrimary, Field, inputClass } from "./ui";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
}

type Row = { id: string; sort_order: number } & Record<string, unknown>;

export default function SimpleCrud({
  table,
  title,
  subtitle,
  newLabel,
  fields,
  defaults = {},
  primary,
  secondary,
}: {
  table: string;
  title: string;
  subtitle: string;
  newLabel: string;
  fields: FieldDef[];
  defaults?: Record<string, unknown>;
  primary: (row: Row) => string;
  secondary: (row: Row) => string;
}) {
  const { rows, loading, error, load, nextOrder, swap, remove } =
    useRows<Row>(table);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const set = (key: string, value: string) =>
    setEditing((previous) => (previous ? { ...previous, [key]: value } : previous));

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);
    setSaveError("");
    const payload: Record<string, unknown> = {
      sort_order: editing.sort_order,
    };
    fields.forEach((field) => {
      payload[field.key] = editing[field.key] ?? "";
    });

    try {
      const result = editing.id
        ? await supabase.from(table).update(payload).eq("id", editing.id)
        : await supabase.from(table).insert(payload);
      if (result.error) {
        setSaveError(result.error.message);
        return;
      }
      setEditing(null);
      await load();
    } catch (saveError) {
      setSaveError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer cet élément.",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = async (row: Row) => {
    if (!window.confirm(`Supprimer « ${primary(row)} » ?`)) return;
    await remove(row.id);
  };

  if (editing) {
    return (
      <form onSubmit={save} className="max-w-3xl space-y-6">
        <h1 className="font-display text-3xl font-bold">
          {editing.id ? "Modifier" : newLabel}
        </h1>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.key} label={field.label}>
              {field.type === "textarea" ? (
                <textarea
                  rows={5}
                  value={String(editing[field.key] ?? "")}
                  onChange={(event) => set(field.key, event.target.value)}
                  className={inputClass}
                />
              ) : field.type === "select" ? (
                <select
                  value={String(editing[field.key] ?? "")}
                  onChange={(event) => set(field.key, event.target.value)}
                  className={inputClass}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={String(editing[field.key] ?? "")}
                  onChange={(event) => set(field.key, event.target.value)}
                  className={inputClass}
                />
              )}
            </Field>
          ))}
        </div>
        {saveError && (
          <p className="rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
            {saveError}
          </p>
        )}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => setEditing(null)}
            className={btnGhost}
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-1 text-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            setEditing({ id: "", sort_order: nextOrder, ...defaults })
          }
          className={btnPrimary}
        >
          <Plus size={16} /> {newLabel}
        </button>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-muted">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-muted">Rien pour l'instant.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((row, index) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-semibold">
                  {primary(row)}
                </p>
                <p className="truncate text-sm text-muted">{secondary(row)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const previous = rows[index - 1];
                    if (previous) void swap(row, previous);
                  }}
                  disabled={index === 0}
                  aria-label="Monter"
                  className="rounded-lg p-2 text-muted transition hover:text-primary disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = rows[index + 1];
                    if (next) void swap(row, next);
                  }}
                  disabled={index === rows.length - 1}
                  aria-label="Descendre"
                  className="rounded-lg p-2 text-muted transition hover:text-primary disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(row)}
                  aria-label="Modifier"
                  className="rounded-lg p-2 text-muted transition hover:text-primary"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => void confirmRemove(row)}
                  aria-label="Supprimer"
                  className="rounded-lg p-2 text-muted transition hover:text-accent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
