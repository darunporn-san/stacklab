export interface PathParam {
  key: string;
  pattern: string;
  type: string;
}

export interface QueryParam {
  key: string;
  value: string;
  detectedType: string;
}

export interface ParsedUrl {
  protocol: string;
  host: string;
  fullPath: string;
  rawQuery: string;
  pathParams: PathParam[];
  queryParams: QueryParam[];
}

const PATH_PARAM_PATTERNS = [
  { regex: /\$\{(\w+)\}/g, type: "${...}" },
  { regex: /:(\w+)/g, type: ":param" },
  { regex: /\[(\w+)\]/g, type: "[param]" },
  { regex: /\{(\w+)\}/g, type: "{param}" },
];

function detectValueType(value: string): string {
  if (value === "null") return "null";
  if (value === "true" || value === "false") return "boolean";
  if (value !== "" && !isNaN(Number(value))) return "number";
  return "string";
}

export function parseUrl(raw: string): ParsedUrl {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { protocol: "", host: "", fullPath: "", rawQuery: "", pathParams: [], queryParams: [] };
  }

  let protocol = "";
  let host = "";
  let fullPath = trimmed;
  let rawQuery = "";

  // Try parsing as full URL
  if (/^https?:\/\//.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      protocol = url.protocol.replace(":", "");
      host = url.host;
      fullPath = url.pathname;
      rawQuery = url.search.replace("?", "");
    } catch {
      // fallback below
    }
  } else {
    // Relative URL
    const qIndex = trimmed.indexOf("?");
    if (qIndex !== -1) {
      fullPath = trimmed.slice(0, qIndex);
      rawQuery = trimmed.slice(qIndex + 1);
    }
  }

  // Detect path params
  const pathParams: PathParam[] = [];
  const seen = new Set<string>();
  for (const { regex, type } of PATH_PARAM_PATTERNS) {
    let match: RegExpExecArray | null;
    const r = new RegExp(regex.source, regex.flags);
    while ((match = r.exec(fullPath)) !== null) {
      const key = match[1];
      if (!seen.has(key)) {
        seen.add(key);
        pathParams.push({ key, pattern: match[0], type });
      }
    }
  }

  // Parse query params
  const queryParams: QueryParam[] = [];
  if (rawQuery) {
    const sp = new URLSearchParams(rawQuery);
    sp.forEach((value, key) => {
      queryParams.push({ key, value, detectedType: detectValueType(value) });
    });
  }

  return { protocol, host, fullPath, rawQuery, pathParams, queryParams };
}
