import { useState, useMemo, useCallback, useRef, memo } from "react";
import {
  computeJsonTreeDiff, getSummary, DiffNode, DiffSummary,
  ArrayStrategy, DiffOptions, ChangeType,
} from "../lib/jsonDiffEngine";
import {
  ChevronRight, ChevronDown, Eye, Columns2, TreeDeciduous, AlignLeft,
  ChevronsUpDown, ChevronsDownUp, Info, Trash2, Copy, Check,
} from "lucide-react";

// ─── Sample JSON ──────────────────────────────────────────
const SAMPLE_OLD = JSON.stringify({
  name: "DevToolbox", version: "1.0.0",
  features: ["json", "diff"],
  config: { theme: "dark", lang: "en" },
  users: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
}, null, 2);

const SAMPLE_NEW = JSON.stringify({
  name: "DevToolbox", version: "2.0.0",
  features: ["json", "diff", "jwt"],
  config: { theme: "light", lang: "en", beta: true },
  users: [{ id: 1, name: "Alice V2" }, { id: 3, name: "Charlie" }],
}, null, 2);

type ViewMode = "unified" | "split";
type DiffMode = "text" | "tree";

export default function AdvancedJsonDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [diffMode, setDiffMode] = useState<DiffMode>("tree");
  const [arrayStrategy, setArrayStrategy] = useState<ArrayStrategy>("index");
  const [matchKey, setMatchKey] = useState("id");
  const [selectedNode, setSelectedNode] = useState<DiffNode | null>(null);
  const [expandAll, setExpandAll] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const leftRef = useRef<HTMLTextAreaElement>(null);
  const rightRef = useRef<HTMLTextAreaElement>(null);

  // Sync scroll
  const handleScroll = useCallback((source: "left" | "right") => {
    const a = source === "left" ? leftRef.current : rightRef.current;
    const b = source === "left" ? rightRef.current : leftRef.current;
    if (a && b) {
      b.scrollTop = a.scrollTop;
      b.scrollLeft = a.scrollLeft;
    }
  }, []);

  const loadSample = () => { setOriginal(SAMPLE_OLD); setModified(SAMPLE_NEW); setParseError(null); };

  const diffResult = useMemo<{ tree: DiffNode | null; summary: DiffSummary | null }>(() => {
    if (!original.trim() && !modified.trim()) return { tree: null, summary: null };
    try {
      const oldJson = JSON.parse(original || "null");
      const newJson = JSON.parse(modified || "null");
      setParseError(null);
      const opts: DiffOptions = { arrayStrategy, arrayMatchKey: matchKey };
      const tree = computeJsonTreeDiff(oldJson, newJson, opts);
      const summary = getSummary(tree);
      return { tree, summary };
    } catch (e: any) {
      setParseError(e.message || "Invalid JSON");
      return { tree: null, summary: null };
    }
  }, [original, modified, arrayStrategy, matchKey]);

  return (
    <div className="space-y-5">
      {/* ─── Section 1: View Settings ─── */}
      <Section title="View Settings" icon={<Eye className="h-4 w-4" />}>
        <div className="flex flex-wrap items-center gap-3">
          <ToggleGroup
            options={[
              { value: "unified", label: "Unified", icon: <AlignLeft className="h-3.5 w-3.5" /> },
              { value: "split", label: "Split View", icon: <Columns2 className="h-3.5 w-3.5" /> },
            ]}
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}
          />
          <div className="h-6 w-px bg-border" />
          <ToggleGroup
            options={[
              { value: "text", label: "Text Mode", icon: <AlignLeft className="h-3.5 w-3.5" /> },
              { value: "tree", label: "JSON Tree Diff", icon: <TreeDeciduous className="h-3.5 w-3.5" /> },
            ]}
            value={diffMode}
            onChange={(v) => setDiffMode(v as DiffMode)}
          />
        </div>
      </Section>

      {/* ─── Section 2: Array Strategy ─── */}
      {diffMode === "tree" && (
        <Section title="Array Strategy" icon={<ChevronsUpDown className="h-4 w-4" />}>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={arrayStrategy}
              onChange={(e) => setArrayStrategy(e.target.value as ArrayStrategy)}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="index">Compare by Index</option>
              <option value="ignore-order">Ignore Order</option>
              <option value="match-by-key">Match by Key</option>
            </select>
            {arrayStrategy === "match-by-key" && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Key Name:
                <input
                  value={matchKey}
                  onChange={(e) => setMatchKey(e.target.value)}
                  className="w-24 rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="id"
                />
              </label>
            )}
          </div>
        </Section>
      )}

      {/* ─── Input Panels ─── */}
      <Section title="Input" icon={<Columns2 className="h-4 w-4" />}>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={loadSample} className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors">
            Load Sample
          </button>
          <button onClick={() => { setOriginal(""); setModified(""); setParseError(null); setSelectedNode(null); }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors">
            <Trash2 className="h-3 w-3" /> Clear
          </button>
        </div>

        <div className={viewMode === "split" ? "grid gap-4 lg:grid-cols-2" : "space-y-3"}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Original JSON</span>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(original);
                    setOriginal(JSON.stringify(parsed, null, 2));
                  } catch (e) {
                    // Optionally set a temporary error, but for now, do nothing
                  }
                }}
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors"
              >
                Format JSON
              </button>
            </div>
            <textarea
              ref={leftRef}
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              onScroll={() => viewMode === "split" && handleScroll("left")}
              spellCheck={false}
              placeholder='{ "key": "value" }'
              className="h-52 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Modified JSON</span>
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(modified);
                    setModified(JSON.stringify(parsed, null, 2));
                  } catch (e) {
                    // Optionally set a temporary error, but for now, do nothing
                  }
                }}
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors"
              >
                Format JSON
              </button>
            </div>
            <textarea
              ref={rightRef}
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              onScroll={() => viewMode === "split" && handleScroll("right")}
              spellCheck={false}
              placeholder='{ "key": "new-value" }'
              className="h-52 w-full resize-none rounded-lg border border-border bg-code p-4 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        </div>
      </Section>

      {/* ─── Error ─── */}
      {parseError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Invalid JSON</p>
            <p className="text-xs mt-1 opacity-80">{parseError}</p>
          </div>
        </div>
      )}

      {/* ─── Results ─── */}
      {diffResult.tree && diffResult.summary && (
        <Section title="Results" icon={<TreeDeciduous className="h-4 w-4" />}>
          {/* Summary */}
          <SummaryPanel summary={diffResult.summary} />

          {/* Search */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Search keys/values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tree controls */}
          {diffMode === "tree" && (
            <div className="flex items-center gap-2 mt-4 mb-2">
              <button onClick={() => setExpandAll(true)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors">
                <ChevronsDownUp className="h-3 w-3" /> Expand All
              </button>
              <button onClick={() => setExpandAll(false)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors">
                <ChevronsUpDown className="h-3 w-3" /> Collapse All
              </button>
            </div>
          )}

          {/* Tree View */}
          {diffMode === "tree" && (
            <div className="rounded-lg border border-border bg-card overflow-auto max-h-[600px]">
              <div className="p-3 font-mono text-sm">
                <TreeNodeView
                  node={diffResult.tree}
                  depth={0}
                  expandAll={expandAll}
                  onSelect={setSelectedNode}
                  selectedPath={selectedNode?.path}
                  searchTerm={searchTerm}
                />
              </div>
            </div>
          )}

          {/* Text Mode fallback - simple line diff */}
          {diffMode === "text" && (
            <div className="rounded-lg border border-border bg-card overflow-auto max-h-[600px] p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">
                {renderTextDiff(original, modified)}
              </pre>
            </div>
          )}
        </Section>
      )}

      {/* ─── Change Inspector ─── */}
      {selectedNode && selectedNode.type !== "equal" && (
        <Section title="Change Inspector" icon={<Info className="h-4 w-4" />}>
          <ChangeInspector node={selectedNode} />
        </Section>
      )}
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Toggle Group ─────────────────────────────────────────
function ToggleGroup({ options, value, onChange }: {
  options: { value: string; label: string; icon: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-border overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Summary Panel ────────────────────────────────────────
function SummaryPanel({ summary }: { summary: DiffSummary }) {
  const items = [
    { label: "Keys Added", value: summary.keysAdded, color: "text-success bg-success/10" },
    { label: "Keys Removed", value: summary.keysRemoved, color: "text-destructive bg-destructive/10" },
    { label: "Values Modified", value: summary.valuesModified, color: "text-amber-500 bg-amber-500/10" },
    { label: "Arrays Changed", value: summary.arraysChanged, color: "text-primary bg-primary/10" },
    { label: "Total Changes", value: summary.totalChanges, color: "text-foreground bg-secondary" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {items.map((it) => (
        <div key={it.label} className={`rounded-lg p-3 text-center ${it.color}`}>
          <div className="text-xl font-bold">{it.value}</div>
          <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5 opacity-80">{it.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Tree Node ────────────────────────────────────────────
const TreeNodeView = memo(function TreeNodeView({
  node, depth, expandAll, onSelect, selectedPath, searchTerm
}: {
  node: DiffNode; depth: number; expandAll: boolean;
  onSelect: (n: DiffNode) => void; selectedPath?: string; searchTerm: string;
}) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedPath === node.path;

  // React to expandAll
  const prevExpandAll = useRef(expandAll);
  if (prevExpandAll.current !== expandAll) {
    prevExpandAll.current = expandAll;
    // This triggers re-render with the right open state
  }

  const effectiveOpen = expandAll ? true : open;

  // Check if node matches search
  const matchesSearch = useMemo(() => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const keyMatch = node.key.toLowerCase().includes(term);
    const oldValueMatch = node.oldValue !== undefined && JSON.stringify(node.oldValue).toLowerCase().includes(term);
    const newValueMatch = node.newValue !== undefined && JSON.stringify(node.newValue).toLowerCase().includes(term);
    return keyMatch || oldValueMatch || newValueMatch;
  }, [node, searchTerm]);

  // Check if any child matches
  const hasMatchingChild = useMemo(() => {
    if (!searchTerm || !hasChildren) return false;
    const checkChildren = (children: DiffNode[]): boolean => {
      for (const child of children) {
        const term = searchTerm.toLowerCase();
        if (child.key.toLowerCase().includes(term) ||
            (child.oldValue !== undefined && JSON.stringify(child.oldValue).toLowerCase().includes(term)) ||
            (child.newValue !== undefined && JSON.stringify(child.newValue).toLowerCase().includes(term))) {
          return true;
        }
        if (child.children) {
          if (checkChildren(child.children)) return true;
        }
      }
      return false;
    };
    return checkChildren(node.children!);
  }, [node.children, searchTerm, hasChildren]);

  // Render only if matches or has matching child
  if (!matchesSearch && !hasMatchingChild) return null;

  const typeColors: Record<ChangeType, string> = {
    added: "text-success",
    removed: "text-destructive line-through",
    modified: "text-amber-500",
    equal: "text-muted-foreground/60",
  };

  const bgHighlight = node.type === "added"
    ? "bg-success/5"
    : node.type === "removed"
    ? "bg-destructive/5"
    : node.type === "modified"
    ? "bg-amber-500/5"
    : "";

  return (
    <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      <div
        className={`flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer hover:bg-muted/50 transition-colors ${bgHighlight} ${isSelected ? "ring-1 ring-primary/50" : ""}`}
        onClick={() => {
          if (hasChildren) setOpen(!effectiveOpen);
          if (node.type !== "equal") onSelect(node);
        }}
      >
        {hasChildren ? (
          effectiveOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className={`font-medium ${typeColors[node.type]}`}>{node.key}</span>
        {node.changeCount > 0 && (
          <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0 text-[10px] font-bold text-primary">{node.changeCount}</span>
        )}
        {!hasChildren && node.type !== "equal" && (
          <span className="ml-2 text-xs truncate max-w-[300px]">
            {node.type === "added" && <span className="text-success">{JSON.stringify(node.newValue)}</span>}
            {node.type === "removed" && <span className="text-destructive">{JSON.stringify(node.oldValue)}</span>}
            {node.type === "modified" && (
              <>
                <span className="text-destructive">{JSON.stringify(node.oldValue)}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="text-success">{JSON.stringify(node.newValue)}</span>
              </>
            )}
          </span>
        )}
      </div>
      {hasChildren && effectiveOpen && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNodeView
              key={child.path + i}
              node={child}
              depth={depth + 1}
              expandAll={expandAll}
              onSelect={onSelect}
              selectedPath={selectedPath}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// ─── Change Inspector ─────────────────────────────────────
function ChangeInspector({ node }: { node: DiffNode }) {
  const [copied, setCopied] = useState(false);
  const explanation = useMemo(() => generateExplanation(node), [node]);

  const copyPath = () => {
    navigator.clipboard.writeText(node.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">JSON Path:</span>
        <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-foreground">{node.path}</code>
        <button onClick={copyPath} className="text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Old Value</span>
          <pre className="mt-1.5 font-mono text-xs text-foreground whitespace-pre-wrap max-h-40 overflow-auto">
            {node.oldValue !== undefined ? JSON.stringify(node.oldValue, null, 2) : "—"}
          </pre>
        </div>
        <div className="rounded-lg border border-border p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-success">New Value</span>
          <pre className="mt-1.5 font-mono text-xs text-foreground whitespace-pre-wrap max-h-40 overflow-auto">
            {node.newValue !== undefined ? JSON.stringify(node.newValue, null, 2) : "—"}
          </pre>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Change Type:</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          node.type === "added" ? "bg-success/15 text-success" :
          node.type === "removed" ? "bg-destructive/15 text-destructive" :
          "bg-amber-500/15 text-amber-500"
        }`}>{node.type.toUpperCase()}</span>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground">{explanation}</p>
      </div>
    </div>
  );
}

function generateExplanation(node: DiffNode): string {
  if (node.type === "added") return `The key "${node.key}" was added with value ${JSON.stringify(node.newValue)}.`;
  if (node.type === "removed") return `The key "${node.key}" was removed. Previous value was ${JSON.stringify(node.oldValue)}.`;
  if (node.type === "modified") {
    if (node.children) return `The structure at "${node.path}" was modified with ${node.changeCount} total change(s).`;
    return `"${node.key}" changed from ${JSON.stringify(node.oldValue)} to ${JSON.stringify(node.newValue)}.`;
  }
  return "No changes detected.";
}

function renderTextDiff(original: string, modified: string): string {
  try {
    const oldLines = JSON.stringify(JSON.parse(original), null, 2).split("\n");
    const newLines = JSON.stringify(JSON.parse(modified), null, 2).split("\n");
    const maxLen = Math.max(oldLines.length, newLines.length);
    const result: string[] = [];
    for (let i = 0; i < maxLen; i++) {
      const a = oldLines[i] ?? "";
      const b = newLines[i] ?? "";
      if (a === b) result.push("  " + a);
      else {
        if (a) result.push("- " + a);
        if (b) result.push("+ " + b);
      }
    }
    return result.join("\n");
  } catch {
    return "Unable to diff – ensure both inputs are valid JSON.";
  }
}
