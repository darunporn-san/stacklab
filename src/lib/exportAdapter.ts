import type { FormConfig, FormField, FieldValidation } from "./formSchemaEngine";
import { generateRegex } from "./regexGenerator";
import { getTypePresetPattern } from "./formSchemaEngine";

export type FormExportFormat = "zod" | "yup" | "react-hook-form" | "vue-useform" | "plain-js" | "json-config";

function getFieldPattern(field: FormField, val: FieldValidation): string {
  if (val.customRegex) return val.customRegex;
  const typeP = getTypePresetPattern(field.type);
  if (typeP) return typeP;
  const generated = generateRegex(val.ruleConfig);
  return generated;
}

function getMinMax(val: FieldValidation): { min: number; max: number; exact: number } {
  return {
    min: parseInt(val.ruleConfig.length.minLength) || 0,
    max: parseInt(val.ruleConfig.length.maxLength) || 0,
    exact: parseInt(val.ruleConfig.length.exactLength) || 0,
  };
}

export function exportFormSchema(config: FormConfig, format: FormExportFormat): string {
  switch (format) {
    case "zod": return exportZod(config);
    case "yup": return exportYup(config);
    case "react-hook-form": return exportReactHookForm(config);
    case "vue-useform": return exportVueForm(config);
    case "plain-js": return exportPlainJs(config);
    case "json-config": return JSON.stringify(config, null, 2);
    default: return "";
  }
}

function exportZod(config: FormConfig): string {
  const lines: string[] = ['import { z } from "zod";', '', 'export const schema = z.object({'];
  for (const field of config.fields) {
    const val = config.validations.find(v => v.fieldId === field.id);
    if (!val) continue;
    const { min, max, exact } = getMinMax(val);
    const pattern = getFieldPattern(field, val);
    let chain = "z.string()";
    if (field.required) chain += '.min(1, "Required")';
    if (min > 0) chain += `.min(${min}, "Min ${min} chars")`;
    if (max > 0) chain += `.max(${max}, "Max ${max} chars")`;
    if (exact > 0) chain += `.length(${exact}, "Must be ${exact} chars")`;
    if (field.type === "email") chain += '.email("Invalid email")';
    if (pattern && field.type !== "email") chain += `.regex(/${pattern}/, "Invalid format")`;
    if (val.enumValues) {
      const vals = val.enumValues.split(",").map(s => `"${s.trim()}"`);
      chain = `z.enum([${vals.join(", ")}])`;
    }
    if (!field.required && !val.enumValues) chain += ".optional()";
    lines.push(`  ${field.name}: ${chain},`);
  }
  lines.push("});", "", "export type FormData = z.infer<typeof schema>;");
  return lines.join("\n");
}

function exportYup(config: FormConfig): string {
  const lines: string[] = ['import * as yup from "yup";', '', 'export const schema = yup.object({'];
  for (const field of config.fields) {
    const val = config.validations.find(v => v.fieldId === field.id);
    if (!val) continue;
    const { min, max } = getMinMax(val);
    const pattern = getFieldPattern(field, val);
    let chain = "yup.string()";
    if (field.required) chain += '.required("Required")';
    if (min > 0) chain += `.min(${min}, "Min ${min} chars")`;
    if (max > 0) chain += `.max(${max}, "Max ${max} chars")`;
    if (field.type === "email") chain += '.email("Invalid email")';
    if (pattern && field.type !== "email") chain += `.matches(/${pattern}/, "Invalid format")`;
    lines.push(`  ${field.name}: ${chain},`);
  }
  lines.push("});");
  return lines.join("\n");
}

function exportReactHookForm(config: FormConfig): string {
  const lines: string[] = [
    'import { useForm } from "react-hook-form";',
    'import { zodResolver } from "@hookform/resolvers/zod";',
    'import { schema, type FormData } from "./schema";',
    '',
    'export function useMyForm() {',
    '  const form = useForm<FormData>({',
    '    resolver: zodResolver(schema),',
    '    defaultValues: {',
  ];
  for (const field of config.fields) {
    lines.push(`      ${field.name}: ${JSON.stringify(field.defaultValue || "")},`);
  }
  lines.push('    },', '  });', '', '  return form;', '}');
  return lines.join("\n");
}

function exportVueForm(config: FormConfig): string {
  const lines: string[] = [
    'import { ref, reactive } from "vue";',
    '',
    'export function useFormValidation() {',
    '  const form = reactive({',
  ];
  for (const field of config.fields) {
    lines.push(`    ${field.name}: ${JSON.stringify(field.defaultValue || "")},`);
  }
  lines.push('  });', '', '  const errors = reactive<Record<string, string>>({});', '');
  lines.push('  function validate(): boolean {');
  lines.push('    let valid = true;');
  for (const field of config.fields) {
    const val = config.validations.find(v => v.fieldId === field.id);
    if (!val) continue;
    if (field.required) {
      lines.push(`    if (!form.${field.name}) { errors.${field.name} = "Required"; valid = false; }`);
    }
    const pattern = getFieldPattern(field, val);
    if (pattern) {
      lines.push(`    else if (!/${pattern}/.test(form.${field.name})) { errors.${field.name} = "Invalid"; valid = false; }`);
    }
  }
  lines.push('    return valid;', '  }', '', '  return { form, errors, validate };', '}');
  return lines.join("\n");
}

function exportPlainJs(config: FormConfig): string {
  const lines: string[] = ['function validateForm(data) {', '  const errors = {};'];
  for (const field of config.fields) {
    const val = config.validations.find(v => v.fieldId === field.id);
    if (!val) continue;
    const { min, max } = getMinMax(val);
    if (field.required) lines.push(`  if (!data.${field.name}) errors.${field.name} = "Required";`);
    if (min > 0) lines.push(`  if (data.${field.name} && data.${field.name}.length < ${min}) errors.${field.name} = "Min ${min} chars";`);
    if (max > 0) lines.push(`  if (data.${field.name} && data.${field.name}.length > ${max}) errors.${field.name} = "Max ${max} chars";`);
    const pattern = getFieldPattern(field, val);
    if (pattern) {
      lines.push(`  if (data.${field.name} && !/${pattern}/.test(data.${field.name})) errors.${field.name} = "Invalid format";`);
    }
  }
  lines.push('  return { valid: Object.keys(errors).length === 0, errors };', '}');
  return lines.join("\n");
}

export const formExportFormats: { value: FormExportFormat; label: string }[] = [
  { value: "zod", label: "Zod Schema" },
  { value: "yup", label: "Yup Schema" },
  { value: "react-hook-form", label: "React Hook Form" },
  { value: "vue-useform", label: "Vue useForm" },
  { value: "plain-js", label: "Plain JavaScript" },
  { value: "json-config", label: "JSON Config" },
];
