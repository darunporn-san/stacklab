export interface CharacterSetConfig {
  uppercaseLetters: boolean;
  lowercaseLetters: boolean;
  numbers: boolean;
  space: boolean;
  underscore: boolean;
  dash: boolean;
  dot: boolean;
  customChars: string;
}

export type StartEndOption = "uppercase" | "lowercase" | "letter" | "number" | "custom";

export interface StructuralRules {
  mustStartWith: StartEndOption | null;
  mustStartWithCustom: string;
  mustEndWith: StartEndOption | null;
  mustEndWithCustom: string;
  noConsecutiveSpaces: boolean;
  noConsecutiveSpecials: boolean;
  noLeadingTrailingSpaces: boolean;
  noSpecialChars: boolean;
  onlyOneDash: boolean;
  mustIncludeNumber: boolean;
  mustIncludeUppercase: boolean;
  mustIncludeLowercase: boolean;
}

export interface LengthConstraints {
  minLength: string;
  maxLength: string;
  exactLength: string;
}

export type SegmentType = "uppercase" | "lowercase" | "letters" | "digits" | "literal" | "alphanumeric";

export interface PatternSegment {
  id: string;
  type: SegmentType;
  value: string; // count for types, literal string for "literal"
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
      numbers: true,
      space: false,
      underscore: false,
      dash: false,
      dot: false,
      customChars: "",
    },
    structural: {
      mustStartWith: null,
      mustStartWithCustom: "",
      mustEndWith: null,
      mustEndWithCustom: "",
      noConsecutiveSpaces: false,
      noConsecutiveSpecials: false,
      noLeadingTrailingSpaces: false,
      noSpecialChars: false,
      onlyOneDash: false,
      mustIncludeNumber: false,
      mustIncludeUppercase: false,
      mustIncludeLowercase: false,
    },
    length: {
      minLength: "",
      maxLength: "",
      exactLength: "",
    },
    segments: [],
    useSegments: false,
  };
}
