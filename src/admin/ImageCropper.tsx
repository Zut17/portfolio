import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { btnGhost, btnPrimary } from "./ui";

export default function ImageCropper({
  src,
  aspect,
  busy = false,
  error,
  onCancel,
  onValidate,
}: {
  src: string;
  aspect: number;
  busy?: boolean;
  error?: string;
  onCancel: () => void;
  onValidate: (area: Area) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setArea(pixels);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 p-4">
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-black">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="mt-4 space-y-3 rounded-2xl bg-card p-4">
        <label className="flex items-center gap-3 text-sm">
          <span className="w-16 text-muted">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="flex-1 accent-[dodgerblue]"
          />
        </label>
        {error && <p className="text-sm text-accent">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={btnGhost}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => area && onValidate(area)}
            disabled={!area || busy}
            className={btnPrimary}
          >
            {busy ? "Envoi…" : "Valider le cadrage"}
          </button>
        </div>
      </div>
    </div>
  );
}
