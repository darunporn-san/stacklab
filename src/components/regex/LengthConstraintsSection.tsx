import type { LengthConstraints } from "@/lib/regexRuleConfig";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  config: LengthConstraints;
  onChange: (config: LengthConstraints) => void;
}

export function LengthConstraintsSection({ config, onChange }: Props) {
  const update = (key: keyof LengthConstraints, value: string) => {
    const num = value.replace(/\D/g, "");
    onChange({ ...config, [key]: num });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Length Constraints</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Min Length</Label>
          <Input value={config.minLength} onChange={(e) => update("minLength", e.target.value)} placeholder="—" className="font-mono text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Max Length</Label>
          <Input value={config.maxLength} onChange={(e) => update("maxLength", e.target.value)} placeholder="—" className="font-mono text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Exact Length</Label>
          <Input value={config.exactLength} onChange={(e) => update("exactLength", e.target.value)} placeholder="—" className="font-mono text-sm" />
        </div>
      </div>
    </div>
  );
}
