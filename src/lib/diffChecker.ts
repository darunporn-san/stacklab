export interface DiffLine {
  type: "equal" | "added" | "removed";
  content: string;
  lineOld?: number;
  lineNew?: number;
}

export interface DiffStats {
  added: number;
  removed: number;
  changed: number;
  total: number;
}

export function computeDiff(
  original: string,
  modified: string,
  opts: { ignoreWhitespace?: boolean; ignoreJsonKeyOrder?: boolean; jsonFormat?: boolean } = {}
): DiffLine[] {
  let a = original;
  let b = modified;

  if (opts.jsonFormat) {
    a = tryFormatJson(a);
    b = tryFormatJson(b);
  }

  if (opts.ignoreJsonKeyOrder) {
    a = trySortJsonKeys(a);
    b = trySortJsonKeys(b);
  }

  let linesA = a.split("\n");
  let linesB = b.split("\n");

  if (opts.ignoreWhitespace) {
    linesA = linesA.map((l) => l.trim());
    linesB = linesB.map((l) => l.trim());
  }

  return myersDiff(linesA, linesB);
}

function myersDiff(a: string[], b: string[]): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const v: Record<number, number> = { 1: 0 };
  const trace: Record<number, number>[] = [];

  outer:
  for (let d = 0; d <= max; d++) {
    const vCopy: Record<number, number> = { ...v };
    trace.push(vCopy);
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && (v[k - 1] ?? 0) < (v[k + 1] ?? 0))) {
        x = v[k + 1] ?? 0;
      } else {
        x = (v[k - 1] ?? 0) + 1;
      }
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[k] = x;
      if (x >= n && y >= m) break outer;
    }
  }

  // Backtrack
  const result: DiffLine[] = [];
  let x = n;
  let y = m;

  for (let d = trace.length - 1; d >= 0; d--) {
    const vPrev = trace[d];
    const k = x - y;
    let prevK: number;
    if (k === -d || (k !== d && (vPrev[k - 1] ?? 0) < (vPrev[k + 1] ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = vPrev[prevK] ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      x--;
      y--;
      result.unshift({ type: "equal", content: a[x], lineOld: x + 1, lineNew: y + 1 });
    }

    if (d > 0) {
      if (x === prevX && y > prevY) {
        y--;
        result.unshift({ type: "added", content: b[y], lineNew: y + 1 });
      } else if (x > prevX && y === prevY) {
        x--;
        result.unshift({ type: "removed", content: a[x], lineOld: x + 1 });
      }
    }
  }

  return result;
}

export function getDiffStats(lines: DiffLine[]): DiffStats {
  let added = 0;
  let removed = 0;
  for (const l of lines) {
    if (l.type === "added") added++;
    if (l.type === "removed") removed++;
  }
  return { added, removed, changed: Math.min(added, removed), total: added + removed };
}

function tryFormatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

function trySortJsonKeys(str: string): string {
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(sortKeys(obj), null, 2);
  } catch {
    return str;
  }
}

function sortKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (obj && typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = sortKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}
