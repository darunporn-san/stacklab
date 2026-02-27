import type { RuleConfig } from "./regexRuleConfig";
import { createDefaultConfig } from "./regexRuleConfig";

export interface Preset {
  name: string;
  description: string;
  category: string;
  config: RuleConfig;
}

const d = createDefaultConfig;

export const presets: Preset[] = [
  { name: "Username", description: "Lowercase alphanumeric + underscore, 4–16", category: "Account",
    config: { ...d(), charSet: { ...d().charSet, uppercaseLetters: false, underscore: true }, length: { minLength: "4", maxLength: "16", exactLength: "" } } },
  { name: "Email", description: "Standard email pattern", category: "Account",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "alphanumeric", value: "1" }, { id: "2", type: "literal", value: "." },
      { id: "3", type: "alphanumeric", value: "1" }, { id: "4", type: "literal", value: "@" },
      { id: "5", type: "alphanumeric", value: "1" }, { id: "6", type: "literal", value: "." },
      { id: "7", type: "letters", value: "2" },
    ] } },
  { name: "Strong Password", description: "8–32, upper+lower+number+special", category: "Security",
    config: { ...d(), charSet: { ...d().charSet, underscore: true, dash: true, dot: true, basicSymbols: true },
      structural: { ...d().structural, mustIncludeNumber: true, mustIncludeUppercase: true, mustIncludeLowercase: true, mustIncludeSpecial: true },
      length: { minLength: "8", maxLength: "32", exactLength: "" } } },
  { name: "Slug (kebab-case)", description: "Lowercase + numbers + dashes", category: "Web",
    config: { ...d(), charSet: { ...d().charSet, uppercaseLetters: false, dash: true },
      structural: { ...d().structural, mustStartWith: "lowercase", mustEndWith: "letter", noMultipleDashes: true },
      length: { minLength: "2", maxLength: "64", exactLength: "" } } },
  { name: "English Name", description: "Starts uppercase, letters + space", category: "Personal",
    config: { ...d(), charSet: { ...d().charSet, numbers: false, spaceMode: "single", space: true },
      structural: { ...d().structural, mustStartWith: "uppercase", noConsecutiveSpaces: true, noLeadingTrailingSpaces: true },
      length: { minLength: "2", maxLength: "50", exactLength: "" } } },
  { name: "Full Name", description: "First Last with space", category: "Personal",
    config: { ...d(), charSet: { ...d().charSet, numbers: false, space: true },
      structural: { ...d().structural, mustStartWith: "uppercase", noLeadingTrailingSpaces: true, noConsecutiveSpaces: true },
      length: { minLength: "3", maxLength: "100", exactLength: "" } } },
  { name: "Display Name", description: "Alphanumeric + spaces, 2–30", category: "Personal",
    config: { ...d(), charSet: { ...d().charSet, space: true, underscore: true },
      structural: { ...d().structural, noLeadingTrailingSpaces: true, noConsecutiveSpaces: true },
      length: { minLength: "2", maxLength: "30", exactLength: "" } } },
  { name: "Social Media Handle", description: "@-style, letters+numbers+underscore", category: "Account",
    config: { ...d(), charSet: { ...d().charSet, uppercaseLetters: false, underscore: true, dot: true },
      length: { minLength: "3", maxLength: "30", exactLength: "" } } },
  { name: "Coupon Code", description: "Uppercase + numbers, 6–12", category: "Commerce",
    config: { ...d(), charSet: { ...d().charSet, lowercaseLetters: false },
      length: { minLength: "6", maxLength: "12", exactLength: "" } } },
  { name: "Product Code (AA-1234-BB)", description: "Structured alphanumeric", category: "Commerce",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "uppercase", value: "2" }, { id: "2", type: "literal", value: "-" },
      { id: "3", type: "digits", value: "4" }, { id: "4", type: "literal", value: "-" },
      { id: "5", type: "uppercase", value: "2" },
    ] } },
  { name: "Phone (International)", description: "+XX-XXXXXXXXX", category: "Personal",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "literal", value: "+" }, { id: "2", type: "digits", value: "1" },
      { id: "3", type: "literal", value: "-" }, { id: "4", type: "digits", value: "9" },
    ] } },
  { name: "Thai Phone Number", description: "0X-XXXX-XXXX", category: "Personal",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "literal", value: "0" }, { id: "2", type: "digits", value: "1" },
      { id: "3", type: "literal", value: "-" }, { id: "4", type: "digits", value: "4" },
      { id: "5", type: "literal", value: "-" }, { id: "6", type: "digits", value: "4" },
    ] } },
  { name: "Credit Card", description: "XXXX-XXXX-XXXX-XXXX", category: "Commerce",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "digits", value: "4" }, { id: "2", type: "literal", value: "-" },
      { id: "3", type: "digits", value: "4" }, { id: "4", type: "literal", value: "-" },
      { id: "5", type: "digits", value: "4" }, { id: "6", type: "literal", value: "-" },
      { id: "7", type: "digits", value: "4" },
    ] } },
  { name: "IPv4 Address", description: "XXX.XXX.XXX.XXX", category: "Network",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "digits", value: "3" }, { id: "2", type: "literal", value: "." },
      { id: "3", type: "digits", value: "3" }, { id: "4", type: "literal", value: "." },
      { id: "5", type: "digits", value: "3" }, { id: "6", type: "literal", value: "." },
      { id: "7", type: "digits", value: "3" },
    ] } },
  { name: "Hex Color", description: "#RRGGBB", category: "Design",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "literal", value: "#" }, { id: "2", type: "alphanumeric", value: "6" },
    ] } },
  { name: "Price Input", description: "Digits with optional .XX", category: "Commerce",
    config: { ...d(), charSet: { ...d().charSet, uppercaseLetters: false, lowercaseLetters: false, dot: true },
      structural: { ...d().structural, mustStartWith: "number" },
      length: { minLength: "1", maxLength: "12", exactLength: "" } } },
  { name: "Decimal (2 precision)", description: "XX.XX format", category: "Commerce",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "digits", value: "1" }, { id: "2", type: "literal", value: "." },
      { id: "3", type: "digits", value: "2" },
    ] } },
  { name: "Postal Code", description: "5-digit code", category: "Personal",
    config: { ...d(), charSet: { ...d().charSet, uppercaseLetters: false, lowercaseLetters: false },
      length: { minLength: "5", maxLength: "5", exactLength: "5" } } },
  { name: "OTP (6 digits)", description: "6-digit numeric code", category: "Security",
    config: { ...d(), charSet: { ...d().charSet, uppercaseLetters: false, lowercaseLetters: false },
      length: { minLength: "", maxLength: "", exactLength: "6" } } },
  { name: "UUID", description: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", category: "System",
    config: { ...d(), useSegments: true, segments: [
      { id: "1", type: "alphanumeric", value: "8" }, { id: "2", type: "literal", value: "-" },
      { id: "3", type: "alphanumeric", value: "4" }, { id: "4", type: "literal", value: "-" },
      { id: "5", type: "alphanumeric", value: "4" }, { id: "6", type: "literal", value: "-" },
      { id: "7", type: "alphanumeric", value: "4" }, { id: "8", type: "literal", value: "-" },
      { id: "9", type: "alphanumeric", value: "12" },
    ] } },
];

export const presetCategories = [...new Set(presets.map(p => p.category))];
