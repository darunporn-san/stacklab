// Advanced JSON structural diff engine

export type ChangeType = "added" | "removed" | "modified" | "equal";

export interface DiffNode {
  key: string;
  path: string;
  type: ChangeType;
  oldValue?: unknown;
  newValue?: unknown;
  children?: DiffNode[];
  changeCount: number;
}

export interface DiffSummary {
  keysAdded: number;
  keysRemoved: number;
  valuesModified: number;
  arraysChanged: number;
  totalChanges: number;
}

export type ArrayStrategy = "index" | "ignore-order" | "match-by-key";

export interface DiffOptions {
  arrayStrategy: ArrayStrategy;
  arrayMatchKey: string;
}

const DEFAULT_OPTS: DiffOptions = { arrayStrategy: "index", arrayMatchKey: "id" };

export function computeJsonTreeDiff(
  oldJson: unknown,
  newJson: unknown,
  opts: DiffOptions = DEFAULT_OPTS,
  path = "root"
): DiffNode {
  if (oldJson === newJson) {
    return { key: pathKey(path), path, type: "equal", oldValue: oldJson, newValue: newJson, changeCount: 0 };
  }

  if (oldJson === undefined) {
    return { key: pathKey(path), path, type: "added", newValue: newJson, changeCount: countNodes(newJson) };
  }
  if (newJson === undefined) {
    return { key: pathKey(path), path, type: "removed", oldValue: oldJson, changeCount: countNodes(oldJson) };
  }

  const oldType = typeOf(oldJson);
  const newType = typeOf(newJson);

  if (oldType !== newType) {
    return { key: pathKey(path), path, type: "modified", oldValue: oldJson, newValue: newJson, changeCount: 1 };
  }

  if (oldType === "object") {
    return diffObjects(oldJson as Record<string, unknown>, newJson as Record<string, unknown>, opts, path);
  }

  if (oldType === "array") {
    return diffArrays(oldJson as unknown[], newJson as unknown[], opts, path);
  }

  // Primitives
  if (oldJson !== newJson) {
    return { key: pathKey(path), path, type: "modified", oldValue: oldJson, newValue: newJson, changeCount: 1 };
  }
  return { key: pathKey(path), path, type: "equal", oldValue: oldJson, newValue: newJson, changeCount: 0 };
}

function diffObjects(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  opts: DiffOptions,
  path: string
): DiffNode {
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const children: DiffNode[] = [];

  for (const k of Array.from(allKeys).sort()) {
    const childPath = `${path}.${k}`;
    if (!(k in oldObj)) {
      children.push({ key: k, path: childPath, type: "added", newValue: newObj[k], changeCount: countNodes(newObj[k]) });
    } else if (!(k in newObj)) {
      children.push({ key: k, path: childPath, type: "removed", oldValue: oldObj[k], changeCount: countNodes(oldObj[k]) });
    } else {
      children.push(computeJsonTreeDiff(oldObj[k], newObj[k], opts, childPath));
    }
  }

  const changeCount = children.reduce((s, c) => s + c.changeCount, 0);
  return { key: pathKey(path), path, type: changeCount > 0 ? "modified" : "equal", children, changeCount };
}

function diffArrays(oldArr: unknown[], newArr: unknown[], opts: DiffOptions, path: string): DiffNode {
  let children: DiffNode[];

  if (opts.arrayStrategy === "ignore-order") {
    children = diffArrayIgnoreOrder(oldArr, newArr, opts, path);
  } else if (opts.arrayStrategy === "match-by-key") {
    children = diffArrayByKey(oldArr, newArr, opts, path);
  } else {
    children = diffArrayByIndex(oldArr, newArr, opts, path);
  }

  const changeCount = children.reduce((s, c) => s + c.changeCount, 0);
  return { key: pathKey(path), path, type: changeCount > 0 ? "modified" : "equal", children, changeCount };
}

function diffArrayByIndex(oldArr: unknown[], newArr: unknown[], opts: DiffOptions, path: string): DiffNode[] {
  const maxLen = Math.max(oldArr.length, newArr.length);
  const children: DiffNode[] = [];
  for (let i = 0; i < maxLen; i++) {
    const childPath = `${path}[${i}]`;
    if (i >= oldArr.length) {
      children.push({ key: `[${i}]`, path: childPath, type: "added", newValue: newArr[i], changeCount: 1 });
    } else if (i >= newArr.length) {
      children.push({ key: `[${i}]`, path: childPath, type: "removed", oldValue: oldArr[i], changeCount: 1 });
    } else {
      children.push(computeJsonTreeDiff(oldArr[i], newArr[i], opts, childPath));
    }
  }
  return children;
}

function diffArrayIgnoreOrder(oldArr: unknown[], newArr: unknown[], opts: DiffOptions, path: string): DiffNode[] {
  const children: DiffNode[] = [];
  const oldStrs = oldArr.map((v) => JSON.stringify(v));
  const newStrs = newArr.map((v) => JSON.stringify(v));
  const matched = new Set<number>();

  oldStrs.forEach((s, i) => {
    const j = newStrs.findIndex((ns, idx) => !matched.has(idx) && ns === s);
    if (j >= 0) {
      matched.add(j);
      children.push({ key: `[${i}]`, path: `${path}[${i}]`, type: "equal", oldValue: oldArr[i], newValue: newArr[j], changeCount: 0 });
    } else {
      children.push({ key: `[${i}]`, path: `${path}[${i}]`, type: "removed", oldValue: oldArr[i], changeCount: 1 });
    }
  });

  newArr.forEach((v, j) => {
    if (!matched.has(j)) {
      children.push({ key: `[${j}]`, path: `${path}[${j}]`, type: "added", newValue: v, changeCount: 1 });
    }
  });

  return children;
}

function diffArrayByKey(oldArr: unknown[], newArr: unknown[], opts: DiffOptions, path: string): DiffNode[] {
  const key = opts.arrayMatchKey;
  const children: DiffNode[] = [];

  const oldMap = new Map<string, { item: unknown; idx: number }>();
  const newMap = new Map<string, { item: unknown; idx: number }>();

  oldArr.forEach((item, idx) => {
    const k = getKeyValue(item, key);
    if (k !== undefined) oldMap.set(String(k), { item, idx });
  });
  newArr.forEach((item, idx) => {
    const k = getKeyValue(item, key);
    if (k !== undefined) newMap.set(String(k), { item, idx });
  });

  // Items in old
  for (const [k, { item, idx }] of oldMap) {
    const childPath = `${path}[${key}=${k}]`;
    if (newMap.has(k)) {
      children.push(computeJsonTreeDiff(item, newMap.get(k)!.item, opts, childPath));
    } else {
      children.push({ key: `[${key}=${k}]`, path: childPath, type: "removed", oldValue: item, changeCount: 1 });
    }
  }

  // Items only in new
  for (const [k, { item }] of newMap) {
    if (!oldMap.has(k)) {
      const childPath = `${path}[${key}=${k}]`;
      children.push({ key: `[${key}=${k}]`, path: childPath, type: "added", newValue: item, changeCount: 1 });
    }
  }

  return children;
}

function getKeyValue(item: unknown, key: string): unknown {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    return (item as Record<string, unknown>)[key];
  }
  return undefined;
}

export function getSummary(node: DiffNode): DiffSummary {
  const summary: DiffSummary = { keysAdded: 0, keysRemoved: 0, valuesModified: 0, arraysChanged: 0, totalChanges: 0 };
  walkTree(node, summary);
  summary.totalChanges = summary.keysAdded + summary.keysRemoved + summary.valuesModified + summary.arraysChanged;
  return summary;
}

function walkTree(node: DiffNode, summary: DiffSummary) {
  if (!node.children) {
    if (node.type === "added") summary.keysAdded++;
    else if (node.type === "removed") summary.keysRemoved++;
    else if (node.type === "modified") summary.valuesModified++;
    return;
  }
  if (node.path.includes("[") && node.type === "modified") summary.arraysChanged++;
  for (const child of node.children) {
    walkTree(child, summary);
  }
}

function countNodes(val: unknown): number {
  if (val && typeof val === "object") {
    if (Array.isArray(val)) return val.reduce((s: number, v) => s + countNodes(v), 1);
    return Object.values(val as Record<string, unknown>).reduce<number>((s, v) => s + countNodes(v), 1);
  }
  return 1;
}

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function pathKey(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1] || path;
}
