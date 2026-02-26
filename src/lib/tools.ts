import { Braces, Key, Binary, Regex, Fingerprint, Clock, Terminal, FileType } from "lucide-react";

export const tools = [
  { id: "json-formatter", label: "JSON Formatter", icon: Braces, path: "/json-formatter" },
  { id: "json-to-typescript", label: "JSON → TypeScript", icon: FileType, path: "/json-to-typescript" },
  { id: "jwt-decoder", label: "JWT Decoder", icon: Key, path: "/jwt-decoder" },
  { id: "base64-encoder", label: "Base64 Encoder", icon: Binary, path: "/base64-encoder" },
  { id: "regex-tester", label: "Regex Tester", icon: Regex, path: "/regex-tester" },
  { id: "uuid-generator", label: "UUID Generator", icon: Fingerprint, path: "/uuid-generator" },
  { id: "timestamp-converter", label: "Timestamp Converter", icon: Clock, path: "/timestamp-converter" },
  { id: "curl-to-fetch", label: "Curl → Fetch", icon: Terminal, path: "/curl-to-fetch" },
] as const;
