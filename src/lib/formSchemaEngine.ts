import { createDefaultConfig, type RuleConfig } from "./regexRuleConfig";

export type FieldType = "text" | "email" | "password" | "phone" | "number" | "date" | "price" | "slug";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue: string;
}

export interface FieldValidation {
  fieldId: string;
  ruleConfig: RuleConfig;
  customRegex: string;
  enumValues: string;
  thaiOnly: boolean;
  englishOnly: boolean;
}

export interface FormConfig {
  fields: FormField[];
  validations: FieldValidation[];
  crossFieldRules: CrossFieldRule[];
}

export interface CrossFieldRule {
  id: string;
  type: "match" | "lessThan" | "requiredIf" | "atLeastOne";
  fieldA: string;
  operator: string;
  fieldB: string;
  value: string;
  group: string[];
}

export const fieldTypes: FieldType[] = ["text", "email", "password", "phone", "number", "date", "price", "slug"];

export function createField(): FormField {
  const id = crypto.randomUUID().slice(0, 8);
  return { id, name: `field_${id}`, label: "", type: "text", required: false, defaultValue: "" };
}

export function createFieldValidation(fieldId: string): FieldValidation {
  return {
    fieldId,
    ruleConfig: createDefaultConfig(),
    customRegex: "",
    enumValues: "",
    thaiOnly: false,
    englishOnly: false,
  };
}

export function createCrossFieldRule(): CrossFieldRule {
  return {
    id: crypto.randomUUID().slice(0, 8),
    type: "match",
    fieldA: "",
    operator: "equals",
    fieldB: "",
    value: "",
    group: [],
  };
}

export function createDefaultFormConfig(): FormConfig {
  const field = createField();
  field.name = "username";
  field.label = "Username";
  return {
    fields: [field],
    validations: [createFieldValidation(field.id)],
    crossFieldRules: [],
  };
}

// Built-in patterns for field types
export function getTypePresetPattern(type: FieldType): string {
  switch (type) {
    case "email": return "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$";
    case "phone": return "^[+]?[0-9\\-\\s()]{7,15}$";
    case "number": return "^-?\\d+(\\.\\d+)?$";
    case "date": return "^\\d{4}-\\d{2}-\\d{2}$";
    case "price": return "^\\d+(\\.\\d{1,2})?$";
    case "slug": return "^[a-z0-9]+(?:-[a-z0-9]+)*$";
    default: return "";
  }
}
