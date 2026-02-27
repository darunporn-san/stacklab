import { useState, useMemo } from "react";
import { createDefaultConfig, type RuleConfig } from "@/lib/regexRuleConfig";
import { generateRegex, explainRegex, detectConflicts } from "@/lib/regexGenerator";
import { CharacterSetSection } from "@/components/regex/CharacterSetConfig";
import { StructuralRulesSection } from "@/components/regex/StructuralRulesSection";
import { LengthConstraintsSection } from "@/components/regex/LengthConstraintsSection";
import { PatternSegmentsSection } from "@/components/regex/PatternSegmentsSection";
import { LiveTestPanel } from "@/components/regex/LiveTestPanel";
import { CodeExportSection } from "@/components/regex/CodeExportSection";
import { PresetSelector } from "@/components/regex/PresetSelector";
import { CopyButton } from "@/components/CopyButton";
import { AlertTriangle, Lightbulb } from "lucide-react";

export default function RegexRuleBuilder() {
  const [config, setConfig] = useState<RuleConfig>(createDefaultConfig());
  const [testInput, setTestInput] = useState("");

  const pattern = useMemo(() => generateRegex(config), [config]);
  const explanations = useMemo(() => explainRegex(pattern), [pattern]);
  const conflicts = useMemo(() => detectConflicts(config), [config]);

  const updateCharSet = (charSet: RuleConfig["charSet"]) => setConfig((c) => ({ ...c, charSet }));
  const updateStructural = (structural: RuleConfig["structural"]) => setConfig((c) => ({ ...c, structural }));
  const updateLength = (length: RuleConfig["length"]) => setConfig((c) => ({ ...c, length }));
  const updateSegments = (segments: RuleConfig["segments"]) => setConfig((c) => ({ ...c, segments }));
  const toggleSegments = (useSegments: boolean) => setConfig((c) => ({ ...c, useSegments }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Rule Builder */}
      <div className="space-y-5">
        <PresetSelector onSelect={setConfig} />

        <div className="rounded-xl border border-border bg-card p-4 space-y-5">
          <PatternSegmentsSection
            segments={config.segments}
            useSegments={config.useSegments}
            onToggle={toggleSegments}
            onChange={updateSegments}
          />

          {!config.useSegments && (
            <>
              <div className="border-t border-border pt-4">
                <CharacterSetSection config={config.charSet} onChange={updateCharSet} />
              </div>
              <div className="border-t border-border pt-4">
                <StructuralRulesSection config={config.structural} onChange={updateStructural} />
              </div>
              <div className="border-t border-border pt-4">
                <LengthConstraintsSection config={config.length} onChange={updateLength} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Preview + Test */}
      <div className="space-y-5">
        {/* Generated Pattern */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Generated Pattern</h3>
            <CopyButton text={pattern} />
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 font-mono text-sm text-primary break-all">
            {pattern}
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
              {explanations.map((ex, i) => (
                <div key={i} className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs text-foreground">{ex}</div>
              ))}
            </div>
          )}
        </div>

        {/* Live Test */}
        <div className="rounded-xl border border-border bg-card p-4">
          <LiveTestPanel pattern={pattern} testInput={testInput} onTestInputChange={setTestInput} />
        </div>

        {/* Code Export */}
        <div className="rounded-xl border border-border bg-card p-4">
          <CodeExportSection pattern={pattern} />
        </div>

        {/* JSON Config Export */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Rule Config (JSON)</h3>
            <CopyButton text={JSON.stringify(config, null, 2)} />
          </div>
          <pre className="overflow-auto rounded-lg bg-code p-3 font-mono text-xs text-code-foreground max-h-40">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
