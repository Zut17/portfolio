import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { uploadPdf } from "../lib/storage";
import { btnGhost } from "./ui";

export default function PdfUpload({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadPdf(file, folder));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Échec de l'envoi.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <FileText size={16} /> Voir le fichier
          </a>
        ) : (
          <span className="text-sm text-muted">Aucun fichier</span>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className={btnGhost}
        >
          <Upload size={14} />{" "}
          {busy ? "Envoi…" : value ? "Remplacer" : "Choisir un PDF"}
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
          accept="application/pdf"
          hidden
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-2 text-sm text-accent">{error}</p>}
    </div>
  );
}
