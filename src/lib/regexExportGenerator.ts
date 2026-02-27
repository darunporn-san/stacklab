export type ExportFormat = "javascript" | "typescript" | "react-hook" | "vue-composable" | "yup" | "zod" | "html-pattern" | "json-config";

export function generateExport(pattern: string, format: ExportFormat): string {
  const raw = pattern;

  switch (format) {
    case "javascript":
      return `const pattern = /${raw}/;\n\nfunction isValid(value) {\n  return pattern.test(value);\n}\n\n// Usage:\n// isValid("test123") → true/false`;

    case "typescript":
      return `const pattern = /${raw}/;\n\nexport const isValid = (value: string): boolean => {\n  return pattern.test(value);\n};\n\n// Usage:\n// isValid("test123") → true/false`;

    case "react-hook":
      return `import { useState, useCallback } from "react";\n\nconst PATTERN = /${raw}/;\n\nexport function useValidation() {\n  const [value, setValue] = useState("");\n  const [isValid, setIsValid] = useState(false);\n  const [error, setError] = useState("");\n\n  const validate = useCallback((input: string) => {\n    setValue(input);\n    const valid = PATTERN.test(input);\n    setIsValid(valid);\n    setError(valid ? "" : "Invalid format");\n    return valid;\n  }, []);\n\n  return { value, isValid, error, validate, setValue };\n}`;

    case "vue-composable":
      return `import { ref, computed } from "vue";\n\nconst PATTERN = /${raw}/;\n\nexport function useValidation() {\n  const value = ref("");\n  const isValid = computed(() => PATTERN.test(value.value));\n  const error = computed(() => isValid.value ? "" : "Invalid format");\n\n  function validate(input: string) {\n    value.value = input;\n    return isValid.value;\n  }\n\n  return { value, isValid, error, validate };\n}`;

    case "yup":
      return `import * as yup from "yup";\n\nconst schema = yup.string()\n  .matches(/${raw}/, "Invalid format")\n  .required("Required");\n\n// Usage:\n// await schema.validate("test123")`;

    case "zod":
      return `import { z } from "zod";\n\nconst schema = z.string()\n  .regex(/${raw}/, "Invalid format");\n\n// Usage:\n// schema.parse("test123")`;

    case "html-pattern": {
      const htmlPat = raw.replace(/^\^/, "").replace(/\$$/, "");
      return `<input\n  type="text"\n  pattern="${htmlPat}"\n  title="Please match the required format"\n  required\n/>`;
    }

    case "json-config":
      return `{\n  "pattern": "${raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",\n  "flags": "",\n  "message": "Invalid format"\n}`;

    default:
      return "";
  }
}

export const exportFormats: { value: ExportFormat; label: string }[] = [
  { value: "javascript", label: "JavaScript RegExp" },
  { value: "typescript", label: "TypeScript Function" },
  { value: "react-hook", label: "React Hook" },
  { value: "vue-composable", label: "Vue Composable" },
  { value: "yup", label: "Yup Schema" },
  { value: "zod", label: "Zod Schema" },
  { value: "html-pattern", label: "HTML Pattern" },
  { value: "json-config", label: "JSON Config" },
];
