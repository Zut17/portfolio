import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useRows } from "./useRows";
import ImageUpload from "./ImageUpload";
import { SortableItem, SortableList } from "./SortableList";
import {
  btnGhost,
  btnPrimary,
  ConfirmDialog,
  Field,
  inputClass,
} from "./ui";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "url" | "image";
  options?: { value: string; label: string }[];
  hint?: string;
  /** Champ obligatoire (texte non vide). */
  required?: boolean;
  /** Occupe toute la largeur du formulaire. */
  full?: boolean;
  /** Dossier de stockage et ratio de recadrage (type « image »). */
  folder?: string;
  cropAspect?: number;
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
  const { rows, loading, error, load, nextOrder, reorder, remove } =
    useRows<Row>(table);
  const [editing, setEditing] = useState<Row | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [rowToDelete, setRowToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const set = (key: string, value: string | null) =>
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
      const value = editing[field.key];
      if (field.type === "image" || field.type === "url") {
        // Champs facultatifs : chaîne vide => null.
        payload[field.key] = typeof value === "string" && value.trim() ? value.trim() : null;
      } else {
        payload[field.key] = typeof value === "string" ? value.trim() : value ?? "";
      }
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

  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;
    setDeleting(true);
    try {
      await remove(rowToDelete.id);
    } finally {
      setDeleting(false);
      setRowToDelete(null);
    }
  };

  if (editing) {
    return (
      <form onSubmit={save} className="max-w-3xl space-y-6">
        <h1 className="font-display text-3xl font-bold">
          {editing.id ? "Modifier" : newLabel}
        </h1>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className={field.full || field.type === "image" ? "md:col-span-2" : undefined}>
            <Field label={field.label} hint={field.hint}>
              {field.type === "image" ? (
                <div className="max-w-sm">
                  <ImageUpload
                    value={(editing[field.key] as string | null) ?? null}
                    onChange={(url) => set(field.key, url)}
                    folder={field.folder ?? "misc"}
                    aspect="aspect-[4/3]"
                    cropAspect={field.cropAspect}
                  />
                </div>
              ) : field.type === "textarea" ? (
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
                  type={field.type === "url" ? "url" : "text"}
                  required={field.required}
                  value={String(editing[field.key] ?? "")}
                  onChange={(event) => set(field.key, event.target.value)}
                  className={inputClass}
                />
              )}
            </Field>
            </div>
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
        <SortableList
          ids={rows.map((row) => row.id)}
          onReorder={(from, to) => void reorder(from, to)}
        >
          <ul className="mt-8 space-y-3">
            {rows.map((row) => (
              <SortableItem key={row.id} id={row.id}>
                {(handle) => (
                  <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
                    {handle}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg font-semibold">
                        {primary(row)}
                      </p>
                      <p className="truncate text-sm text-muted">
                        {secondary(row)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
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
                        onClick={() => setRowToDelete(row)}
                        aria-label="Supprimer"
                        className="rounded-lg p-2 text-muted transition hover:text-accent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </SortableItem>
            ))}
          </ul>
        </SortableList>
      )}
      <ConfirmDialog
        open={!!rowToDelete}
        title="Supprimer cet élément ?"
        message={
          <>
            <strong className="text-foreground">
              {rowToDelete && primary(rowToDelete)}
            </strong>{" "}
            sera définitivement supprimé. Cette action est irréversible.
          </>
        }
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRowToDelete(null)}
      />
    </div>
  );
}
