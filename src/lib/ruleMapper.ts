import type { FieldValidation, FormField } from "./formSchemaEngine";
import { generateRegex, getFailureReasons } from "./regexGenerator";
import { getTypePresetPattern } from "./formSchemaEngine";

export interface FieldValidationResult {
  fieldId: string;
  valid: boolean;
  errors: string[];
}

export function validateField(
  field: FormField,
  validation: FieldValidation,
  value: string
): FieldValidationResult {
  const errors: string[] = [];

  // Required check
  if (field.required && !value.trim()) {
    return { fieldId: field.id, valid: false, errors: [`${field.label || field.name} is required`] };
  }

  if (!value) return { fieldId: field.id, valid: true, errors: [] };

  // Thai only
  if (validation.thaiOnly && !/^[\u0E00-\u0E7F\s]+$/.test(value)) {
    errors.push("Thai characters only");
  }

  // English only
  if (validation.englishOnly && !/^[a-zA-Z\s]+$/.test(value)) {
    errors.push("English characters only");
  }

  // Enum values
  if (validation.enumValues) {
    const allowed = validation.enumValues.split(",").map(s => s.trim());
    if (!allowed.includes(value)) {
      errors.push(`Must be one of: ${allowed.join(", ")}`);
    }
  }

  // Type preset pattern
  const typePattern = getTypePresetPattern(field.type);
  if (typePattern && field.type !== "text") {
    try {
      if (!new RegExp(typePattern).test(value)) {
        errors.push(`Invalid ${field.type} format`);
      }
    } catch {}
  }

  // Custom regex
  if (validation.customRegex) {
    try {
      if (!new RegExp(validation.customRegex).test(value)) {
        errors.push("Does not match custom pattern");
      }
    } catch {
      errors.push("Invalid custom regex");
    }
  }

  // Rule builder regex
  const pattern = generateRegex(validation.ruleConfig);
  if (pattern !== "^[A-Za-z0-9]+$" || hasNonDefaultRules(validation.ruleConfig)) {
    const reasons = getFailureReasons(pattern, value, validation.ruleConfig);
    if (reasons.length > 0) {
      try {
        if (!new RegExp(pattern, "u").test(value)) {
          errors.push(...reasons);
        }
      } catch {}
    }
  }

  return { fieldId: field.id, valid: errors.length === 0, errors };
}

function hasNonDefaultRules(config: any): boolean {
  const s = config.structural;
  const l = config.length;
  return s.mustIncludeNumber || s.mustIncludeUppercase || s.mustIncludeLowercase || 
         s.mustIncludeSpecial || s.noConsecutiveSpaces || s.noEmoji ||
         l.minLength || l.maxLength || l.exactLength;
}
