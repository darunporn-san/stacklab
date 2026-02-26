import { useState, useCallback, useMemo, useEffect } from "react";
import { FileDropZone } from "../components/FileDropZone";
import { CodeBlock } from "../components/CodeBlock";
import { CopyButton } from "../components/CopyButton";
import {
  convertImage,
  ConvertResult,
  ImageFormat,
  formatBytes,
  htmlImgSnippet,
  cssBackgroundSnippet,
  nextImageSnippet,
} from "../lib/imageConverter";
import { Download, X, Loader2, Image as ImageIcon } from "lucide-react";

const FORMATS: ImageFormat[] = ["webp", "png", "jpeg"];
const SNIPPET_TABS = ["HTML <img>", "CSS background", "Next.js <Image>"] as const;
type SnippetTab = (typeof SNIPPET_TABS)[number];

export default function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [format, setFormat] = useState<ImageFormat>("webp");
  const [quality, setQuality] = useState(0.8);
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [maintainAR, setMaintainAR] = useState(true);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [snippetTab, setSnippetTab] = useState<SnippetTab>("HTML <img>");

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setPreview("");
    setResult(null);
    setWidth("");
    setHeight("");
  }, []);

  // Auto-convert with debounce
  useEffect(() => {
    if (!file) return;
    setProcessing(true);
    const id = setTimeout(async () => {
      try {
        const r = await convertImage(file, {
          width: width || undefined,
          height: height || undefined,
          maintainAspectRatio: maintainAR,
          format,
          quality,
        });
        setResult(r);
      } catch {
        setResult(null);
      } finally {
        setProcessing(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [file, width, height, maintainAR, format, quality]);

  const downloadFile = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result, format]);

  const snippet = useMemo(() => {
    if (!result) return "";
    switch (snippetTab) {
      case "HTML <img>": return htmlImgSnippet(result.dataUrl.slice(0, 80) + "…", result.width, result.height);
      case "CSS background": return cssBackgroundSnippet(result.dataUrl.slice(0, 80) + "…");
      case "Next.js <Image>": return nextImageSnippet("/path/to/image." + format, result.width, result.height);
    }
  }, [result, snippetTab, format]);

  const reduction = file && result
    ? Math.round(((file.size - result.size) / file.size) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Upload or preview */}
      {!file ? (
        <FileDropZone accept="image/*" onFile={handleFile}>
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
        </FileDropZone>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {file.name} ({formatBytes(file.size)})
            </span>
            <button onClick={clear} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" /> Clear
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Preview */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-muted-foreground">Preview</span>
              <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-center">
                <img
                  src={result?.dataUrl || preview}
                  alt="preview"
                  className="max-h-64 max-w-full object-contain"
                />
              </div>
              {result && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{result.width} × {result.height}</span>
                  <span>{formatBytes(result.size)}</span>
                  <span className={reduction > 0 ? "text-success" : "text-destructive"}>
                    {reduction > 0 ? `${reduction}% smaller` : `${Math.abs(reduction)}% larger`}
                  </span>
                  {processing && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <span className="text-xs font-medium text-muted-foreground">Settings</span>

              {/* Format */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Format</label>
                <div className="flex gap-1 rounded-lg bg-secondary p-1">
                  {FORMATS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        format === f ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              {format !== "png" && (
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Quality: {Math.round(quality * 100)}%</label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}

              {/* Resize */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : "")}
                    placeholder="auto"
                    className="h-8 w-full rounded-md border border-border bg-code px-2 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                    placeholder="auto"
                    className="h-8 w-full rounded-md border border-border bg-code px-2 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={maintainAR} onChange={() => setMaintainAR((v) => !v)} className="h-4 w-4 rounded border-border bg-code accent-primary" />
                <span className="text-sm text-muted-foreground">Maintain aspect ratio</span>
              </label>

              {/* Actions */}
              {result && (
                <div className="flex gap-2">
                  <button onClick={downloadFile} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted">
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  <CopyButton text={result.base64} className="" />
                </div>
              )}
            </div>
          </div>

          {/* Snippets + Base64 */}
          {result && (
            <div className="space-y-3">
              {/* Snippet tabs */}
              <div className="flex gap-1 rounded-lg bg-secondary p-1">
                {SNIPPET_TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSnippetTab(t)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      snippetTab === t ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <CodeBlock code={snippet} label={snippetTab} />

              {/* Data URL */}
              <div className="rounded-lg border border-border bg-code">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground">Data URL</span>
                  <CopyButton text={result.dataUrl} />
                </div>
                <pre className="overflow-auto p-4 font-mono text-xs text-code-foreground max-h-24 break-all">
                  {result.dataUrl.slice(0, 500)}{result.dataUrl.length > 500 ? "…" : ""}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
