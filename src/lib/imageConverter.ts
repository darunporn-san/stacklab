export type ImageFormat = "webp" | "png" | "jpeg";

export interface ConvertOptions {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  format: ImageFormat;
  quality: number; // 0-1
}

export interface ConvertResult {
  dataUrl: string;
  base64: string;
  blob: Blob;
  width: number;
  height: number;
  size: number;
}

export async function convertImage(
  file: File,
  opts: ConvertOptions
): Promise<ConvertResult> {
  const img = await loadImage(file);
  let targetW = opts.width || img.naturalWidth;
  let targetH = opts.height || img.naturalHeight;

  if (opts.maintainAspectRatio) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (opts.width && !opts.height) {
      targetH = Math.round(targetW / ratio);
    } else if (opts.height && !opts.width) {
      targetW = Math.round(targetH * ratio);
    } else if (opts.width && opts.height) {
      // fit within box
      const scaleW = targetW / img.naturalWidth;
      const scaleH = targetH / img.naturalHeight;
      const scale = Math.min(scaleW, scaleH);
      targetW = Math.round(img.naturalWidth * scale);
      targetH = Math.round(img.naturalHeight * scale);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const mimeType = `image/${opts.format}`;
  const quality = opts.format === "png" ? undefined : opts.quality;

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const base64 = dataUrl.split(",")[1];

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b!), mimeType, quality);
  });

  return { dataUrl, base64, blob, width: targetW, height: targetH, size: blob.size };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function htmlImgSnippet(dataUrl: string, w: number, h: number): string {
  return `<img src="${dataUrl}" width="${w}" height="${h}" alt="" />`;
}

export function cssBackgroundSnippet(dataUrl: string): string {
  return `background-image: url('${dataUrl}');\nbackground-size: cover;\nbackground-position: center;`;
}

export function nextImageSnippet(src: string, w: number, h: number): string {
  return `<Image\n  src="${src}"\n  width={${w}}\n  height={${h}}\n  alt=""\n/>`;
}
