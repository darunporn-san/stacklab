import type { CrossFieldRule, FormField } from "./formSchemaEngine";

export interface CrossFieldResult {
  ruleId: string;
  valid: boolean;
  message: string;
}

export function validateCrossFieldRules(
  rules: CrossFieldRule[],
  fields: FormField[],
  values: Record<string, string>
): CrossFieldResult[] {
  return rules.map((rule) => {
    switch (rule.type) {
      case "match": {
        const a = values[rule.fieldA] || "";
        const b = values[rule.fieldB] || "";
        const valid = a === b;
        const labelA = fields.find(f => f.id === rule.fieldA)?.label || rule.fieldA;
        const labelB = fields.find(f => f.id === rule.fieldB)?.label || rule.fieldB;
        return { ruleId: rule.id, valid, message: valid ? "" : `${labelA} must match ${labelB}` };
      }
      case "lessThan": {
        const a = values[rule.fieldA] || "";
        const b = values[rule.fieldB] || "";
        const valid = a < b;
        const labelA = fields.find(f => f.id === rule.fieldA)?.label || rule.fieldA;
        const labelB = fields.find(f => f.id === rule.fieldB)?.label || rule.fieldB;
        return { ruleId: rule.id, valid, message: valid ? "" : `${labelA} must be less than ${labelB}` };
      }
      case "requiredIf": {
        const trigger = values[rule.fieldA] || "";
        const target = values[rule.fieldB] || "";
        const conditionMet = rule.value ? trigger === rule.value : trigger.length > 0;
        const valid = !conditionMet || target.length > 0;
        const labelB = fields.find(f => f.id === rule.fieldB)?.label || rule.fieldB;
        return { ruleId: rule.id, valid, message: valid ? "" : `${labelB} is required` };
      }
      case "atLeastOne": {
        const valid = rule.group.some(fid => (values[fid] || "").length > 0);
        const labels = rule.group.map(fid => fields.find(f => f.id === fid)?.label || fid).join(", ");
        return { ruleId: rule.id, valid, message: valid ? "" : `At least one required: ${labels}` };
      }
      default:
        return { ruleId: rule.id, valid: true, message: "" };
    }
  });
}
