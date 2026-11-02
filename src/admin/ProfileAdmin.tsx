import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { removeImage } from "../lib/storage";
import type { LanguageRow, ProfileRow } from "../lib/db";
import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import PdfUpload from "./PdfUpload";
import { btnPrimary, Field, inputClass } from "./ui";

const empty: ProfileRow = {
  id: 1,
  full_name: "",
  title_fr: "",
  title_en: "",
  bio_fr: "",
  bio_en: "",
  email: "",
  whatsapp: "",
  linkedin: "",
  github: "",
  location: "",
  photo_url: null,
  cv_url_fr: null,
  cv_url_en: null,
  tagline_fr: "",
  tagline_en: "",
  phone: "",
  interests_fr: "",
  interests_en: "",
  languages: [],
  goal_fr: "",
  goal_en: "",
};

const emptyLanguage: LanguageRow = { name_fr: "", name_en: "", level_fr: "", level_en: "" };

function normalizeProfile(row: ProfileRow): ProfileRow {
  return {
    ...empty,
    ...row,
    full_name: row.full_name ?? "",
    title_fr: row.title_fr ?? "",
    title_en: row.title_en ?? "",
    bio_fr: row.bio_fr ?? "",
    bio_en: row.bio_en ?? "",
    languages: Array.isArray(row.languages) ? row.languages : [],
  };
}

export default function ProfileAdmin() {
  const [form, setForm] = useState<ProfileRow>(empty);
  const [saved, setSaved] = useState<ProfileRow>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (cancelled) return;
        if (queryError) {
          setError(queryError.message);
        } else if (data) {
          const profile = normalizeProfile(data as ProfileRow);
          setForm(profile);
          setSaved(profile);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de charger le profil.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const set = <K extends keyof ProfileRow>(key: K, value: ProfileRow[K]) => {
    setMessage("");
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const clean = (value: string | null) => value?.trim() || null;
    const payload = {
      id: 1,
      full_name: form.full_name.trim(),
      title_fr: form.title_fr,
      title_en: form.title_en,
      bio_fr: form.bio_fr,
      bio_en: form.bio_en,
      email: clean(form.email),
      whatsapp: clean(form.whatsapp),
      linkedin: clean(form.linkedin),
      github: clean(form.github),
      location: clean(form.location),
      photo_url: form.photo_url,
      cv_url_fr: form.cv_url_fr,
      cv_url_en: form.cv_url_en,
      tagline_fr: clean(form.tagline_fr),
      tagline_en: clean(form.tagline_en),
      phone: clean(form.phone),
      interests_fr: clean(form.interests_fr),
      interests_en: clean(form.interests_en),
      languages: (form.languages ?? [])
        .map((language) => ({
          name_fr: language.name_fr.trim(),
          name_en: language.name_en.trim(),
          level_fr: language.level_fr.trim(),
          level_en: language.level_en.trim(),
        }))
        .filter((language) => language.name_fr || language.name_en),
      goal_fr: clean(form.goal_fr),
      goal_en: clean(form.goal_en),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: saveError } = await supabase
        .from("profile")
        .upsert(payload);
      if (saveError) {
        setError(saveError.message);
        return;
      }

      const previous = saved;
      const updated = { ...form, full_name: form.full_name.trim() };
      setSaved(updated);
      setForm(updated);

      const removedMedia: string[] = [];
      for (const key of ["photo_url", "cv_url_fr", "cv_url_en"] as const) {
        if (previous[key] && previous[key] !== form[key]) {
          try {
            await removeImage(previous[key]);
          } catch (removeError) {
            removedMedia.push(
              removeError instanceof Error
                ? removeError.message
                : "Erreur inconnue",
            );
          }
        }
      }

      setMessage(
        removedMedia.length
          ? `Profil enregistré, mais un ancien fichier n'a pas pu être supprimé : ${removedMedia.join("; ")}`
          : "Profil enregistré.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer le profil.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Chargement…</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Profil</h1>
        <p className="mt-1 text-muted">
          Tes informations personnelles, affichées sur tout le site.
        </p>
      </div>

      <Field label="Nom complet">
        <input
          required
          value={form.full_name}
          onChange={(event) => set("full_name", event.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Titre (français)">
          <input
            value={form.title_fr}
            onChange={(event) => set("title_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Titre (anglais)">
          <input
            value={form.title_en}
            onChange={(event) => set("title_en", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Accroche (français)" hint="Une phrase affichée sous ton titre, en haut de page.">
          <input
            value={form.tagline_fr ?? ""}
            onChange={(event) => set("tagline_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Accroche (anglais)">
          <input
            value={form.tagline_en ?? ""}
            onChange={(event) => set("tagline_en", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Présentation (français)" hint="Texte de la section À propos.">
          <textarea
            rows={7}
            value={form.bio_fr}
            onChange={(event) => set("bio_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Présentation (anglais)">
          <textarea
            rows={7}
            value={form.bio_en}
            onChange={(event) => set("bio_en", event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Photo de profil">
        <div className="max-w-xs">
          <ImageUpload
            value={form.photo_url}
            onChange={(url) => set("photo_url", url)}
            folder="profile"
            aspect="aspect-[4/5]"
            cropAspect={4 / 5}
          />
        </div>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="CV (français, PDF)">
          <PdfUpload
            value={form.cv_url_fr}
            onChange={(url) => set("cv_url_fr", url)}
            folder="cv"
          />
        </Field>
        <Field label="CV (anglais, PDF)">
          <PdfUpload
            value={form.cv_url_en}
            onChange={(url) => set("cv_url_en", url)}
            folder="cv"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email">
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(event) => set("email", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field
          label="WhatsApp"
          hint="Format international, sans + ni espaces (ex. : 237600000000)."
        >
          <input
            value={form.whatsapp ?? ""}
            onChange={(event) => set("whatsapp", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="LinkedIn (lien complet)">
          <input
            type="url"
            value={form.linkedin ?? ""}
            onChange={(event) => set("linkedin", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="GitHub (lien complet)">
          <input
            type="url"
            value={form.github ?? ""}
            onChange={(event) => set("github", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Localisation">
          <input
            value={form.location ?? ""}
            onChange={(event) => set("location", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Téléphone" hint="Affiché tel quel (ex. : +237 6 00 00 00 00).">
          <input
            type="tel"
            value={form.phone ?? ""}
            onChange={(event) => set("phone", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Centres d'intérêt (français)">
          <input
            value={form.interests_fr ?? ""}
            onChange={(event) => set("interests_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Centres d'intérêt (anglais)">
          <input
            value={form.interests_en ?? ""}
            onChange={(event) => set("interests_en", event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset className="space-y-3 rounded-2xl border border-border p-4">
        <legend className="px-2 text-sm font-medium">Langues</legend>
        {(form.languages ?? []).length === 0 && (
          <p className="text-sm text-muted">Aucune langue pour l'instant.</p>
        )}
        {(form.languages ?? []).map((language, index) => {
          const update = (key: keyof LanguageRow, value: string) =>
            set(
              "languages",
              (form.languages ?? []).map((item, i) => (i === index ? { ...item, [key]: value } : item)),
            );
          return (
            <div key={index} className="grid items-end gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              <Field label="Langue (FR)">
                <input value={language.name_fr} onChange={(e) => update("name_fr", e.target.value)} placeholder="Français" className={inputClass} />
              </Field>
              <Field label="Langue (EN)">
                <input value={language.name_en} onChange={(e) => update("name_en", e.target.value)} placeholder="French" className={inputClass} />
              </Field>
              <Field label="Niveau (FR)">
                <input value={language.level_fr} onChange={(e) => update("level_fr", e.target.value)} placeholder="Langue maternelle, C1…" className={inputClass} />
              </Field>
              <Field label="Niveau (EN)">
                <input value={language.level_en} onChange={(e) => update("level_en", e.target.value)} placeholder="Native, C1…" className={inputClass} />
              </Field>
              <button
                type="button"
                aria-label={`Retirer la langue ${language.name_fr || index + 1}`}
                onClick={() => set("languages", (form.languages ?? []).filter((_, i) => i !== index))}
                className="mb-1 rounded-lg p-2.5 text-muted transition hover:text-accent"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => set("languages", [...(form.languages ?? []), { ...emptyLanguage }])}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition hover:border-primary"
        >
          <Plus size={14} /> Ajouter une langue
        </button>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ambition (français)" hint="Phrase d'introduction de la section Objectifs.">
          <textarea
            rows={3}
            value={form.goal_fr ?? ""}
            onChange={(event) => set("goal_fr", event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Ambition (anglais)">
          <textarea
            rows={3}
            value={form.goal_en ?? ""}
            onChange={(event) => set("goal_en", event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-primary">{message}</p>}

      <button type="submit" disabled={saving} className={btnPrimary}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
