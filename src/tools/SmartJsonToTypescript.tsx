import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/CopyButton";
import { generateOutput, defaultOptions, SAMPLE_JSON, type InferenceOptions, type AnalysisResult } from "@/lib/smartTypeInference";
import {
  Braces, CheckCircle2, XCircle, Download, Sparkles, Trash2, Play,
  FileType, Settings2, BarChart3, Code2, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyAnalysis: AnalysisResult = {
  objectsDetected: 0, arraysDetected: 0, optionalFields: 0, nullableFields: 0,
  unionTypes: 0, enumCandidates: 0, nestedInterfaces: 0, complexity: "Low",
};

export default function SmartJsonToTypescript() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult>(emptyAnalysis);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<InferenceOptions>(defaultOptions);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const { toast } = useToast();

  const generate = useCallback((text: string, opts: InferenceOptions) => {
    if (!text.trim()) { setOutput(""); setAnalysis(emptyAnalysis); setError(null); return; }
    try {
      const parsed = JSON.parse(text);
      setError(null);
      const result = generateOutput(parsed, opts);
      setOutput(result.code);
      setAnalysis(result.analysis);
    } catch (e: unknown) {
      const msg = (e as Error).message;
      const match = msg.match(/position (\d+)/);
      let detail = msg;
      if (match) {
        const pos = parseInt(match[1]);
        const before = text.slice(0, pos);
        const line = before.split("\n").length;
        const col = pos - before.lastIndexOf("\n");
        detail = `${msg} (line ${line}, col ${col})`;
      }
      setError(detail);
      setOutput("");
      setAnalysis(emptyAnalysis);
    }
  }, []);

  useEffect(() => {
    if (!autoGenerate) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => generate(input, options), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, options, autoGenerate, generate]);

  const handleGenerate = () => generate(input, options);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
      toast({ title: "Formatted" });
    } catch {
      toast({ title: "Invalid JSON", variant: "destructive" });
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setError(null);
      toast({ title: "Valid JSON ✓" });
    } catch (e: unknown) {
      setError((e as Error).message);
      toast({ title: "Invalid JSON", variant: "destructive" });
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const ext = options.generateAs === "json-schema" ? ".json" : ".ts";
    const blob = new Blob([output], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${options.rootName}${ext}`;
    a.click();
  };

  const updateOption = <K extends keyof InferenceOptions>(key: K, val: InferenceOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: val }));
  };

  const complexityColor = useMemo(() => {
    switch (analysis.complexity) {
      case "Low": return "bg-green-500/15 text-green-700 dark:text-green-400";
      case "Medium": return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
      case "High": return "bg-orange-500/15 text-orange-700 dark:text-orange-400";
      case "Very High": return "bg-red-500/15 text-red-700 dark:text-red-400";
    }
  }, [analysis.complexity]);

  const dataSize = useMemo(() => {
    const bytes = new Blob([input]).size;
    return bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
  }, [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* LEFT COLUMN: Input + Settings */}
      <div className="space-y-4">
        {/* Input Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Braces className="h-4 w-4 text-primary" />
              JSON Input
              {input && <Badge variant="outline" className="ml-auto text-xs font-normal">{dataSize}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here…"
              className="font-mono text-xs min-h-[220px] resize-y bg-muted/30"
              spellCheck={false}
            />
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="break-all">{error}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleFormat}><Braces className="h-3.5 w-3.5 mr-1" />Format</Button>
              <Button size="sm" variant="outline" onClick={handleValidate}><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Validate</Button>
              <Button size="sm" variant="outline" onClick={() => { setInput(SAMPLE_JSON); if (autoGenerate) generate(SAMPLE_JSON, options); }}>
                <Sparkles className="h-3.5 w-3.5 mr-1" />Load Sample
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(null); setAnalysis(emptyAnalysis); }}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />Clear
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Switch id="auto-gen" checked={autoGenerate} onCheckedChange={setAutoGenerate} />
                <Label htmlFor="auto-gen" className="text-xs cursor-pointer">Auto</Label>
              </div>
            </div>
            {!autoGenerate && (
              <Button className="w-full" onClick={handleGenerate} disabled={!input.trim()}>
                <Play className="h-4 w-4 mr-2" />Generate
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Settings2 className="h-4 w-4 text-primary" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Root Name</Label>
                    <input
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                      value={options.rootName}
                      onChange={(e) => updateOption("rootName", e.target.value || "Root")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Generate As</Label>
                    <Select value={options.generateAs} onValueChange={(v) => updateOption("generateAs", v as InferenceOptions["generateAs"])}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interface">Interface</SelectItem>
                        <SelectItem value="type">Type Alias</SelectItem>
                        <SelectItem value="zod">Zod Schema</SelectItem>
                        <SelectItem value="json-schema">JSON Schema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Naming Style</Label>
                  <Select value={options.namingStyle} onValueChange={(v) => updateOption("namingStyle", v as InferenceOptions["namingStyle"])}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PascalCase">PascalCase</SelectItem>
                      <SelectItem value="camelCase">camelCase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ToggleRow label="Export" checked={options.useExport} onChange={(v) => updateOption("useExport", v)} />
                  <ToggleRow label="Readonly" checked={options.useReadonly} onChange={(v) => updateOption("useReadonly", v)} />
                  <ToggleRow label="All Optional" checked={options.allOptional} onChange={(v) => updateOption("allOptional", v)} />
                  <ToggleRow label="Extract Nested" checked={options.extractNested} onChange={(v) => updateOption("extractNested", v)} />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <ToggleRow label="Strict Mode" checked={options.strictMode} onChange={(v) => updateOption("strictMode", v)} />
                  <ToggleRow label="Extract Enums" checked={options.extractEnums} onChange={(v) => updateOption("extractEnums", v)} />
                  <ToggleRow label="API Response Mode" checked={options.apiResponseMode} onChange={(v) => updateOption("apiResponseMode", v)} />
                </div>
                {options.apiResponseMode && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Response Type Name</Label>
                    <input
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                      value={options.responseTypeName}
                      onChange={(e) => updateOption("responseTypeName", e.target.value || "ApiResponse")}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Analysis + Output */}
      <div className="space-y-4">
        {/* Analysis Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4 text-primary" />
              Analysis
              {output && <Badge className={`ml-auto text-xs font-normal ${complexityColor}`}>{analysis.complexity}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Objects" value={analysis.objectsDetected} />
                <Stat label="Arrays" value={analysis.arraysDetected} />
                <Stat label="Optional" value={analysis.optionalFields} />
                <Stat label="Nullable" value={analysis.nullableFields} />
                <Stat label="Unions" value={analysis.unionTypes} />
                <Stat label="Enums" value={analysis.enumCandidates} />
                <Stat label="Nested Types" value={analysis.nestedInterfaces} />
                <div className="rounded-md border border-border bg-muted/30 p-2 text-center">
                  <div className="text-lg font-semibold text-foreground flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4 text-primary" />{analysis.complexity}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Complexity</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">Generate types to see analysis</p>
            )}
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Code2 className="h-4 w-4 text-primary" />
              Output
              <div className="ml-auto flex items-center gap-1.5">
                {output && (
                  <>
                    <CopyButton text={output} />
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {output ? (
              <pre className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs overflow-auto max-h-[500px] whitespace-pre-wrap text-foreground">
                {output}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileType className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-xs">Paste JSON and generate types</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-2 text-center">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
