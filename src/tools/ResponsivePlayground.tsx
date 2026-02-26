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
  Monitor,
  RotateCcw,
  Camera,
  Loader2,
  AlertTriangle,
  Columns2,
  Square,
} from "lucide-react";

export default function ResponsivePlaygroundTool() {
  const vp = useViewport();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [multiMode, setMultiMode] = useState(false);
  const [activeUrl, setActiveUrl] = useState("");
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
  }, [vp.url]);

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
              This site blocks iframe embedding via X-Frame-Options or CSP headers. Try a different URL like <span className="font-mono text-foreground">example.com</span>
            </span>
          </div>
        )}

        <iframe
          ref={!multiMode ? iframeRef : undefined}
          src={activeUrl || "about:blank"}
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
      {/* URL bar */}
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

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Device presets */}
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

        {/* Width / Height */}
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

        {/* Aspect ratio lock */}
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

        {/* Rotate */}
        <button
          onClick={vp.rotate}
          title="Rotate (swap W↔H)"
          className="rounded-md border border-border bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>

        <div className="h-5 w-px bg-border" />

        {/* Multi / Single toggle */}
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

        {/* Screenshot hint */}
        <button
          onClick={handleScreenshot}
          title="Screenshot info"
          className="rounded-md border border-border bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>

        {/* Copy viewport */}
        <CopyButton text={`${vp.width}×${vp.height}`} />

        {/* Reset */}
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
