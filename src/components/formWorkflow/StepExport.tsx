import { useState } from "react";
import { Download, Upload, Copy, Check } from "lucide-react";
import type { FormConfig } from "@/lib/formSchemaEngine";
import { exportFormSchema, formExportFormats, type FormExportFormat } from "@/lib/exportAdapter";
import { CodeBlock } from "@/components/CodeBlock";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: FormConfig;
  onImport: (config: FormConfig) => void;
}

export function StepExport({ config, onImport }: Props) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<FormExportFormat>("zod");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  const exported = exportFormSchema(config, format);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exported);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied!");
  };

  const handleDownload = () => {
    const ext = format === "json-config" ? "json" : "ts";
    const blob = new Blob([exported], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-validation.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveConfig = () => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-config.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Config saved!");
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed.fields && parsed.validations) {
        onImport(parsed);
        setShowImport(false);
        setImportText("");
        toast.success("Config imported!");
      } else {
        toast.error("Invalid config format");
      }
    } catch {
      toast.error("Invalid JSON");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {t("formWorkflow.exportOptions") || "Export Options"}
        </h3>
        <div className="flex gap-1.5">
          <button onClick={handleSaveConfig} className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors">
            <Download className="h-3.5 w-3.5" /> Save Config
          </button>
          <button onClick={() => setShowImport(!showImport)} className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors">
            <Upload className="h-3.5 w-3.5" /> Load Config
          </button>
        </div>
      </div>

      {showImport && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Paste form config JSON..."
            className="h-24 w-full resize-none rounded-md border border-border bg-code p-2 font-mono text-xs text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
          <button onClick={handleImport} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Import
          </button>
        </div>
      )}

      {/* Format selector */}
      <div className="flex flex-wrap gap-1.5">
        {formExportFormats.map(f => (
          <button
            key={f.value}
            onClick={() => setFormat(f.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              format === f.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Code output */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={handleCopy} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
        <pre className="overflow-auto rounded-lg bg-code p-3 font-mono text-[11px] text-code-foreground max-h-96 whitespace-pre-wrap">
          {exported}
        </pre>
      </div>
    </div>
  );
}
