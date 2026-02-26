import { useState, useEffect, useRef, useCallback } from "react";
import { useViewport } from "@/hooks/useViewport";
import {
  DEVICE_PRESETS,
  TAILWIND_BREAKPOINTS,
  MULTI_PREVIEW_WIDTHS,
  getActiveBreakpoint,
  getOrientation,
  getPresetName,
  isValidUrl,
} from "@/lib/breakpoints";
import { CopyButton } from "@/components/CopyButton";
import { toast } from "@/hooks/use-toast";
import {
  RotateCw,
  Link as LinkIcon,
  RotateCcw,
  Camera,
  Loader2,
  AlertTriangle,
  Columns2,
  Square,
  Code2,
  Globe,
} from "lucide-react";

type InputMode = "url" | "html";

export default function ResponsivePlaygroundTool() {
  const vp = useViewport();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [multiMode, setMultiMode] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("html");
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [srcdoc, setSrcdoc] = useState(DEFAULT_HTML);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const urlValid = vp.url.trim() === "" || isValidUrl(vp.url);
  const breakpoint = getActiveBreakpoint(vp.width);
  const orientation = getOrientation(vp.width, vp.height);
  const presetName = getPresetName(vp.width, vp.height);

  const loadUrl = useCallback(() => {
    if (!isValidUrl(vp.url)) {
      toast({ title: "Invalid URL", description: "Please enter a valid http(s) URL.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setError(false);
    setActiveUrl(vp.url);
    setSrcdoc("");
  }, [vp.url]);

  const applyHtml = useCallback(() => {
    setActiveUrl("");
    setError(false);
    setSrcdoc(htmlCode);
  }, [htmlCode]);

  // Auto-apply HTML on change (debounced)
  useEffect(() => {
    if (inputMode !== "html") return;
    const t = setTimeout(() => {
      setActiveUrl("");
      setError(false);
      setSrcdoc(htmlCode);
    }, 400);
    return () => clearTimeout(t);
  }, [htmlCode, inputMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx !== -1) {
        e.preventDefault();
        vp.applyPreset(idx);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [vp.applyPreset]);

  const handleScreenshot = useCallback(async () => {
    toast({ title: "Screenshot", description: `Viewport ${vp.width}×${vp.height} — use browser DevTools screenshot for cross-origin iframes.` });
  }, [vp.width, vp.height]);

  const renderIframe = (width: number, height?: number) => {
    const h = height ?? vp.height;
    const useSrcdoc = inputMode === "html" || (!activeUrl && srcdoc);
    return (
      <div className="relative inline-block" style={{ width, maxWidth: "100%" }}>
        {/* Breakpoint overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-card/80 backdrop-blur-sm border-b border-border px-3 py-1">
          <span className="font-mono text-[11px] text-muted-foreground">
            {width}×{h}
          </span>
          <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">
            {getActiveBreakpoint(width)}
          </span>
        </div>

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/60">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-card/90 px-6 text-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <span className="text-sm font-medium text-destructive">Refused to connect</span>
            <span className="text-xs text-muted-foreground max-w-xs">
              This site blocks iframe embedding. Try the <strong>HTML mode</strong> instead, or use a site like <span className="font-mono text-foreground">example.com</span>
            </span>
          </div>
        )}

        <iframe
          ref={!multiMode ? iframeRef : undefined}
          src={useSrcdoc ? undefined : (activeUrl || "about:blank")}
          srcDoc={useSrcdoc ? srcdoc : undefined}
          className="rounded-lg border border-border bg-card"
          style={{ width, height: h, maxWidth: "100%" }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title={`Preview ${width}×${h}`}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle + input */}
      <div className="space-y-3">
        {/* Mode tabs */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1 w-fit">
          <button
            onClick={() => setInputMode("html")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              inputMode === "html" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" /> HTML
          </button>
          <button
            onClick={() => setInputMode("url")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              inputMode === "url" ? "bg-card text-card-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-3.5 w-3.5" /> URL
          </button>
        </div>

        {inputMode === "url" ? (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={vp.url}
                onChange={(e) => vp.setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadUrl()}
                placeholder="https://example.com"
                className={`h-10 w-full rounded-lg border pl-10 pr-4 font-mono text-sm bg-code text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  !urlValid ? "border-destructive" : "border-border"
                }`}
              />
            </div>
            <button
              onClick={loadUrl}
              className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Load
            </button>
          </div>
        ) : (
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            spellCheck={false}
            placeholder="Paste HTML/CSS here…"
            className="h-48 w-full resize-y rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {DEVICE_PRESETS.map((d, i) => (
          <button
            key={d.label}
            onClick={() => vp.applyPreset(i)}
            title={`${d.label} (${d.width}×${d.height}) — ⌘${i + 1}`}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              vp.width === d.width && vp.height === d.height
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            <span>{d.icon}</span> {d.label}
          </button>
        ))}

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-muted-foreground">W</label>
          <input
            type="number"
            value={vp.width}
            onChange={(e) => vp.setWidth(Number(e.target.value))}
            className="h-8 w-20 rounded-md border border-border bg-code px-2 font-mono text-sm text-code-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <span className="text-xs text-muted-foreground">×</span>
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-muted-foreground">H</label>
          <input
            type="number"
            value={vp.height}
            onChange={(e) => vp.setHeight(Number(e.target.value))}
            className="h-8 w-20 rounded-md border border-border bg-code px-2 font-mono text-sm text-code-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={vp.toggleAspectRatio}
          title="Lock aspect ratio"
          className={`rounded-md border p-1.5 text-xs transition-colors ${
            vp.maintainAspectRatio
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          🔗
        </button>

        <button
          onClick={vp.rotate}
          title="Rotate (swap W↔H)"
          className="rounded-md border border-border bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        <div className="h-5 w-px bg-border" />

        <button
          onClick={() => setMultiMode(!multiMode)}
          title={multiMode ? "Single view" : "Multi-preview (3 breakpoints)"}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            multiMode
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          {multiMode ? <Columns2 className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
          {multiMode ? "Multi" : "Single"}
        </button>

        <button
          onClick={handleScreenshot}
          title="Screenshot info"
          className="rounded-md border border-border bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>

        <CopyButton text={`${vp.width}×${vp.height}`} />

        <button
          onClick={vp.reset}
          title="Reset viewport"
          className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Debug info panel */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-2.5">
        <InfoItem label="Size" value={`${vp.width} × ${vp.height}`} />
        <InfoItem label="Orientation" value={orientation} />
        <InfoItem label="Breakpoint" value={breakpoint} highlight />
        {presetName && <InfoItem label="Device" value={presetName} />}
        <InfoItem label="Mode" value={inputMode === "html" ? "HTML" : "URL"} />
        <div className="ml-auto flex gap-2">
          {TAILWIND_BREAKPOINTS.map((bp) => (
            <span
              key={bp.label}
              className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium transition-colors ${
                bp.label === breakpoint
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground/40"
              }`}
            >
              {bp.label}
            </span>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="overflow-auto rounded-xl border border-border bg-muted/30 p-6">
        {multiMode ? (
          <div className="flex items-start gap-6 overflow-x-auto pb-2">
            {MULTI_PREVIEW_WIDTHS.map((w) => (
              <div key={w} className="shrink-0">
                {renderIframe(w, Math.round(w * (vp.height / vp.width) || 600))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            {renderIframe(vp.width, vp.height)}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-muted-foreground">{label}:</span>
      <span className={`font-mono text-xs font-medium ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; padding: 2rem; background: #0f172a; color: #e2e8f0; }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    p { color: #94a3b8; line-height: 1.6; margin-bottom: 1rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; }
    .badge { display: inline-block; background: #0ea5e9; color: #0f172a; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
    @media (max-width: 640px) {
      body { padding: 1rem; }
      h1 { font-size: 1.25rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Responsive</span>
    <h1 style="margin-top: 1rem;">Hello, Playground 👋</h1>
    <div class="card">
      <p>This is a live HTML preview. Edit the code on the left and watch it update in real-time across different breakpoints.</p>
      <p>Try switching between Mobile, Tablet, and Desktop presets!</p>
    </div>
    <p style="font-size: 0.875rem; color: #64748b;">Resize me → I respond to viewport changes.</p>
  </div>
</body>
</html>`;
