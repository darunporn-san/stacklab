import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check, Search } from "lucide-react";
import { KNOWN_CLAIMS } from "@/lib/jwtDecode";
import { toast } from "@/hooks/use-toast";

interface PayloadViewerProps {
  data: Record<string, unknown>;
  title?: string;
}

function ClaimValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <span className="flex flex-wrap gap-1">
        {value.map((v, i) => (
          <span key={i} className="inline-flex rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary">
            {String(v)}
          </span>
        ))}
      </span>
    );
  }
  if (typeof value === "boolean") {
    return <span className={`font-mono ${value ? "text-success" : "text-destructive"}`}>{String(value)}</span>;
  }
  if (typeof value === "object" && value !== null) {
    return <span className="font-mono text-muted-foreground">{JSON.stringify(value)}</span>;
  }
  return <span className="font-mono">{String(value)}</span>;
}

function CopyClaimButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted">
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
    </button>
  );
}

export function PayloadViewer({ data, title = "Payload" }: PayloadViewerProps) {
  const [expanded, setExpanded] = useState(true);
  const [rawView, setRawView] = useState(false);
  const [search, setSearch] = useState("");

  const jsonStr = JSON.stringify(data, null, 2);
  const entries = Object.entries(data);
  const filtered = search
    ? entries.filter(([k, v]) =>
        k.toLowerCase().includes(search.toLowerCase()) ||
        String(v).toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const copyAll = async () => {
    await navigator.clipboard.writeText(jsonStr);
    toast({ title: "Copied", description: `${title} copied to clipboard` });
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-muted/50 px-3 py-2 border-b border-border">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          {title}
          <span className="text-xs text-muted-foreground ml-1">({entries.length} claims)</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setRawView(!rawView)} className="text-[10px] px-2 py-0.5 rounded border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
            {rawView ? "Tree" : "Raw"}
          </button>
          <button onClick={copyAll} className="text-[10px] px-2 py-0.5 rounded border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors flex items-center gap-1">
            <Copy className="h-2.5 w-2.5" /> Copy
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-code">
          {!rawView && (
            <div className="px-3 py-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search claims..."
                  className="w-full pl-7 pr-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {rawView ? (
            <pre className="p-4 font-mono text-xs text-code-foreground overflow-auto max-h-96">{jsonStr}</pre>
          ) : (
            <div className="divide-y divide-border/50 max-h-96 overflow-auto">
              {filtered.map(([key, value]) => {
                const isKnown = KNOWN_CLAIMS.has(key);
                return (
                  <div key={key} className="group flex items-start gap-3 px-3 py-2 hover:bg-muted/30 transition-colors">
                    <span className={`font-mono text-xs shrink-0 ${isKnown ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                      {key}
                    </span>
                    <span className="text-xs flex-1 min-w-0 break-all">
                      <ClaimValue value={value} />
                    </span>
                    <CopyClaimButton value={typeof value === "object" ? JSON.stringify(value) : String(value)} />
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">No matching claims</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
