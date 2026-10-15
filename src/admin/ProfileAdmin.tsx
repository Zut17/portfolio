import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { removeImage } from "../lib/storage";
import type { ProfileRow } from "../lib/db";
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
};

function normalizeProfile(row: ProfileRow): ProfileRow {
  return {
    ...empty,
    ...row,
    full_name: row.full_name ?? "",
    title_fr: row.title_fr ?? "",
    title_en: row.title_en ?? "",
    bio_fr: row.bio_fr ?? "",
    bio_en: row.bio_en ?? "",
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
        <Field label="Présentation (français)">
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
