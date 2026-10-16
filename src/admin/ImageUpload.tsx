import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import type { Area } from "react-easy-crop";
import { cropAndCompressImage, uploadImageBlob } from "../lib/storage";
import ImageCropper from "./ImageCropper";
import { btnGhost } from "./ui";

export default function ImageUpload({
  value,
  onChange,
  folder,
  aspect = "aspect-video",
  cropAspect = 16 / 9,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  aspect?: string;
  cropAspect?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const pendingUrl = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<{ file: File; url: string } | null>(
    null,
  );

  useEffect(
    () => () => {
      if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
    },
    [],
  );

  const clearPending = () => {
    if (pendingUrl.current) URL.revokeObjectURL(pendingUrl.current);
    pendingUrl.current = null;
    setPending(null);
  };

  const onFile = (file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      if (input.current) input.current.value = "";
      return;
    }
    clearPending();
    const url = URL.createObjectURL(file);
    pendingUrl.current = url;
    setPending({ file, url });
  };

  const handleValidate = async (area: Area) => {
    if (!pending) return;
    setBusy(true);
    setError("");
    try {
      const blob = await cropAndCompressImage(pending.file, area);
      onChange(await uploadImageBlob(blob, folder));
      clearPending();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Échec de l'envoi.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const handleCancel = () => {
    clearPending();
    if (input.current) input.current.value = "";
  };

  return (
    <>
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
            onChange={(event) => onFile(event.target.files?.[0])}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Recadre l'image, puis elle sera réduite (1600 px max) et convertie en
          WebP.
        </p>
        {error && <p className="mt-2 text-sm text-accent">{error}</p>}
      </div>
      {pending && (
        <ImageCropper
          src={pending.url}
          aspect={cropAspect}
          busy={busy}
          error={error}
          onCancel={handleCancel}
          onValidate={handleValidate}
        />
      )}
    </>
  );
}
