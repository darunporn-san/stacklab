import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { type TokenStatus } from "@/lib/jwtDecode";

interface TokenInputProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  status: TokenStatus | null;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  valid: { label: "VALID", className: "bg-success/15 text-success border-success/30" },
  "near-expiry": { label: "NEAR EXPIRY", className: "bg-[hsl(40,80%,50%)]/15 text-[hsl(40,80%,45%)] border-[hsl(40,80%,50%)]/30" },
  expired: { label: "EXPIRED", className: "bg-destructive/15 text-destructive border-destructive/30" },
  malformed: { label: "MALFORMED", className: "bg-destructive/15 text-destructive border-destructive/30" },
  "no-expiry": { label: "NO EXPIRY", className: "bg-muted text-muted-foreground border-border" },
};

export function TokenInput({ value, onChange, onClear, status }: TokenInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") ref.current?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const badge = status ? STATUS_BADGE[status] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground">JWT Token</label>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${badge.className}`}>
              {badge.label}
            </span>
          )}
          {value && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-xs text-secondary-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JWT token here… (Ctrl+Enter to focus)"
        className="h-28 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        spellCheck={false}
      />
    </div>
  );
}
