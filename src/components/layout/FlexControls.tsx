import type { FlexConfig, FlexItemConfig } from "@/lib/layoutTypes";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  config: FlexConfig;
  items: FlexItemConfig[];
  onChange: (u: Partial<FlexConfig>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, u: Partial<FlexItemConfig>) => void;
}

const selectCls = "h-8 rounded-md border border-border bg-code px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full";
const inputCls = "h-8 rounded-md border border-border bg-code px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full";
const labelCls = "text-[11px] font-medium text-muted-foreground";

export function FlexControls({ config, items, onChange, onAddItem, onRemoveItem, onUpdateItem }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Flex Container</h3>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Direction">
          <select className={selectCls} value={config.direction} onChange={e => onChange({ direction: e.target.value as any })}>
            <option value="row">row</option>
            <option value="row-reverse">row-reverse</option>
            <option value="column">column</option>
            <option value="column-reverse">column-reverse</option>
          </select>
        </Field>

        <Field label="Justify Content">
          <select className={selectCls} value={config.justifyContent} onChange={e => onChange({ justifyContent: e.target.value })}>
            {["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>

        <Field label="Align Items">
          <select className={selectCls} value={config.alignItems} onChange={e => onChange({ alignItems: e.target.value })}>
            {["stretch", "flex-start", "flex-end", "center", "baseline"].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>

        <Field label="Flex Wrap">
          <select className={selectCls} value={config.flexWrap} onChange={e => onChange({ flexWrap: e.target.value as any })}>
            <option value="nowrap">nowrap</option>
            <option value="wrap">wrap</option>
            <option value="wrap-reverse">wrap-reverse</option>
          </select>
        </Field>

        <Field label="Gap (px)">
          <input type="number" className={inputCls} value={config.gap} min={0} onChange={e => onChange({ gap: +e.target.value })} />
        </Field>

        <Field label="Padding (px)">
          <input type="number" className={inputCls} value={config.padding} min={0} onChange={e => onChange({ padding: +e.target.value })} />
        </Field>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Items ({items.length})</h3>
        <button onClick={onAddItem} className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-2 rounded-md border border-border bg-code p-2">
            <span className="text-[11px] font-mono text-muted-foreground w-6 shrink-0">#{i + 1}</span>
            <input type="number" className="h-6 w-12 rounded border border-border bg-background px-1 text-[11px] text-foreground" title="order" value={item.order} onChange={e => onUpdateItem(item.id, { order: +e.target.value })} />
            <input type="number" className="h-6 w-12 rounded border border-border bg-background px-1 text-[11px] text-foreground" title="grow" value={item.flexGrow} min={0} onChange={e => onUpdateItem(item.id, { flexGrow: +e.target.value })} />
            <input type="number" className="h-6 w-12 rounded border border-border bg-background px-1 text-[11px] text-foreground" title="shrink" value={item.flexShrink} min={0} onChange={e => onUpdateItem(item.id, { flexShrink: +e.target.value })} />
            <button onClick={() => onRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors ml-auto">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}
