import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/CopyButton";
import { findClosestTailwind, TailwindMatch } from "@/lib/tailwindMatcher";

export function TailwindMatcherTab() {
  const [hex, setHex] = useState("#667eea");

  const matches = useMemo(() => {
    const clean = hex.trim();
    if (!/^#[0-9a-f]{3,6}$/i.test(clean)) return [];
    return findClosestTailwind(clean);
  }, [hex]);

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">HEX Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={hex.length === 7 ? hex : "#667eea"}
            onChange={e => setHex(e.target.value)}
            className="h-9 w-9 rounded border border-border cursor-pointer"
          />
          <Input
            value={hex}
            onChange={e => setHex(e.target.value)}
            placeholder="#667eea"
            className="font-mono"
          />
        </div>
      </div>

      {/* Input preview */}
      {/^#[0-9a-f]{3,6}$/i.test(hex.trim()) && (
        <div className="h-16 rounded-lg border border-border" style={{ backgroundColor: hex }} />
      )}

      {/* Results */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Closest Tailwind Colors</h3>
          {matches.map((m, i) => (
            <MatchRow key={m.name} match={m} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchRow({ match, rank }: { match: TailwindMatch; rank: number }) {
  const className = `bg-${match.name}`;
  const usage = `<div class="${className}"></div>`;

  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-2">
      <span className="text-xs text-muted-foreground w-4">{rank}.</span>
      <div className="h-8 w-8 rounded border border-border flex-shrink-0" style={{ backgroundColor: match.hex }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono font-semibold text-foreground">{match.name}</p>
        <p className="text-xs text-muted-foreground font-mono">{match.hex}</p>
      </div>
      <span className="text-xs text-muted-foreground">Δ {match.distance.toFixed(1)}</span>
      <CopyButton text={usage} />
    </div>
  );
}
