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
  Palette,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export interface ToolItem {
  id: string;
  labelKey: string; // i18n key
  label: string; // fallback English
  icon: typeof Braces;
  path: string;
}

export interface ToolCategory {
  labelKey: string; // i18n key
  label: string; // fallback
  icon: typeof Braces;
  tools: ToolItem[];
}

export const toolCategories: ToolCategory[] = [
  {
    label: "JSON & Data", labelKey: "nav.jsonData", icon: Braces,
    tools: [
      { id: "json-tree-viewer", label: "JSON Tree Viewer", labelKey: "tools.jsonTreeViewer", icon: TreesIcon, path: "/json-tree-viewer" },
      { id: "smart-json-to-typescript", label: "JSON → TS Pro", labelKey: "tools.smartJsonTs", icon: Sparkles, path: "/smart-json-to-typescript" },
    ],
  },
  {
    label: "Encoding & Security", labelKey: "nav.encodingSecurity", icon: Key,
    tools: [
      { id: "jwt-decoder", label: "JWT Decoder", labelKey: "tools.jwtDecoder", icon: Key, path: "/jwt-decoder" },
      { id: "base64-encoder", label: "Base64 Encoder", labelKey: "tools.base64Encoder", icon: Binary, path: "/base64-encoder" },
      { id: "uuid-generator", label: "UUID Generator", labelKey: "tools.uuidGenerator", icon: Fingerprint, path: "/uuid-generator" },
    ],
  },
  {
    label: "Comparison Tools", labelKey: "nav.comparisonTools", icon: GitCompareArrows,
    tools: [
      { id: "advanced-json-diff", label: "Advanced JSON Diff", labelKey: "tools.advancedJsonDiff", icon: GitCompare, path: "/advanced-json-diff" },
    ],
  },
  {
    label: "API & Network", labelKey: "nav.apiNetwork", icon: Terminal,
    tools: [
      { id: "route-query-splitter", label: "Route & Query Splitter", labelKey: "tools.routeQuerySplitter", icon: GitCompareArrows, path: "/route-query-splitter" },
    ],
  },
  {
    label: "Text & Code", labelKey: "nav.textCode", icon: CaseSensitive,
    tools: [
      { id: "regex-tester", label: "Regex Tester", labelKey: "tools.regexTester", icon: Regex, path: "/regex-tester" },
      { id: "form-validation", label: "Form Validation", labelKey: "tools.formValidation", icon: ShieldCheck, path: "/form-validation" },
      { id: "case-converter", label: "Case Converter", labelKey: "tools.caseConverter", icon: CaseSensitive, path: "/case-converter" },
    ],
  },
  {
    label: "Converters", labelKey: "nav.converters", icon: Clock,
    tools: [
      { id: "timestamp-converter", label: "Timestamp Converter", labelKey: "tools.timestampConverter", icon: Clock, path: "/timestamp-converter" },
      { id: "svg-optimizer", label: "SVG Optimizer", labelKey: "tools.svgOptimizer", icon: FileCode, path: "/svg-optimizer" },
      { id: "image-converter", label: "Image Converter", labelKey: "tools.imageConverter", icon: Image, path: "/image-converter" },
    ],
  },
  {
    label: "Color & CSS", labelKey: "nav.colorCss", icon: Palette,
    tools: [
      { id: "color-css-utilities", label: "Color & CSS Utilities", labelKey: "tools.colorCssUtilities", icon: Palette, path: "/color-css-utilities" },
    ],
  },
  {
    label: "Responsive Design", labelKey: "nav.responsiveDesign", icon: Monitor,
    tools: [
      { id: "responsive-playground", label: "Responsive Playground", labelKey: "tools.responsivePlayground", icon: Monitor, path: "/responsive-playground" },
      { id: "responsive-layout-lab", label: "Layout Lab", labelKey: "tools.layoutLab", icon: LayoutGrid, path: "/responsive-layout-lab" },
    ],
  },
  {
    label: "Frontend Core Utilities", labelKey: "nav.frontendCore", icon: Wrench,
    tools: [
      { id: "frontend-core-utilities", label: "Frontend Core Utilities", labelKey: "tools.frontendCoreUtilities", icon: Wrench, path: "/frontend-core-utilities" },
    ],
  },
];

export const allTools = toolCategories.flatMap((c) => c.tools);
