import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { uploadImage } from "../lib/storage";
import { btnGhost } from "./ui";

export default function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-video",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, folder));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-card ${aspect}`}
      >
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-muted">Aucune image</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className={btnGhost}
        >
          <ImagePlus size={14} />{" "}
          {busy ? "Envoi…" : value ? "Remplacer" : "Choisir une image"}
        </button>
        {value && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChange(null)}
            className={btnGhost}
          >
            <Trash2 size={14} /> Retirer
          </button>
        )}
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        L'image est automatiquement réduite (1600 px max) et convertie en WebP.
      </p>
      {error && <p className="mt-2 text-sm text-accent">{error}</p>}
    </div>
  );
}
