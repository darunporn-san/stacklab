import type { GridConfig, GridItemConfig } from "@/lib/layoutTypes";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  config: GridConfig;
  items: GridItemConfig[];
  onChange: (u: Partial<GridConfig>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, u: Partial<GridItemConfig>) => void;
}

const selectCls = "h-8 rounded-md border border-border bg-code px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full";
const inputCls = "h-8 rounded-md border border-border bg-code px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full";
const labelCls = "text-[11px] font-medium text-muted-foreground";

const COLUMN_PRESETS = [
  { label: "1 col", value: "1fr" },
  { label: "2 cols", value: "repeat(2, 1fr)" },
  { label: "3 cols", value: "repeat(3, 1fr)" },
  { label: "4 cols", value: "repeat(4, 1fr)" },
  { label: "auto-fit", value: "repeat(auto-fit, minmax(200px, 1fr))" },
  { label: "auto-fill", value: "repeat(auto-fill, minmax(200px, 1fr))" },
];

export function GridControls({ config, items, onChange, onAddItem, onRemoveItem, onUpdateItem }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Grid Container</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <label className={labelCls}>Template Columns</label>
          <select className={selectCls} value={COLUMN_PRESETS.find(p => p.value === config.templateColumns) ? config.templateColumns : "__custom"} onChange={e => { if (e.target.value !== "__custom") onChange({ templateColumns: e.target.value }); }}>
            {COLUMN_PRESETS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            {!COLUMN_PRESETS.find(p => p.value === config.templateColumns) && <option value="__custom">Custom</option>}
          </select>
          <input className={inputCls} value={config.templateColumns} onChange={e => onChange({ templateColumns: e.target.value })} placeholder="e.g. repeat(3, 1fr)" />
        </div>

        <Field label="Template Rows">
          <input className={inputCls} value={config.templateRows} onChange={e => onChange({ templateRows: e.target.value })} />
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
            <div className="flex items-center gap-1">
              <label className="text-[10px] text-muted-foreground">col</label>
              <input type="number" className="h-6 w-10 rounded border border-border bg-background px-1 text-[11px] text-foreground" value={item.colSpan} min={1} onChange={e => onUpdateItem(item.id, { colSpan: +e.target.value })} />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-[10px] text-muted-foreground">row</label>
              <input type="number" className="h-6 w-10 rounded border border-border bg-background px-1 text-[11px] text-foreground" value={item.rowSpan} min={1} onChange={e => onUpdateItem(item.id, { rowSpan: +e.target.value })} />
            </div>
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
