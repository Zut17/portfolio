import { supabase } from "./supabase";

const BUCKET = "portfolio";

export async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.82,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  try {
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Traitement d'image indisponible.");
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Conversion impossible.")),
        "image/webp",
        quality,
      ),
    );
  } finally {
    bitmap.close();
  }
}

export async function cropAndCompressImage(
  file: File,
  crop: { x: number; y: number; width: number; height: number },
  maxWidth = 1600,
  quality = 0.82,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  try {
    const x = Math.round(crop.x);
    const y = Math.round(crop.y);
    const width = Math.round(crop.width);
    const height = Math.round(crop.height);
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0 ||
      x < 0 ||
      y < 0 ||
      x + width > bitmap.width ||
      y + height > bitmap.height
    ) {
      throw new Error("Zone de recadrage invalide.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Traitement d'image indisponible.");

    ctx.drawImage(bitmap, x, y, width, height, 0, 0, width, height);

    let output = canvas;
    if (canvas.width > maxWidth) {
      const scale = maxWidth / canvas.width;
      const resized = document.createElement("canvas");
      resized.width = Math.round(canvas.width * scale);
      resized.height = Math.round(canvas.height * scale);
      const resizedContext = resized.getContext("2d");
      if (!resizedContext) throw new Error("Traitement d'image indisponible.");
      resizedContext.drawImage(canvas, 0, 0, resized.width, resized.height);
      output = resized;
    }

    return await new Promise((resolve, reject) =>
      output.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Conversion impossible.")),
        "image/webp",
        quality,
      ),
    );
  } finally {
    bitmap.close();
  }
}

export async function uploadImageBlob(
  blob: Blob,
  folder: string,
): Promise<string> {
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }

  const blob = await compressImage(file);
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function removeImage(url?: string | null): Promise<void> {
  if (!url) return;

  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = decodeURIComponent(url.slice(index + marker.length));
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function uploadPdf(file: File, folder: string): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("Le fichier doit être un PDF.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Le PDF dépasse 5 Mo.");
  }

  const path = `${folder}/${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: "application/pdf",
    cacheControl: "31536000",
  });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
