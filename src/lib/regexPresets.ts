import type { RuleConfig } from "./regexRuleConfig";
import { createDefaultConfig } from "./regexRuleConfig";

export interface Preset {
  name: string;
  description: string;
  config: RuleConfig;
}

export const presets: Preset[] = [
  {
    name: "Username",
    description: "Lowercase alphanumeric, 4–16 chars",
    config: {
      ...createDefaultConfig(),
      charSet: { ...createDefaultConfig().charSet, uppercaseLetters: false, underscore: true },
      length: { minLength: "4", maxLength: "16", exactLength: "" },
    },
  },
  {
    name: "Slug (kebab-case)",
    description: "Lowercase letters, numbers, dashes",
    config: {
      ...createDefaultConfig(),
      charSet: { ...createDefaultConfig().charSet, uppercaseLetters: false, dash: true },
      structural: { ...createDefaultConfig().structural, mustStartWith: "lowercase", mustEndWith: "letter" },
      length: { minLength: "2", maxLength: "64", exactLength: "" },
    },
  },
  {
    name: "Strong Password",
    description: "8–32 chars, upper + lower + number required",
    config: {
      ...createDefaultConfig(),
      charSet: { ...createDefaultConfig().charSet, underscore: true, dash: true, dot: true, customChars: "!@#$%^&*" },
      structural: { ...createDefaultConfig().structural, mustIncludeNumber: true, mustIncludeUppercase: true, mustIncludeLowercase: true },
      length: { minLength: "8", maxLength: "32", exactLength: "" },
    },
  },
  {
    name: "English Name",
    description: "Starts with uppercase, letters only",
    config: {
      ...createDefaultConfig(),
      charSet: { ...createDefaultConfig().charSet, numbers: false, space: true },
      structural: { ...createDefaultConfig().structural, mustStartWith: "uppercase", noConsecutiveSpaces: true, noLeadingTrailingSpaces: true },
      length: { minLength: "2", maxLength: "50", exactLength: "" },
    },
  },
  {
    name: "Coupon Code",
    description: "Uppercase + numbers, 6–12 chars",
    config: {
      ...createDefaultConfig(),
      charSet: { ...createDefaultConfig().charSet, lowercaseLetters: false },
      length: { minLength: "6", maxLength: "12", exactLength: "" },
    },
  },
  {
    name: "Product Code (AA-1234-BB)",
    description: "Structured: 2 uppercase, dash, 4 digits, dash, 2 uppercase",
    config: {
      ...createDefaultConfig(),
      useSegments: true,
      segments: [
        { id: "1", type: "uppercase", value: "2" },
        { id: "2", type: "literal", value: "-" },
        { id: "3", type: "digits", value: "4" },
        { id: "4", type: "literal", value: "-" },
        { id: "5", type: "uppercase", value: "2" },
      ],
    },
  },
  {
    name: "Hex Color",
    description: "#RRGGBB or #RGB format",
    config: {
      ...createDefaultConfig(),
      useSegments: true,
      segments: [
        { id: "1", type: "literal", value: "#" },
        { id: "2", type: "alphanumeric", value: "6" },
      ],
    },
  },
];
