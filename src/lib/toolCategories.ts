import {
  Braces,
  Key,
  Binary,
  Regex,
  Fingerprint,
  Clock,
  Terminal,
  FileType,
  CaseSensitive,
  Image,
  GitCompareArrows,
  FileCode,
  Monitor,
  LayoutGrid,
  GitCompare,
  TreesIcon,
  Sparkles,
} from "lucide-react";

export interface ToolItem {
  id: string;
  label: string;
  icon: typeof Braces;
  path: string;
}

export interface ToolCategory {
  label: string;
  icon: typeof Braces;
  tools: ToolItem[];
}

export const toolCategories: ToolCategory[] = [
  {
    label: "JSON & Data",
    icon: Braces,
    tools: [
      // { id: "json-formatter", label: "JSON Formatter", icon: Braces, path: "/json-formatter" },
      { id: "json-tree-viewer", label: "JSON Tree Viewer", icon: TreesIcon, path: "/json-tree-viewer" },
      // { id: "json-to-typescript", label: "JSON → TypeScript", icon: FileType, path: "/json-to-typescript" },
      { id: "smart-json-to-typescript", label: "JSON → TS Pro", icon: Sparkles, path: "/smart-json-to-typescript" },
    ],
  },
  {
    label: "Encoding & Security",
    icon: Key,
    tools: [
      { id: "jwt-decoder", label: "JWT Decoder", icon: Key, path: "/jwt-decoder" },
      { id: "base64-encoder", label: "Base64 Encoder", icon: Binary, path: "/base64-encoder" },
      { id: "uuid-generator", label: "UUID Generator", icon: Fingerprint, path: "/uuid-generator" },
    ],
  },
  {
    label: "Comparison Tools",
    icon: GitCompareArrows,
    tools: [
      // { id: "diff-checker", label: "Diff Checker (Basic)", icon: GitCompareArrows, path: "/diff-checker" },
      { id: "advanced-json-diff", label: "Advanced JSON Diff", icon: GitCompare, path: "/advanced-json-diff" },
    ],
  },
  {
    label: "API & Network",
    icon: Terminal,
    tools: [
      // { id: "curl-to-fetch", label: "Curl → Fetch", icon: Terminal, path: "/curl-to-fetch" },
      {
        id: "route-query-splitter",
        label: "Route & Query Splitter",
        icon: GitCompareArrows,
        path: "/route-query-splitter",
      },
    ],
  },
  {
    label: "Text & Code",
    icon: CaseSensitive,
    tools: [
      { id: "regex-tester", label: "Regex Tester", icon: Regex, path: "/regex-tester" },
      { id: "case-converter", label: "Case Converter", icon: CaseSensitive, path: "/case-converter" },
    ],
  },
  {
    label: "Converters",
    icon: Clock,
    tools: [
      { id: "timestamp-converter", label: "Timestamp Converter", icon: Clock, path: "/timestamp-converter" },
      { id: "svg-optimizer", label: "SVG Optimizer", icon: FileCode, path: "/svg-optimizer" },
      { id: "image-converter", label: "Image Converter", icon: Image, path: "/image-converter" },
    ],
  },
  {
    label: "Responsive Design",
    icon: Monitor,
    tools: [
      { id: "responsive-playground", label: "Responsive Playground", icon: Monitor, path: "/responsive-playground" },
      { id: "responsive-layout-lab", label: "Layout Lab", icon: LayoutGrid, path: "/responsive-layout-lab" },
    ],
  },
];

// Flat list for compatibility
export const allTools = toolCategories.flatMap((c) => c.tools);
