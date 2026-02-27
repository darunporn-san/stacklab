import { useState, useMemo } from "react";
import { createDefaultConfig, type RuleConfig } from "@/lib/regexRuleConfig";
import { generateRegex, explainRegex, detectConflicts, computeComplexity } from "@/lib/regexGenerator";
import { CharacterSetSection } from "@/components/regex/CharacterSetConfig";
import { StructuralRulesSection } from "@/components/regex/StructuralRulesSection";
import { LengthConstraintsSection } from "@/components/regex/LengthConstraintsSection";
import { PatternSegmentsSection } from "@/components/regex/PatternSegmentsSection";
import { LiveTestPanel } from "@/components/regex/LiveTestPanel";
import { CodeExportSection } from "@/components/regex/CodeExportSection";
import { PresetSelector } from "@/components/regex/PresetSelector";
import { CopyButton } from "@/components/CopyButton";
import { AlertTriangle, Lightbulb, Upload, Shield } from "lucide-react";
import { toast } from "sonner";

export default function RegexRuleBuilder() {
  const [config, setConfig] = useState<RuleConfig>(createDefaultConfig());
  const [testInput, setTestInput] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");

  const pattern = useMemo(() => generateRegex(config), [config]);
  const explanations = useMemo(() => explainRegex(pattern), [pattern]);
  const conflicts = useMemo(() => detectConflicts(config), [config]);
  const complexity = useMemo(() => computeComplexity(config), [config]);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      setConfig(parsed);
      setShowImport(false);
      setImportJson("");
      toast.success("Rule config imported successfully");
    } catch {
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Rule Builder */}
      <div className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1"><PresetSelector onSelect={setConfig} /></div>
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors"
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
        </div>

        {showImport && (
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste rule config JSON..."
              className="h-24 w-full resize-none rounded-md border border-border bg-code p-2 font-mono text-xs text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
            <button onClick={handleImport} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Apply Config
            </button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <PatternSegmentsSection
            segments={config.segments}
            useSegments={config.useSegments}
            onToggle={(v) => setConfig((c) => ({ ...c, useSegments: v }))}
            onChange={(segments) => setConfig((c) => ({ ...c, segments }))}
          />

          {!config.useSegments && (
            <>
              <div className="border-t border-border pt-3">
                <CharacterSetSection config={config.charSet} onChange={(charSet) => setConfig((c) => ({ ...c, charSet }))} />
              </div>
              <div className="border-t border-border pt-3">
                <StructuralRulesSection config={config.structural} onChange={(structural) => setConfig((c) => ({ ...c, structural }))} />
              </div>
              <div className="border-t border-border pt-3">
                <LengthConstraintsSection config={config.length} onChange={(length) => setConfig((c) => ({ ...c, length }))} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Preview + Test */}
      <div className="space-y-4">
        {/* Generated Pattern */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Generated Pattern</h3>
            <CopyButton text={pattern} />
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 font-mono text-sm text-primary break-all">
            {pattern}
          </div>

          {/* Complexity + Strength */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Complexity:</span>
              <span className={`text-xs font-semibold ${complexity.color}`}>{complexity.label}</span>
              <span className="text-xs text-muted-foreground">({complexity.score})</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(100, complexity.score)}%` }}
              />
            </div>
          </div>

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <div className="space-y-1">
              {conflicts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> {c}
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          {explanations.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" /> Pattern Breakdown
              </div>
              <div className="max-h-32 overflow-auto space-y-1">
                {explanations.map((ex, i) => (
                  <div key={i} className="rounded-md bg-muted/50 px-3 py-1 font-mono text-[11px] text-foreground">{ex}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Test */}
        <div className="rounded-xl border border-border bg-card p-4">
          <LiveTestPanel pattern={pattern} config={config} testInput={testInput} onTestInputChange={setTestInput} />
        </div>

        {/* Code Export */}
        <div className="rounded-xl border border-border bg-card p-4">
          <CodeExportSection pattern={pattern} />
        </div>

        {/* JSON Config */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Rule Config (JSON)</h3>
            <CopyButton text={JSON.stringify(config, null, 2)} />
          </div>
          <pre className="overflow-auto rounded-lg bg-code p-3 font-mono text-[11px] text-code-foreground max-h-32">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
