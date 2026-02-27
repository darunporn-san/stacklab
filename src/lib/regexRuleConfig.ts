export interface CharacterSetConfig {
  // Alphabet
  uppercaseLetters: boolean;
  lowercaseLetters: boolean;
  thaiChars: boolean;
  unicodeLetters: boolean;
  // Numbers
  numbers: boolean;
  decimalPoint: boolean;
  negativeSign: boolean;
  // Special - Basic
  basicSymbols: boolean; // !@#$%^&*()_+=
  brackets: boolean; // {}[]()
  slashPunctuation: boolean; // /\|:;"'<>,.?
  currencySymbols: boolean; // $€£¥฿₹
  urlSafeChars: boolean; // _.~
  // Space
  spaceMode: "normal" | "none" | "single" | "multiple";
  // Legacy simple flags
  underscore: boolean;
  dash: boolean;
  dot: boolean;
  space: boolean;
  // Custom
  customChars: string;
}

export type StartEndOption = "uppercase" | "lowercase" | "letter" | "number" | "custom";

export interface StructuralRules {
  mustStartWith: StartEndOption | null;
  mustStartWithCustom: string;
  mustNotStartWith: string;
  mustEndWith: StartEndOption | null;
  mustEndWithCustom: string;
  mustNotEndWithSpace: boolean;
  mustNotEndWithSpecial: boolean;
  // Inclusion
  mustIncludeNumber: boolean;
  mustIncludeUppercase: boolean;
  mustIncludeLowercase: boolean;
  mustIncludeSpecial: boolean;
  mustIncludeSubstring: string;
  // Exclusion
  excludeChars: string;
  excludeWord: string;
  noConsecutiveSpaces: boolean;
  noConsecutiveSpecials: boolean;
  noConsecutiveIdentical: boolean;
  maxRepeatChars: string; // e.g. "2" means max 2 same chars in a row
  noMultipleDashes: boolean;
  noEmoji: boolean;
  noNonAscii: boolean;
  // Legacy
  noLeadingTrailingSpaces: boolean;
  noSpecialChars: boolean;
  onlyOneDash: boolean;
}

export interface LengthConstraints {
  minLength: string;
  maxLength: string;
  exactLength: string;
}

export type SegmentType = "uppercase" | "lowercase" | "letters" | "digits" | "literal" | "alphanumeric" | "any" | "optional";

export interface PatternSegment {
  id: string;
  type: SegmentType;
  value: string;
  optional?: boolean;
  repeat?: boolean;
}

export interface RuleConfig {
  charSet: CharacterSetConfig;
  structural: StructuralRules;
  length: LengthConstraints;
  segments: PatternSegment[];
  useSegments: boolean;
}

export function createDefaultConfig(): RuleConfig {
  return {
    charSet: {
      uppercaseLetters: true,
      lowercaseLetters: true,
      thaiChars: false,
      unicodeLetters: false,
      numbers: true,
      decimalPoint: false,
      negativeSign: false,
      basicSymbols: false,
      brackets: false,
      slashPunctuation: false,
      currencySymbols: false,
      urlSafeChars: false,
      spaceMode: "none",
      underscore: false,
      dash: false,
      dot: false,
      space: false,
      customChars: "",
    },
    structural: {
      mustStartWith: null,
      mustStartWithCustom: "",
      mustNotStartWith: "",
      mustEndWith: null,
      mustEndWithCustom: "",
      mustNotEndWithSpace: false,
      mustNotEndWithSpecial: false,
      mustIncludeNumber: false,
      mustIncludeUppercase: false,
      mustIncludeLowercase: false,
      mustIncludeSpecial: false,
      mustIncludeSubstring: "",
      excludeChars: "",
      excludeWord: "",
      noConsecutiveSpaces: false,
      noConsecutiveSpecials: false,
      noConsecutiveIdentical: false,
      maxRepeatChars: "",
      noMultipleDashes: false,
      noEmoji: false,
      noNonAscii: false,
      noLeadingTrailingSpaces: false,
      noSpecialChars: false,
      onlyOneDash: false,
    },
    length: { minLength: "", maxLength: "", exactLength: "" },
    segments: [],
    useSegments: false,
  };
}
