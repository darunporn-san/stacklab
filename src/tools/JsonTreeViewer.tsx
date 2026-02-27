import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  TreesIcon, Braces, Trash2, Sparkles, CheckCircle2, AlertTriangle,
  ChevronRight, ChevronDown, Copy, Search, ArrowUp, ArrowDown,
  ChevronsUpDown, ChevronsDownUp, FileCode, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "@/components/CopyButton";

const SAMPLE_JSON = {
  user: {
    id: 1042,
    name: "Jane Doe",
    email: "jane@example.com",
    active: true,
    profile: {
      avatar: "https://example.com/avatar.png",
      bio: "Full-stack developer",
      social: { twitter: "@jane", github: "janedoe" }
    },
    roles: ["admin", "editor"],
    preferences: { theme: "dark", language: "en", notifications: { email: true, sms: false } }
  },
  metadata: { version: "2.1.0", generated: "2026-02-27T10:00:00Z", count: null },
  items: [
    { id: 1, name: "Widget A", price: 29.99, tags: ["sale", "new"] },
    { id: 2, name: "Widget B", price: 49.99, tags: ["popular"] },
    { id: 3, name: "Widget C", price: 9.99, tags: [] }
  ]
};

// --- Helpers ---
function getType(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function estimateSize(v: unknown): string {
  const bytes = new Blob([JSON.stringify(v)]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function collectPaths(
  val: unknown,
  path: string,
  results: { path: string; key: string; value: unknown; type: string }[]
) {
  const type = getType(val);
  if (type === "object" && val !== null) {
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      const p = `${path}.${k}`;
      results.push({ path: p, key: k, value: v, type: getType(v) });
      collectPaths(v, p, results);
    }
  } else if (type === "array") {
    (val as unknown[]).forEach((item, i) => {
      const p = `${path}[${i}]`;
      results.push({ path: p, key: String(i), value: item, type: getType(item) });
      collectPaths(item, p, results);
    });
  }
}

// --- Color helpers using semantic tokens ---
const typeColors: Record<string, string> = {
  string: "text-green-600 dark:text-green-400",
  number: "text-blue-600 dark:text-blue-400",
  boolean: "text-amber-600 dark:text-amber-400",
  null: "text-muted-foreground italic",
  object: "text-foreground",
  array: "text-foreground",
};

const typeBadgeVariant: Record<string, string> = {
  string: "bg-green-500/10 text-green-700 dark:text-green-300",
  number: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  boolean: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  null: "bg-muted text-muted-foreground",
  object: "bg-primary/10 text-primary",
  array: "bg-primary/10 text-primary",
};

// --- Lazy Tree Node ---
const LARGE_ARRAY_THRESHOLD = 100;

interface TreeNodeProps {
  keyName: string;
  value: unknown;
  path: string;
  depth: number;
  expandedPaths: Set<string>;
  toggleExpand: (path: string) => void;
  selectedPath: string | null;
  setSelectedPath: (p: string) => void;
  searchMatches: Set<string>;
  currentMatchPath: string | null;
}

const TreeNode = React.memo<TreeNodeProps>(({
  keyName, value, path, depth, expandedPaths, toggleExpand,
  selectedPath, setSelectedPath, searchMatches, currentMatchPath
}) => {
  const type = getType(value);
  const isExpandable = type === "object" || type === "array";
  const isExpanded = expandedPaths.has(path);
  const isSelected = selectedPath === path;
  const isMatch = searchMatches.has(path);
  const isCurrent = currentMatchPath === path;

  const childCount = isExpandable
    ? type === "array" ? (value as unknown[]).length : Object.keys(value as object).length
    : 0;

  const isEmpty = isExpandable && childCount === 0;
  const isLargeArray = type === "array" && childCount > LARGE_ARRAY_THRESHOLD;

  const nodeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isCurrent && nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isCurrent]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPath(path);
    if (isExpandable) toggleExpand(path);
  }, [path, isExpandable, toggleExpand, setSelectedPath]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && isExpandable && !isExpanded) {
      e.preventDefault(); toggleExpand(path);
    } else if (e.key === "ArrowLeft" && isExpandable && isExpanded) {
      e.preventDefault(); toggleExpand(path);
    } else if (e.key === "Enter") {
      e.preventDefault(); setSelectedPath(path);
    }
  }, [path, isExpandable, isExpanded, toggleExpand, setSelectedPath]);

  const renderValue = () => {
    if (isExpandable) return null;
    const display = value === null ? "null"
      : type === "string" ? `"${String(value)}"`
      : String(value);
    return <span className={`font-mono text-xs ${typeColors[type]}`}>{display}</span>;
  };

  return (
    <div ref={nodeRef}>
      <div
        role="treeitem"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`flex items-center gap-1 px-2 py-0.5 cursor-pointer rounded-sm transition-colors text-sm
          ${isSelected ? "bg-primary/15 ring-1 ring-primary/30" : "hover:bg-muted/60"}
          ${isCurrent ? "ring-2 ring-primary" : ""}
          ${isEmpty ? "opacity-50" : ""}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Indent guide */}
        {depth > 0 && (
          <span
            className="absolute border-l border-border"
            style={{ left: `${depth * 16}px`, height: "100%", top: 0 }}
          />
        )}

        {isExpandable ? (
          isExpanded
            ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        <span className={`font-mono text-xs font-medium ${isMatch ? "bg-yellow-300/40 dark:bg-yellow-500/30 rounded px-0.5" : ""}`}>
          {keyName}
        </span>

        {isExpandable && (
          <span className={`text-[10px] px-1.5 py-0 rounded-full font-mono ${typeBadgeVariant[type]}`}>
            {type === "array" ? `${childCount} items` : `${childCount} keys`}
            {isLargeArray && <span className="ml-1 text-destructive">⚠</span>}
          </span>
        )}

        {!isExpandable && (
          <>
            <span className="text-muted-foreground mx-0.5">:</span>
            {renderValue()}
          </>
        )}

        <span className={`ml-auto text-[10px] ${typeBadgeVariant[type]} px-1 rounded`}>{type}</span>
      </div>

      {isExpandable && isExpanded && (
        <div role="group" className="relative">
          <span
            className="absolute border-l border-border/50"
            style={{ left: `${(depth + 1) * 16 + 3}px`, top: 0, bottom: 0 }}
          />
          {type === "object"
            ? Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                <TreeNode
                  key={k} keyName={k} value={v} path={`${path}.${k}`} depth={depth + 1}
                  expandedPaths={expandedPaths} toggleExpand={toggleExpand}
                  selectedPath={selectedPath} setSelectedPath={setSelectedPath}
                  searchMatches={searchMatches} currentMatchPath={currentMatchPath}
                />
              ))
            : (value as unknown[]).map((item, i) => (
                <TreeNode
                  key={i} keyName={String(i)} value={item} path={`${path}[${i}]`} depth={depth + 1}
                  expandedPaths={expandedPaths} toggleExpand={toggleExpand}
                  selectedPath={selectedPath} setSelectedPath={setSelectedPath}
                  searchMatches={searchMatches} currentMatchPath={currentMatchPath}
                />
              ))
          }
        </div>
      )}
    </div>
  );
});
TreeNode.displayName = "TreeNode";

// --- Main Component ---
export default function JsonTreeViewer() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<unknown>(null);
  const [error, setError] = useState<{ message: string; line?: number; col?: number } | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(["root"]));
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "raw">("tree");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const { toast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced parse
  const doParse = useCallback((text: string) => {
    if (!text.trim()) { setParsed(null); setError(null); return; }
    try {
      const obj = JSON.parse(text);
      setParsed(obj);
      setError(null);
      setExpandedPaths(new Set(["root"]));
      setSelectedPath(null);
    } catch (e: unknown) {
      setParsed(null);
      const msg = (e as Error).message;
      const posMatch = msg.match(/position (\d+)/i);
      let line: number | undefined, col: number | undefined;
      if (posMatch) {
        const pos = Number(posMatch[1]);
        const before = text.slice(0, pos);
        line = (before.match(/\n/g) || []).length + 1;
        col = pos - before.lastIndexOf("\n");
      }
      setError({ message: msg, line, col });
    }
  }, []);

  const handleInputChange = useCallback((val: string) => {
    setInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doParse(val), 300);
  }, [doParse]);

  const handleFormat = () => {
    try {
      const obj = JSON.parse(input);
      const formatted = JSON.stringify(obj, null, 2);
      setInput(formatted);
      setParsed(obj);
      setError(null);
      toast({ title: "Formatted", description: "JSON formatted successfully" });
    } catch {
      toast({ title: "Invalid JSON", description: "Cannot format invalid JSON", variant: "destructive" });
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      toast({ title: "Valid JSON ✓", description: "The JSON is valid" });
    } catch (e: unknown) {
      toast({ title: "Invalid JSON", description: (e as Error).message, variant: "destructive" });
    }
  };

  const handleLoadSample = () => {
    const text = JSON.stringify(SAMPLE_JSON, null, 2);
    setInput(text);
    doParse(text);
  };

  const handleClear = () => {
    setInput(""); setParsed(null); setError(null); setSelectedPath(null);
    setExpandedPaths(new Set(["root"])); setSearchQuery("");
  };

  // Search
  const allPaths = useMemo(() => {
    if (!parsed) return [];
    const results: { path: string; key: string; value: unknown; type: string }[] = [];
    collectPaths(parsed, "root", results);
    return results;
  }, [parsed]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPaths.filter(({ key, value, type }) => {
      if (key.toLowerCase().includes(q)) return true;
      if (type !== "object" && type !== "array" && String(value).toLowerCase().includes(q)) return true;
      return false;
    });
  }, [allPaths, searchQuery]);

  const searchMatchSet = useMemo(() => new Set(searchResults.map(r => r.path)), [searchResults]);

  // Auto-expand matching branches
  useEffect(() => {
    if (searchResults.length === 0) return;
    setExpandedPaths(prev => {
      const next = new Set(prev);
      for (const r of searchResults) {
        const parts = r.path.split(/\.|\[/);
        let p = "";
        for (const part of parts) {
          p = p ? (part.endsWith("]") ? `${p}[${part}` : `${p}.${part}`) : part;
          next.add(p);
        }
      }
      return next;
    });
    setCurrentMatchIndex(0);
  }, [searchResults]);

  const currentMatchPath = searchResults[currentMatchIndex]?.path ?? null;

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const all = new Set(["root", ...allPaths.map(p => p.path)]);
    setExpandedPaths(all);
  }, [allPaths]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set(["root"]));
  }, []);

  // Inspector data
  const inspectorData = useMemo(() => {
    if (!selectedPath || !parsed) return null;
    if (selectedPath === "root") return { path: "root", type: getType(parsed), value: parsed, length: undefined };
    const found = allPaths.find(p => p.path === selectedPath);
    if (!found) return null;
    const t = found.type;
    const length = t === "string" ? (found.value as string).length
      : t === "array" ? (found.value as unknown[]).length
      : undefined;
    return { path: found.path, type: t, value: found.value, length };
  }, [selectedPath, parsed, allPaths]);

  const dataSize = useMemo(() => parsed ? estimateSize(parsed) : null, [parsed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_0.8fr] gap-4 h-[calc(100vh-8rem)]">
      {/* Input Panel */}
      <Card className="flex flex-col p-4 gap-3 overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Braces className="h-4 w-4 text-primary" /> Input
          </h3>
          <div className="ml-auto flex gap-1.5 flex-wrap">
            <Button size="sm" variant="outline" onClick={handleFormat} className="text-xs h-7">
              <Sparkles className="h-3 w-3 mr-1" /> Format
            </Button>
            <Button size="sm" variant="outline" onClick={handleValidate} className="text-xs h-7">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Validate
            </Button>
            <Button size="sm" variant="outline" onClick={handleLoadSample} className="text-xs h-7">
              Sample
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClear} className="text-xs h-7">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Textarea
          value={input}
          onChange={e => handleInputChange(e.target.value)}
          placeholder='Paste JSON here...'
          className="flex-1 font-mono text-xs resize-none bg-muted/30"
          spellCheck={false}
        />

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-md p-2.5 text-xs">
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-destructive">Parse Error</p>
                <p className="text-muted-foreground mt-0.5">{error.message}</p>
                {error.line && (
                  <p className="text-muted-foreground mt-0.5">Line {error.line}, Column {error.col}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {parsed && dataSize && (
          <div className="flex gap-2 text-[10px] text-muted-foreground">
            <span>Size: {dataSize}</span>
            <span>Type: {getType(parsed)}</span>
          </div>
        )}
      </Card>

      {/* Tree Viewer Panel */}
      <Card className="flex flex-col p-4 gap-3 overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <TreesIcon className="h-4 w-4 text-primary" /> Tree Viewer
          </h3>

          <Tabs value={viewMode} onValueChange={v => setViewMode(v as "tree" | "raw")} className="ml-auto">
            <TabsList className="h-7">
              <TabsTrigger value="tree" className="text-xs h-6 px-2 gap-1">
                <Eye className="h-3 w-3" /> Tree
              </TabsTrigger>
              <TabsTrigger value="raw" className="text-xs h-6 px-2 gap-1">
                <FileCode className="h-3 w-3" /> Raw
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "tree" && parsed && (
          <>
            {/* Search */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search keys or values..."
                  className="pl-7 h-8 text-xs"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <span>{currentMatchIndex + 1}/{searchResults.length}</span>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                    onClick={() => setCurrentMatchIndex(i => (i - 1 + searchResults.length) % searchResults.length)}>
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                    onClick={() => setCurrentMatchIndex(i => (i + 1) % searchResults.length)}>
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={expandAll}>
                <ChevronsUpDown className="h-3 w-3 mr-1" /> Expand All
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={collapseAll}>
                <ChevronsDownUp className="h-3 w-3 mr-1" /> Collapse All
              </Button>
            </div>
          </>
        )}

        <ScrollArea className="flex-1 -mx-2">
          {!parsed && !error && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Paste JSON to explore
            </div>
          )}

          {parsed && viewMode === "tree" && (
            <div role="tree" className="py-1 px-2">
              <TreeNode
                keyName="root"
                value={parsed}
                path="root"
                depth={0}
                expandedPaths={expandedPaths}
                toggleExpand={toggleExpand}
                selectedPath={selectedPath}
                setSelectedPath={setSelectedPath}
                searchMatches={searchMatchSet}
                currentMatchPath={currentMatchPath}
              />
            </div>
          )}

          {parsed && viewMode === "raw" && (
            <pre className="font-mono text-xs p-3 whitespace-pre-wrap text-foreground">
              {JSON.stringify(parsed, null, 2)}
            </pre>
          )}
        </ScrollArea>
      </Card>

      {/* Inspector Panel */}
      <Card className="flex flex-col p-4 gap-3 overflow-hidden">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <Search className="h-4 w-4 text-primary" /> Inspector
        </h3>
        <Separator />

        {!inspectorData ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs text-center px-4">
            Click any node in the tree to inspect its details
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-3 text-xs">
              {/* Path */}
              <div>
                <label className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium">JSON Path</label>
                <div className="flex items-center gap-1 mt-1">
                  <code className="font-mono bg-muted/50 px-2 py-1 rounded text-foreground flex-1 break-all">
                    {inspectorData.path}
                  </code>
                  <CopyButton text={inspectorData.path} />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium">Data Type</label>
                <div className="mt-1">
                  <Badge variant="secondary" className={typeBadgeVariant[inspectorData.type]}>
                    {inspectorData.type}
                  </Badge>
                </div>
              </div>

              {/* Length */}
              {inspectorData.length !== undefined && (
                <div>
                  <label className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium">Length</label>
                  <p className="mt-1 font-mono text-foreground">{inspectorData.length}</p>
                </div>
              )}

              {/* Value */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium">Value</label>
                  <CopyButton text={JSON.stringify(inspectorData.value, null, 2)} />
                </div>
                <pre className="mt-1 font-mono bg-muted/30 p-2 rounded max-h-60 overflow-auto whitespace-pre-wrap text-foreground">
                  {JSON.stringify(inspectorData.value, null, 2)}
                </pre>
              </div>

              {/* Copy subtree */}
              {(inspectorData.type === "object" || inspectorData.type === "array") && (
                <Button
                  size="sm" variant="outline" className="w-full text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(inspectorData.value, null, 2));
                    toast({ title: "Copied", description: "Subtree copied to clipboard" });
                  }}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy Subtree as JSON
                </Button>
              )}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
}
