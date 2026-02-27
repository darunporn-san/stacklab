import type { QueryParam } from "./urlParser";

function formatValue(value: string, detectedType: string): string {
  switch (detectedType) {
    case "number":
      return value;
    case "boolean":
      return value;
    case "null":
      return "null";
    default:
      return `"${value}"`;
  }
}

export function buildBaseUrl(protocol: string, host: string, fullPath: string): string {
  if (protocol && host) {
    return `${protocol}://${host}${fullPath}`;
  }
  return fullPath;
}

function formatHeaders(headers: Record<string, string>, indent: string): string {
  const entries = Object.entries(headers);
  if (entries.length === 0) return "";
  const lines = entries.map(([k, v]) => `${indent}  "${k}": "${v}",`).join("\n");
  return `${indent}headers: {\n${lines}\n${indent}},`;
}

export function generateFetchURLSearchParams(
  baseUrl: string,
  queryParams: QueryParam[],
  method: string = "GET",
  headers: Record<string, string> = {}
): string {
  if (queryParams.length === 0) return "";

  const entries = queryParams
    .map((q) => `  ${q.key}: "${q.value}",`)
    .join("\n");

  const hasOptions = method !== "GET" || Object.keys(headers).length > 0;
  let optionsBlock = "";
  if (hasOptions) {
    const parts: string[] = [];
    if (method !== "GET") parts.push(`  method: "${method}",`);
    const hdr = formatHeaders(headers, "  ");
    if (hdr) parts.push(hdr);
    optionsBlock = `, {\n${parts.join("\n")}\n}`;
  }

  return `const params = new URLSearchParams({
${entries}
});

const response = await fetch(\`${baseUrl}?\${params}\`${optionsBlock});
const data = await response.json();`;
}

export function generateFetchURL(
  baseUrl: string,
  queryParams: QueryParam[],
  method: string = "GET",
  headers: Record<string, string> = {}
): string {
  if (queryParams.length === 0) return "";

  const lines: string[] = [];
  lines.push(`const url = new URL("${baseUrl}");`);
  lines.push("");
  for (const q of queryParams) {
    lines.push(`url.searchParams.set("${q.key}", "${q.value}");`);
  }
  lines.push("");

  const hasOptions = method !== "GET" || Object.keys(headers).length > 0;
  if (hasOptions) {
    const parts: string[] = [];
    if (method !== "GET") parts.push(`  method: "${method}",`);
    const hdr = formatHeaders(headers, "  ");
    if (hdr) parts.push(hdr);
    lines.push(`const response = await fetch(url.toString(), {`);
    lines.push(parts.join("\n"));
    lines.push(`});`);
  } else {
    lines.push("const response = await fetch(url.toString());");
  }
  lines.push("const data = await response.json();");

  return lines.join("\n");
}

export function generateAxiosCode(
  baseUrl: string,
  queryParams: QueryParam[],
  method: string = "GET",
  headers: Record<string, string> = {}
): string {
  if (queryParams.length === 0) return "";

  const paramEntries = queryParams
    .map((q) => `    ${q.key}: ${formatValue(q.value, q.detectedType)},`)
    .join("\n");

  const methodLower = method.toLowerCase();
  const configParts: string[] = [];
  configParts.push(`  params: {\n${paramEntries}\n  },`);
  
  const hdr = formatHeaders(headers, "  ");
  if (hdr) configParts.push(hdr);

  return `const { data } = await axios.${methodLower}("${baseUrl}", {
${configParts.join("\n")}
});`;
}
