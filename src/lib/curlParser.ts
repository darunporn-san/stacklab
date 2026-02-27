import { parseUrl, type ParsedUrl } from "./urlParser";

export interface ParsedInput {
  method: string;
  protocol: string;
  host: string;
  fullPath: string;
  rawQuery: string;
  pathParams: ParsedUrl["pathParams"];
  queryParams: ParsedUrl["queryParams"];
  headers: Record<string, string>;
  body: string | null;
  inputType: "url" | "curl";
}

export type InputMode = "auto" | "url" | "curl";

export function detectInputType(raw: string): "url" | "curl" {
  const trimmed = raw.trim();
  if (/^curl\s/i.test(trimmed)) return "curl";
  if (/\s-(X|H|d)\s|--request|--header|--data|--data-raw/i.test(trimmed)) return "curl";
  return "url";
}

function extractQuotedOrNext(args: string[], i: number): [string, number] {
  if (i >= args.length) return ["", i];
  return [args[i], i + 1];
}

function tokenize(raw: string): string[] {
  // Join multiline (backslash continuations)
  const single = raw.replace(/\\\s*\n/g, " ").trim();
  
  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < single.length; i++) {
    const ch = single[i];
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === " " && !inSingle && !inDouble) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);
  return tokens;
}

export function parseCurl(raw: string): ParsedInput {
  const tokens = tokenize(raw);
  
  let method = "GET";
  let url = "";
  const headers: Record<string, string> = {};
  let body: string | null = null;

  let i = 0;
  // skip "curl"
  if (tokens[0]?.toLowerCase() === "curl") i = 1;

  while (i < tokens.length) {
    const token = tokens[i];
    
    if (token === "-X" || token === "--request") {
      i++;
      if (i < tokens.length) { method = tokens[i].toUpperCase(); i++; }
      continue;
    }
    
    if (token === "-H" || token === "--header") {
      i++;
      if (i < tokens.length) {
        const headerStr = tokens[i];
        const colonIdx = headerStr.indexOf(":");
        if (colonIdx > 0) {
          const key = headerStr.slice(0, colonIdx).trim();
          const value = headerStr.slice(colonIdx + 1).trim();
          headers[key] = value;
        }
        i++;
      }
      continue;
    }
    
    if (token === "-d" || token === "--data" || token === "--data-raw" || token === "--data-binary") {
      i++;
      if (i < tokens.length) {
        body = tokens[i];
        if (method === "GET") method = "POST";
        i++;
      }
      continue;
    }

    // Skip flags we don't care about
    if (token.startsWith("-")) {
      i++;
      // Some flags take a value
      if (["-o", "--output", "-u", "--user", "--url", "-A", "--user-agent", "--cookie", "-b", "--connect-timeout", "--max-time"].includes(token)) {
        i++; // skip value
      }
      continue;
    }

    // Must be the URL
    if (!url) {
      url = token;
    }
    i++;
  }

  const parsed = parseUrl(url);

  return {
    method,
    protocol: parsed.protocol,
    host: parsed.host,
    fullPath: parsed.fullPath,
    rawQuery: parsed.rawQuery,
    pathParams: parsed.pathParams,
    queryParams: parsed.queryParams,
    headers,
    body,
    inputType: "curl",
  };
}

export function parseInput(raw: string, mode: InputMode): ParsedInput {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      method: "GET", protocol: "", host: "", fullPath: "", rawQuery: "",
      pathParams: [], queryParams: [], headers: {}, body: null, inputType: "url",
    };
  }

  const effectiveType = mode === "auto" ? detectInputType(trimmed) : mode;

  if (effectiveType === "curl") {
    return parseCurl(trimmed);
  }

  const parsed = parseUrl(trimmed);
  return {
    method: "GET",
    protocol: parsed.protocol,
    host: parsed.host,
    fullPath: parsed.fullPath,
    rawQuery: parsed.rawQuery,
    pathParams: parsed.pathParams,
    queryParams: parsed.queryParams,
    headers: {},
    body: null,
    inputType: "url",
  };
}
