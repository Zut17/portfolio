import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { removeImage } from "../lib/storage";
import type { ProjectRow, ProjectStatus } from "../lib/db";
import ImageUpload from "./ImageUpload";
import { btnGhost, btnPrimary, Field, inputClass } from "./ui";

const statusLabels: Record<ProjectStatus, string> = {
  in_progress: "En cours",
  deploying: "Déploiement en cours",
  personal: "Projet personnel",
};

const emptyProject = (order: number): ProjectRow => ({
  id: "",
  slug: "",
  title: "",
  summary_fr: "",
  summary_en: "",
  role_fr: "",
  role_en: "",
  status: "in_progress",
  tech_stack: [],
  demo_url: null,
  repo_url: null,
  cover_url: null,
  sort_order: order,
  published: true,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProjectsAdmin() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<ProjectRow | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order");
    if (error) setError(error.message);
    else setRows(data as ProjectRow[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const nextOrder = rows.length
    ? Math.max(...rows.map((row) => row.sort_order)) + 1
    : 0;

  const move = async (index: number, direction: -1 | 1) => {
    const current = rows[index];
    const neighbor = rows[index + direction];
    if (!current || !neighbor) return;

    const [first, second] = await Promise.all([
      supabase
        .from("projects")
        .update({ sort_order: neighbor.sort_order })
        .eq("id", current.id),
      supabase
        .from("projects")
        .update({ sort_order: current.sort_order })
        .eq("id", neighbor.id),
    ]);
    const operationError = first.error ?? second.error;
    if (operationError) setError(operationError.message);
    await load();
  };

  const togglePublished = async (project: ProjectRow) => {
    const { error } = await supabase
      .from("projects")
      .update({ published: !project.published })
      .eq("id", project.id);
    if (error) setError(error.message);
    await load();
  };

  const remove = async (project: ProjectRow) => {
    if (
      !window.confirm(
        `Supprimer « ${project.title} » ? Cette action est définitive.`,
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);
    if (error) {
      setError(error.message);
      return;
    }

    try {
      await removeImage(project.cover_url);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Projet supprimé, mais l'image n'a pas pu être supprimée : ${e.message}`
          : "Projet supprimé, mais l'image n'a pas pu être supprimée.",
      );
    }
    await load();
  };

  if (editing) {
    return (
      <ProjectForm
        initial={editing}
        onClose={() => setEditing(null)}
        onSaved={(warning) => {
          setEditing(null);
          setError(warning ?? "");
          load();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Projets</h1>
          <p className="mt-1 text-muted">
            Ajoute, modifie, réordonne ou masque tes projets.
          </p>
        </div>
        <button
          onClick={() => setEditing(emptyProject(nextOrder))}
          className={btnPrimary}
        >
          <Plus size={16} /> Nouveau projet
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
        <p className="mt-8 text-muted">Aucun projet pour l'instant.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((project, index) => (
            <li
              key={project.id}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 ${
                project.published ? "" : "opacity-60"
              }`}
            >
              <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-background">
                {project.cover_url ? (
                  <img
                    src={project.cover_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-primary/25 to-accent/25 font-display text-xl font-bold">
                    {project.title.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-semibold">
                  {project.title}
                  {!project.published && (
                    <span className="ml-2 text-xs font-normal text-muted">
                      (masqué)
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">
                  {statusLabels[project.status]}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Monter"
                  className="rounded-lg p-2 text-muted transition hover:text-primary disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                  aria-label="Descendre"
                  className="rounded-lg p-2 text-muted transition hover:text-primary disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => togglePublished(project)}
                  aria-label={project.published ? "Masquer" : "Publier"}
                  className="rounded-lg p-2 text-muted transition hover:text-primary"
                >
                  {project.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => setEditing(project)}
                  aria-label="Modifier"
                  className="rounded-lg p-2 text-muted transition hover:text-primary"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => remove(project)}
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

function ProjectForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: ProjectRow;
  onClose: () => void;
  onSaved: (warning?: string) => void;
}) {
  const isNew = !initial.id;
  const [form, setForm] = useState<ProjectRow>(initial);
  const [techText, setTechText] = useState(initial.tech_stack.join(", "));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = <K extends keyof ProjectRow>(key: K, value: ProjectRow[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErr("");

    const payload = {
      slug: form.slug.trim() || slugify(form.title),
      title: form.title.trim(),
      summary_fr: form.summary_fr,
      summary_en: form.summary_en,
      role_fr: form.role_fr,
      role_en: form.role_en,
      status: form.status,
      tech_stack: techText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      demo_url: form.demo_url?.trim() || null,
      repo_url: form.repo_url?.trim() || null,
      cover_url: form.cover_url,
      sort_order: form.sort_order,
      published: form.published,
    };

    const { error } = isNew
      ? await supabase.from("projects").insert(payload)
      : await supabase.from("projects").update(payload).eq("id", form.id);

    if (error) {
      setErr(
        error.code === "23505"
          ? "Ce slug existe déjà : choisis-en un autre."
          : error.message,
      );
      setSaving(false);
      return;
    }

    let warning: string | undefined;
    if (initial.cover_url && initial.cover_url !== form.cover_url) {
      try {
        await removeImage(initial.cover_url);
      } catch (e) {
        warning =
          e instanceof Error
            ? `Projet enregistré, mais l'ancienne image n'a pas pu être supprimée : ${e.message}`
            : "Projet enregistré, mais l'ancienne image n'a pas pu être supprimée.";
      }
    }
    setSaving(false);
    onSaved(warning);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">
          {isNew ? "Nouveau projet" : "Modifier le projet"}
        </h1>
      </div>

      <Field label="Titre">
        <input
          required
          value={form.title}
          onChange={(event) => {
            set("title", event.target.value);
            if (!slugTouched) set("slug", slugify(event.target.value));
          }}
          className={inputClass}
        />
      </Field>

      <Field
        label="Slug"
        hint="Identifiant unique (lettres minuscules, chiffres et tirets)."
      >
        <input
          required
          value={form.slug}
          onChange={(event) => {
            setSlugTouched(true);
            set("slug", slugify(event.target.value));
          }}
          className={inputClass}
        />
      </Field>

      <Field label="Image d'affiche">
        <ImageUpload
          value={form.cover_url}
          onChange={(url) => set("cover_url", url)}
          folder="projects"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Rôle (français)">
          <input
            value={form.role_fr}
            onChange={(event) => set("role_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Rôle (anglais)">
          <input
            value={form.role_en}
            onChange={(event) => set("role_en", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Résumé (français)">
          <textarea
            rows={5}
            value={form.summary_fr}
            onChange={(event) => set("summary_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Résumé (anglais)">
          <textarea
            rows={5}
            value={form.summary_en}
            onChange={(event) => set("summary_en", event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Statut">
          <select
            value={form.status}
            onChange={(event) =>
              set("status", event.target.value as ProjectStatus)
            }
            className={inputClass}
          >
            {(Object.keys(statusLabels) as ProjectStatus[]).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Technologies" hint="Sépare-les par des virgules.">
          <input
            value={techText}
            onChange={(event) => setTechText(event.target.value)}
            className={inputClass}
            placeholder="React, TypeScript, PostgreSQL"
          />
        </Field>
        <Field label="Lien du code (GitHub)">
          <input
            type="url"
            value={form.repo_url ?? ""}
            onChange={(event) => set("repo_url", event.target.value)}
            className={inputClass}
            placeholder="https://github.com/..."
          />
        </Field>
        <Field label="Lien de démonstration">
          <input
            type="url"
            value={form.demo_url ?? ""}
            onChange={(event) => set("demo_url", event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) => set("published", event.target.checked)}
          className="h-4 w-4 accent-[dodgerblue]"
        />
        Publié sur le site
      </label>

      {err && (
        <p className="rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
          {err}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className={btnGhost}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
