export type ExportFormat = "javascript" | "typescript" | "react-hook" | "vue-composable" | "yup" | "zod" | "html-pattern";

export function generateExport(pattern: string, format: ExportFormat): string {
  const escaped = pattern.replace(/\\/g, "\\\\").replace(/\//g, "\\/");
  const raw = pattern;

  switch (format) {
    case "javascript":
      return `const pattern = /${raw}/;\n\nfunction isValid(value) {\n  return pattern.test(value);\n}`;

    case "typescript":
      return `const pattern = /${raw}/;\n\nexport const isValid = (value: string): boolean => {\n  return pattern.test(value);\n};`;

    case "react-hook":
      return `import { useState, useCallback } from "react";\n\nexport function useValidation() {\n  const pattern = /${raw}/;\n  const [isValid, setIsValid] = useState(false);\n  const [error, setError] = useState("");\n\n  const validate = useCallback((value: string) => {\n    const valid = pattern.test(value);\n    setIsValid(valid);\n    setError(valid ? "" : "Invalid format");\n    return valid;\n  }, []);\n\n  return { isValid, error, validate };\n}`;

    case "vue-composable":
      return `import { ref } from "vue";\n\nexport function useValidation() {\n  const pattern = /${raw}/;\n  const isValid = ref(false);\n  const error = ref("");\n\n  function validate(value: string) {\n    isValid.value = pattern.test(value);\n    error.value = isValid.value ? "" : "Invalid format";\n    return isValid.value;\n  }\n\n  return { isValid, error, validate };\n}`;

    case "yup":
      return `import * as yup from "yup";\n\nconst schema = yup.string()\n  .matches(/${raw}/, "Invalid format")\n  .required("Required");`;

    case "zod":
      return `import { z } from "zod";\n\nconst schema = z.string()\n  .regex(/${raw}/, "Invalid format");`;

    case "html-pattern":
      // Remove ^ and $ for HTML pattern attribute
      const htmlPat = raw.replace(/^\^/, "").replace(/\$$/, "");
      return `<input\n  type="text"\n  pattern="${htmlPat}"\n  title="Please match the required format"\n  required\n/>`;

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
];
