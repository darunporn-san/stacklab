import type { RuleConfig, PatternSegment } from "./regexRuleConfig";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildCharacterClass(config: RuleConfig["charSet"]): string {
  const parts: string[] = [];
  if (config.uppercaseLetters) parts.push("A-Z");
  if (config.lowercaseLetters) parts.push("a-z");
  if (config.numbers) parts.push("0-9");
  if (config.space) parts.push(" ");
  if (config.underscore) parts.push("_");
  if (config.dash) parts.push("\\-");
  if (config.dot) parts.push("\\.");
  if (config.customChars) {
    for (const c of config.customChars) {
      const escaped = escapeRegex(c);
      if (!parts.includes(escaped)) parts.push(escaped);
    }
  }
  if (parts.length === 0) return ".";
  return `[${parts.join("")}]`;
}

function segmentToRegex(seg: PatternSegment): string {
  const count = parseInt(seg.value) || 1;
  switch (seg.type) {
    case "uppercase": return `[A-Z]{${count}}`;
    case "lowercase": return `[a-z]{${count}}`;
    case "letters": return `[a-zA-Z]{${count}}`;
    case "digits": return `\\d{${count}}`;
    case "alphanumeric": return `[a-zA-Z0-9]{${count}}`;
    case "literal": return escapeRegex(seg.value);
    default: return "";
  }
}

function getStartAnchor(config: RuleConfig["structural"]): string {
  switch (config.mustStartWith) {
    case "uppercase": return "[A-Z]";
    case "lowercase": return "[a-z]";
    case "letter": return "[a-zA-Z]";
    case "number": return "\\d";
    case "custom": return config.mustStartWithCustom ? escapeRegex(config.mustStartWithCustom) : "";
    default: return "";
  }
}

function getEndAnchor(config: RuleConfig["structural"]): string {
  switch (config.mustEndWith) {
    case "uppercase": return "[A-Z]";
    case "lowercase": return "[a-z]";
    case "letter": return "[a-zA-Z]";
    case "number": return "\\d";
    case "custom": return config.mustEndWithCustom ? escapeRegex(config.mustEndWithCustom) : "";
    default: return "";
  }
}

export function generateRegex(config: RuleConfig): string {
  // Segment mode
  if (config.useSegments && config.segments.length > 0) {
    const body = config.segments.map(segmentToRegex).join("");
    return `^${body}$`;
  }

  const charClass = buildCharacterClass(config.charSet);
  const lookaheads: string[] = [];
  const { structural, length } = config;

  if (structural.mustIncludeNumber) lookaheads.push("(?=.*\\d)");
  if (structural.mustIncludeUppercase) lookaheads.push("(?=.*[A-Z])");
  if (structural.mustIncludeLowercase) lookaheads.push("(?=.*[a-z])");
  if (structural.noConsecutiveSpaces) lookaheads.push("(?!.*  )");
  if (structural.noConsecutiveSpecials) lookaheads.push("(?!.*[^a-zA-Z0-9\\s]{2})");
  if (structural.onlyOneDash) lookaheads.push("(?!.*-.*-)");

  const startPart = getStartAnchor(structural);
  const endPart = getEndAnchor(structural);

  // Quantifier
  let quantifier = "*";
  const min = parseInt(length.minLength) || 0;
  const max = parseInt(length.maxLength) || 0;
  const exact = parseInt(length.exactLength) || 0;

  if (exact > 0) {
    quantifier = `{${exact}}`;
  } else if (min > 0 && max > 0) {
    quantifier = `{${min},${max}}`;
  } else if (min > 0) {
    quantifier = `{${min},}`;
  } else if (max > 0) {
    quantifier = `{0,${max}}`;
  } else {
    quantifier = "+";
  }

  // Adjust quantifier for start/end parts
  let bodyQuantifier = quantifier;
  if (startPart || endPart) {
    const totalAnchors = (startPart ? 1 : 0) + (endPart ? 1 : 0);
    if (exact > 0) {
      bodyQuantifier = exact - totalAnchors > 0 ? `{${exact - totalAnchors}}` : "";
    } else if (min > 0 || max > 0) {
      const adjMin = Math.max(0, min - totalAnchors);
      const adjMax = max > 0 ? Math.max(0, max - totalAnchors) : 0;
      if (adjMax > 0) bodyQuantifier = `{${adjMin},${adjMax}}`;
      else bodyQuantifier = `{${adjMin},}`;
    }
  }

  let noLeadTrail = "";
  if (structural.noLeadingTrailingSpaces) {
    noLeadTrail = "(?!^\\s)(?!.*\\s$)";
  }

  const body = bodyQuantifier ? `${charClass}${bodyQuantifier}` : "";
  return `^${lookaheads.join("")}${noLeadTrail}${startPart}${body}${endPart}$`;
}

export function explainRegex(pattern: string): string[] {
  const explanations: string[] = [];
  if (pattern.startsWith("^")) explanations.push("^ — Start of string");
  if (pattern.endsWith("$")) explanations.push("$ — End of string");

  const lookaheadMatches = pattern.matchAll(/\(\?[=!].*?\)/g);
  for (const m of lookaheadMatches) {
    const la = m[0];
    if (la === "(?=.*\\d)") explanations.push("(?=.*\\d) — Must contain at least one digit");
    else if (la === "(?=.*[A-Z])") explanations.push("(?=.*[A-Z]) — Must contain at least one uppercase letter");
    else if (la === "(?=.*[a-z])") explanations.push("(?=.*[a-z]) — Must contain at least one lowercase letter");
    else if (la === "(?!.*  )") explanations.push("(?!.*  ) — No consecutive spaces allowed");
    else if (la.includes("[^a-zA-Z0-9")) explanations.push(`${la} — No consecutive special characters`);
    else if (la === "(?!.*-.*-)") explanations.push("(?!.*-.*-) — Only one dash allowed");
    else if (la === "(?!^\\s)") explanations.push("(?!^\\s) — No leading spaces");
    else if (la === "(?!.*\\s$)") explanations.push("(?!.*\\s$) — No trailing spaces");
    else explanations.push(`${la} — Lookahead assertion`);
  }

  const charClassMatch = pattern.match(/\[([^\]]+)\]/);
  if (charClassMatch) {
    explanations.push(`[${charClassMatch[1]}] — Allowed character set`);
  }

  const quantifierMatch = pattern.match(/\{(\d+)(?:,(\d*))?\}/);
  if (quantifierMatch) {
    const min = quantifierMatch[1];
    const max = quantifierMatch[2];
    if (max === undefined) explanations.push(`{${min}} — Exactly ${min} characters`);
    else if (max === "") explanations.push(`{${min},} — At least ${min} characters`);
    else explanations.push(`{${min},${max}} — Between ${min} and ${max} characters`);
  }

  return explanations;
}

export function detectConflicts(config: RuleConfig): string[] {
  const conflicts: string[] = [];
  const { charSet, structural } = config;

  if (structural.mustIncludeUppercase && !charSet.uppercaseLetters && !config.useSegments) {
    conflicts.push("Uppercase required but not in allowed characters");
  }
  if (structural.mustIncludeLowercase && !charSet.lowercaseLetters && !config.useSegments) {
    conflicts.push("Lowercase required but not in allowed characters");
  }
  if (structural.mustIncludeNumber && !charSet.numbers && !config.useSegments) {
    conflicts.push("Number required but not in allowed characters");
  }
  if (structural.noSpecialChars && (charSet.dash || charSet.dot || charSet.underscore)) {
    conflicts.push("No special chars rule conflicts with allowed special characters");
  }
  if (structural.onlyOneDash && !charSet.dash && !config.useSegments) {
    conflicts.push("'Only one dash' rule but dash not in allowed characters");
  }

  const min = parseInt(config.length.minLength) || 0;
  const max = parseInt(config.length.maxLength) || 0;
  const exact = parseInt(config.length.exactLength) || 0;
  if (min > 0 && max > 0 && min > max) {
    conflicts.push("Min length is greater than max length");
  }
  if (exact > 0 && (min > 0 || max > 0)) {
    conflicts.push("Exact length conflicts with min/max length");
  }

  return conflicts;
}
