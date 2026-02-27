import type { LengthConstraints } from "@/lib/regexRuleConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useI18n";

interface Props {
  config: LengthConstraints;
  onChange: (config: LengthConstraints) => void;
}

export function LengthConstraintsSection({ config, onChange }: Props) {
  const { t } = useTranslation();
  const update = (key: keyof LengthConstraints, value: string) => {
    const num = value.replace(/\D/g, "");
    onChange({ ...config, [key]: num });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{t("ruleBuilder.lengthConstraints")}</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("ruleBuilder.minLength")}</Label>
          <Input value={config.minLength} onChange={(e) => update("minLength", e.target.value)} placeholder="—" className="font-mono text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("ruleBuilder.maxLength")}</Label>
          <Input value={config.maxLength} onChange={(e) => update("maxLength", e.target.value)} placeholder="—" className="font-mono text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t("ruleBuilder.exactLength")}</Label>
          <Input value={config.exactLength} onChange={(e) => update("exactLength", e.target.value)} placeholder="—" className="font-mono text-sm" />
        </div>
      </div>
    </div>
  );
}
