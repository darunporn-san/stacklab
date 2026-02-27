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

export function generateFetchCode(baseUrl: string, queryParams: QueryParam[]): string {
  if (queryParams.length === 0) return "";

  const lines: string[] = [];
  lines.push(`const url = new URL("${baseUrl}");`);
  lines.push("");
  for (const q of queryParams) {
    lines.push(`url.searchParams.set("${q.key}", "${q.value}");`);
  }
  lines.push("");
  lines.push("const response = await fetch(url);");
  lines.push("const data = await response.json();");

  return lines.join("\n");
}

export function generateAxiosCode(baseUrl: string, queryParams: QueryParam[]): string {
  if (queryParams.length === 0) return "";

  const paramEntries = queryParams
    .map((q) => `    ${q.key}: ${formatValue(q.value, q.detectedType)},`)
    .join("\n");

  return `const { data } = await axios.get("${baseUrl}", {
  params: {
${paramEntries}
  },
});`;
}
