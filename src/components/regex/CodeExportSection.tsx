import { useState } from "react";
import { generateExport, exportFormats, type ExportFormat } from "@/lib/regexExportGenerator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/CopyButton";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  pattern: string;
}

export function CodeExportSection({ pattern }: Props) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<ExportFormat>("typescript");
  const code = generateExport(pattern, format);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{t("ruleBuilder.exportValidation")}</h3>
        <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
          <SelectTrigger className="w-[160px] text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {exportFormats.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-lg border border-border bg-code">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{exportFormats.find((f) => f.value === format)?.label}</span>
          <CopyButton text={code} />
        </div>
        <pre className="overflow-auto p-4 font-mono text-xs text-code-foreground whitespace-pre-wrap max-h-60">{code}</pre>
      </div>
    </div>
  );
}
