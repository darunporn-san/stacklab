// Smart Type Inference Engine
// Handles: primitives, nullable, union, optional, string literal unions, enums, nested extraction

export interface InferenceOptions {
  rootName: string;
  generateAs: "interface" | "type" | "zod" | "yup" | "json-schema";
  useExport: boolean;
  useReadonly: boolean;
  strictMode: boolean;
  allOptional: boolean;
  extractEnums: boolean;
  extractNested: boolean;
  namingStyle: "PascalCase" | "camelCase";
  apiResponseMode: boolean;
  responseTypeName: string;
}

export const defaultOptions: InferenceOptions = {
  rootName: "Root",
  generateAs: "interface",
  useExport: true,
  useReadonly: false,
  strictMode: false,
  allOptional: false,
  extractEnums: false,
  extractNested: true,
  namingStyle: "PascalCase",
  apiResponseMode: true,
  responseTypeName: "ApiResponse",
};

export interface AnalysisResult {
  objectsDetected: number;
  arraysDetected: number;
  optionalFields: number;
  nullableFields: number;
  unionTypes: number;
  enumCandidates: number;
  nestedInterfaces: number;
  complexity: "Low" | "Medium" | "High" | "Very High";
}

interface FieldInfo {
  types: Set<string>;
  values: Set<string>;
  occurrences: number;
  totalObjects: number;
  isNullable: boolean;
  children?: Map<string, FieldInfo>;
  arrayItemInfo?: FieldInfo;
}

interface ExtractedType {
  name: string;
  body: string;
}

function toPascal(s: string): string {
  return s.replace(/(^|[_\-\s])(\w)/g, (_, __, c) => c.toUpperCase()).replace(/^(\w)/, (_, c) => c.toUpperCase());
}

function toCamel(s: string): string {
  const p = toPascal(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function applyNaming(s: string, style: "PascalCase" | "camelCase"): string {
  return style === "PascalCase" ? toPascal(s) : toCamel(s);
}

function getJsType(val: unknown): string {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

const ENUM_MAX_VALUES = 10;
const ENUM_MIN_VALUES = 2;

function mergeObjectFields(objects: Record<string, unknown>[]): Map<string, FieldInfo> {
  const fields = new Map<string, FieldInfo>();
  const total = objects.length;

  for (const obj of objects) {
    for (const [key, val] of Object.entries(obj)) {
      let info = fields.get(key);
      if (!info) {
        info = { types: new Set(), values: new Set(), occurrences: 0, totalObjects: total, isNullable: false };
        fields.set(key, info);
      }
      info.occurrences++;
      const t = getJsType(val);
      info.types.add(t);

      if (val === null) {
        info.isNullable = true;
      } else if (t === "string" && info.values.size < ENUM_MAX_VALUES + 1) {
        info.values.add(val as string);
      } else if (t === "object" && !Array.isArray(val)) {
        if (!info.children) info.children = new Map();
        // merge later
      }
    }
  }

  // Now deep-merge children
  for (const [key, info] of fields) {
    if (info.types.has("object")) {
      const childObjects = objects
        .filter((o) => o[key] !== null && o[key] !== undefined && typeof o[key] === "object" && !Array.isArray(o[key]))
        .map((o) => o[key] as Record<string, unknown>);
      if (childObjects.length > 0) {
        info.children = mergeObjectFields(childObjects);
      }
    }
    if (info.types.has("array")) {
      const allItems: unknown[] = [];
      for (const obj of objects) {
        const arr = obj[key];
        if (Array.isArray(arr)) allItems.push(...arr);
      }
      info.arrayItemInfo = inferArrayItems(allItems);
    }
  }

  return fields;
}

function inferArrayItems(items: unknown[]): FieldInfo {
  const info: FieldInfo = { types: new Set(), values: new Set(), occurrences: items.length, totalObjects: items.length, isNullable: false };
  const objectItems: Record<string, unknown>[] = [];

  for (const item of items) {
    const t = getJsType(item);
    info.types.add(t);
    if (item === null) info.isNullable = true;
    if (t === "string" && info.values.size < ENUM_MAX_VALUES + 1) info.values.add(item as string);
    if (t === "object" && !Array.isArray(item)) objectItems.push(item as Record<string, unknown>);
    if (t === "array") {
      const nested = inferArrayItems(item as unknown[]);
      info.arrayItemInfo = nested;
    }
  }

  if (objectItems.length > 0) {
    info.children = mergeObjectFields(objectItems);
  }

  return info;
}

function inferFromValue(val: unknown): FieldInfo {
  const t = getJsType(val);
  const info: FieldInfo = { types: new Set([t]), values: new Set(), occurrences: 1, totalObjects: 1, isNullable: val === null };

  if (t === "string") info.values.add(val as string);
  if (t === "object" && val !== null) {
    info.children = mergeObjectFields([val as Record<string, unknown>]);
  }
  if (t === "array") {
    info.arrayItemInfo = inferArrayItems(val as unknown[]);
  }
  return info;
}

// --- Code Generation ---

function fieldInfoToTsType(info: FieldInfo, name: string, opts: InferenceOptions, extracted: ExtractedType[], depth: number): string {
  const types: string[] = [];

  for (const t of info.types) {
    if (t === "null") continue;
    if (t === "string") {
      // Check enum candidate
      if (info.values.size >= ENUM_MIN_VALUES && info.values.size <= ENUM_MAX_VALUES && opts.extractEnums) {
        const enumName = applyNaming(name, opts.namingStyle);
        const unionStr = [...info.values].map((v) => `"${v}"`).join(" | ");
        extracted.push({ name: enumName, body: unionStr });
        types.push(enumName);
      } else if (info.values.size >= ENUM_MIN_VALUES && info.values.size <= ENUM_MAX_VALUES) {
        types.push([...info.values].map((v) => `"${v}"`).join(" | "));
      } else {
        types.push("string");
      }
    } else if (t === "number") {
      types.push("number");
    } else if (t === "boolean") {
      types.push("boolean");
    } else if (t === "object" && info.children) {
      if (opts.extractNested && depth > 0) {
        const typeName = applyNaming(name, opts.namingStyle);
        const body = generateInterfaceBody(info.children, opts, extracted, depth + 1);
        extracted.push({ name: typeName, body: `{\n${body}}` });
        types.push(typeName);
      } else {
        const body = generateInterfaceBody(info.children, opts, extracted, depth + 1);
        types.push(`{\n${body}}`);
      }
    } else if (t === "array" && info.arrayItemInfo) {
      const itemType = fieldInfoToTsType(info.arrayItemInfo, name + "Item", opts, extracted, depth + 1);
      types.push(`${itemType.includes("|") || itemType.includes("{") ? `(${itemType})` : itemType}[]`);
    } else if (t === "array") {
      types.push("unknown[]");
    } else if (t === "object") {
      types.push("Record<string, unknown>");
    } else {
      types.push(t);
    }
  }

  if (info.isNullable) types.push("null");
  if (types.length === 0) return "unknown";
  return types.length === 1 ? types[0] : types.join(" | ");
}

function generateInterfaceBody(fields: Map<string, FieldInfo>, opts: InferenceOptions, extracted: ExtractedType[], depth: number): string {
  const lines: string[] = [];
  const indent = "  ";

  for (const [key, info] of fields) {
    const isOptional = opts.allOptional || info.occurrences < info.totalObjects;
    const ro = opts.useReadonly ? "readonly " : "";
    const opt = isOptional ? "?" : "";
    const tsType = fieldInfoToTsType(info, key, opts, extracted, depth);
    lines.push(`${indent}${ro}${key}${opt}: ${tsType};`);
  }

  return lines.join("\n") + "\n";
}

function generateTs(data: unknown, opts: InferenceOptions): { code: string; analysis: AnalysisResult } {
  const extracted: ExtractedType[] = [];
  const exp = opts.useExport ? "export " : "";
  let rootInfo: FieldInfo;
  let isArray = false;

  if (Array.isArray(data)) {
    isArray = true;
    rootInfo = inferArrayItems(data);
  } else if (typeof data === "object" && data !== null) {
    const fields = mergeObjectFields([data as Record<string, unknown>]);
    rootInfo = { types: new Set(["object"]), values: new Set(), occurrences: 1, totalObjects: 1, isNullable: false, children: fields };
  } else {
    return { code: `${exp}type ${opts.rootName} = ${typeof data};`, analysis: emptyAnalysis() };
  }

  // Generate root
  let rootBody = "";
  if (rootInfo.children) {
    rootBody = generateInterfaceBody(rootInfo.children, opts, extracted, 1);
  } else if (isArray && rootInfo.arrayItemInfo?.children) {
    rootBody = generateInterfaceBody(rootInfo.arrayItemInfo.children, opts, extracted, 1);
  }

  // Build analysis
  const analysis = buildAnalysis(rootInfo, extracted, opts);

  // Build output
  const parts: string[] = [];

  // Extracted types first
  for (const et of extracted) {
    if (et.body.startsWith("{")) {
      if (opts.generateAs === "type") {
        parts.push(`${exp}type ${et.name} = ${et.body}`);
      } else {
        parts.push(`${exp}interface ${et.name} ${et.body}`);
      }
    } else {
      parts.push(`${exp}type ${et.name} = ${et.body};`);
    }
  }

  // Root type
  const rootName = applyNaming(opts.rootName, opts.namingStyle);
  if (rootBody) {
    if (opts.generateAs === "type") {
      parts.push(`${exp}type ${rootName} = {\n${rootBody}}`);
    } else {
      parts.push(`${exp}interface ${rootName} {\n${rootBody}}`);
    }
  }

  // API Response type
  if (isArray && opts.apiResponseMode) {
    const itemName = rootName;
    const respName = applyNaming(opts.responseTypeName, opts.namingStyle);
    parts.push(`${exp}type ${respName} = ${itemName}[];`);
  }

  return { code: parts.join("\n\n"), analysis };
}

function generateZod(data: unknown, opts: InferenceOptions): { code: string; analysis: AnalysisResult } {
  const extracted: ExtractedType[] = [];
  let rootInfo: FieldInfo;
  let isArray = false;

  if (Array.isArray(data)) {
    isArray = true;
    rootInfo = inferArrayItems(data);
  } else if (typeof data === "object" && data !== null) {
    const fields = mergeObjectFields([data as Record<string, unknown>]);
    rootInfo = { types: new Set(["object"]), values: new Set(), occurrences: 1, totalObjects: 1, isNullable: false, children: fields };
  } else {
    return { code: `import { z } from "zod";\n\nexport const ${opts.rootName}Schema = z.${typeof data}();`, analysis: emptyAnalysis() };
  }

  const fields = isArray ? (rootInfo.children || rootInfo.arrayItemInfo?.children) : rootInfo.children;
  const analysis = buildAnalysis(rootInfo, extracted, opts);

  function fieldToZod(info: FieldInfo, name: string): string {
    const zodParts: string[] = [];
    for (const t of info.types) {
      if (t === "null") continue;
      if (t === "string") {
        if (info.values.size >= ENUM_MIN_VALUES && info.values.size <= ENUM_MAX_VALUES) {
          zodParts.push(`z.enum([${[...info.values].map((v) => `"${v}"`).join(", ")}])`);
        } else {
          zodParts.push("z.string()");
        }
      } else if (t === "number") zodParts.push("z.number()");
      else if (t === "boolean") zodParts.push("z.boolean()");
      else if (t === "object" && info.children) {
        const inner = [...info.children.entries()].map(([k, v]) => `  ${k}: ${fieldToZod(v, k)}`).join(",\n");
        zodParts.push(`z.object({\n${inner}\n})`);
      } else if (t === "array" && info.arrayItemInfo) {
        zodParts.push(`z.array(${fieldToZod(info.arrayItemInfo, name + "Item")})`);
      } else zodParts.push("z.unknown()");
    }

    let result = zodParts.length > 1 ? `z.union([${zodParts.join(", ")}])` : zodParts[0] || "z.unknown()";
    if (info.isNullable) result += ".nullable()";
    if (info.occurrences < info.totalObjects || opts.allOptional) result += ".optional()";
    return result;
  }

  const lines: string[] = ['import { z } from "zod";', ""];
  if (fields) {
    const inner = [...fields.entries()].map(([k, v]) => `  ${k}: ${fieldToZod(v, k)}`).join(",\n");
    const schemaName = `${opts.rootName}Schema`;
    lines.push(`export const ${schemaName} = z.object({\n${inner}\n});`);
    lines.push(`\nexport type ${opts.rootName} = z.infer<typeof ${schemaName}>;`);
    if (isArray && opts.apiResponseMode) {
      lines.push(`\nexport const ${opts.responseTypeName}Schema = z.array(${schemaName});`);
    }
  }

  return { code: lines.join("\n"), analysis };
}

function generateJsonSchema(data: unknown, opts: InferenceOptions): { code: string; analysis: AnalysisResult } {
  const extracted: ExtractedType[] = [];
  let rootInfo: FieldInfo;

  if (Array.isArray(data)) {
    rootInfo = inferArrayItems(data);
  } else if (typeof data === "object" && data !== null) {
    const fields = mergeObjectFields([data as Record<string, unknown>]);
    rootInfo = { types: new Set(["object"]), values: new Set(), occurrences: 1, totalObjects: 1, isNullable: false, children: fields };
  } else {
    return { code: JSON.stringify({ type: typeof data }, null, 2), analysis: emptyAnalysis() };
  }

  const analysis = buildAnalysis(rootInfo, extracted, opts);

  function fieldToJsonSchema(info: FieldInfo): Record<string, unknown> {
    const schema: Record<string, unknown> = {};
    const tsTypes: string[] = [];
    for (const t of info.types) {
      if (t === "null") continue;
      if (t === "string") tsTypes.push("string");
      else if (t === "number") tsTypes.push("number");
      else if (t === "boolean") tsTypes.push("boolean");
      else if (t === "object" && info.children) {
        schema.type = "object";
        const props: Record<string, unknown> = {};
        for (const [k, v] of info.children) props[k] = fieldToJsonSchema(v);
        schema.properties = props;
        return schema;
      } else if (t === "array" && info.arrayItemInfo) {
        schema.type = "array";
        schema.items = fieldToJsonSchema(info.arrayItemInfo);
        return schema;
      }
    }
    if (info.isNullable) tsTypes.push("null");
    schema.type = tsTypes.length === 1 ? tsTypes[0] : tsTypes;
    if (info.values.size >= ENUM_MIN_VALUES && info.values.size <= ENUM_MAX_VALUES) {
      schema.enum = [...info.values];
    }
    return schema;
  }

  const fields = rootInfo.children || rootInfo.arrayItemInfo?.children;
  const root: Record<string, unknown> = { $schema: "http://json-schema.org/draft-07/schema#", type: "object" };
  if (fields) {
    const props: Record<string, unknown> = {};
    for (const [k, v] of fields) props[k] = fieldToJsonSchema(v);
    root.properties = props;
  }

  return { code: JSON.stringify(root, null, 2), analysis };
}

function emptyAnalysis(): AnalysisResult {
  return { objectsDetected: 0, arraysDetected: 0, optionalFields: 0, nullableFields: 0, unionTypes: 0, enumCandidates: 0, nestedInterfaces: 0, complexity: "Low" };
}

function buildAnalysis(rootInfo: FieldInfo, extracted: ExtractedType[], opts: InferenceOptions): AnalysisResult {
  let objects = 0, arrays = 0, optional = 0, nullable = 0, unions = 0, enums = 0;

  function walk(info: FieldInfo) {
    if (info.types.has("object")) objects++;
    if (info.types.has("array")) arrays++;
    if (info.isNullable) nullable++;
    if (info.types.size > 1) unions++;
    if (info.occurrences < info.totalObjects) optional++;
    if (info.values.size >= ENUM_MIN_VALUES && info.values.size <= ENUM_MAX_VALUES) enums++;
    if (info.children) for (const c of info.children.values()) walk(c);
    if (info.arrayItemInfo) walk(info.arrayItemInfo);
  }
  walk(rootInfo);

  const total = objects + arrays + unions + nullable;
  const complexity = total > 20 ? "Very High" : total > 10 ? "High" : total > 4 ? "Medium" : "Low";

  return {
    objectsDetected: objects,
    arraysDetected: arrays,
    optionalFields: opts.allOptional ? optional + objects * 3 : optional,
    nullableFields: nullable,
    unionTypes: unions,
    enumCandidates: enums,
    nestedInterfaces: extracted.filter((e) => e.body.startsWith("{")).length,
    complexity,
  };
}

export function generateOutput(json: unknown, opts: InferenceOptions): { code: string; analysis: AnalysisResult } {
  switch (opts.generateAs) {
    case "zod":
    case "yup":
      return generateZod(json, opts);
    case "json-schema":
      return generateJsonSchema(json, opts);
    default:
      return generateTs(json, opts);
  }
}

export const SAMPLE_JSON = `[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "admin",
    "age": 32,
    "active": true,
    "profile": {
      "bio": "Senior developer",
      "avatar": "https://example.com/alice.jpg",
      "social": {
        "twitter": "@alice",
        "github": "alicej"
      }
    },
    "tags": ["react", "typescript", "node"],
    "metadata": null
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "role": "editor",
    "age": 28,
    "active": false,
    "profile": {
      "bio": null,
      "avatar": "https://example.com/bob.jpg",
      "social": {
        "twitter": "@bob",
        "github": null
      }
    },
    "tags": ["vue", "python"],
    "metadata": { "lastLogin": "2024-01-15" }
  }
]`;
