import type { RuleConfig, PatternSegment } from "./regexRuleConfig";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildCharacterClass(config: RuleConfig["charSet"]): string {
  const parts: string[] = [];
  if (config.uppercaseLetters) parts.push("A-Z");
  if (config.lowercaseLetters) parts.push("a-z");
  if (config.thaiChars) parts.push("\\u0E00-\\u0E7F");
  if (config.unicodeLetters) parts.push("\\p{L}");
  if (config.numbers) parts.push("0-9");
  if (config.decimalPoint || config.dot) parts.push("\\.");
  if (config.negativeSign || config.dash) parts.push("\\-");
  if (config.basicSymbols) parts.push("!@#$%^&*()_+=");
  if (config.brackets) parts.push("{}\\[\\]()");
  if (config.slashPunctuation) parts.push("/\\\\|:;\"'<>,\\.?");
  if (config.currencySymbols) parts.push("$€£¥฿₹");
  if (config.urlSafeChars) parts.push("_\\.~");
  if (config.underscore && !config.basicSymbols && !config.urlSafeChars) parts.push("_");
  const spaceAllowed = config.space || config.spaceMode === "normal" || config.spaceMode === "single" || config.spaceMode === "multiple";
  if (spaceAllowed) parts.push(" ");
  if (config.customChars) {
    for (const c of config.customChars) {
      const escaped = escapeRegex(c);
      if (!parts.includes(escaped)) parts.push(escaped);
    }
  }
  if (parts.length === 0) return ".";
  const hasUnicode = config.unicodeLetters;
  return `[${parts.join("")}]`;
}

function segmentToRegex(seg: PatternSegment): string {
  const count = parseInt(seg.value) || 1;
  let base = "";
  switch (seg.type) {
    case "uppercase": base = `[A-Z]{${count}}`; break;
    case "lowercase": base = `[a-z]{${count}}`; break;
    case "letters": base = `[a-zA-Z]{${count}}`; break;
    case "digits": base = `\\d{${count}}`; break;
    case "alphanumeric": base = `[a-zA-Z0-9]{${count}}`; break;
    case "any": base = `.{${count}}`; break;
    case "literal": base = escapeRegex(seg.value); break;
    case "optional": base = `(?:${escapeRegex(seg.value)})?`; break;
    default: return "";
  }
  if (seg.optional && seg.type !== "optional") base = `(?:${base})?`;
  if (seg.repeat) base = `(?:${base})+`;
  return base;
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
  if (config.useSegments && config.segments.length > 0) {
    const body = config.segments.map(segmentToRegex).join("");
    return `^${body}$`;
  }

  const charClass = buildCharacterClass(config.charSet);
  const useUnicode = config.charSet.unicodeLetters;
  const lookaheads: string[] = [];
  const { structural, length } = config;

  if (structural.mustIncludeNumber) lookaheads.push("(?=.*\\d)");
  if (structural.mustIncludeUppercase) lookaheads.push("(?=.*[A-Z])");
  if (structural.mustIncludeLowercase) lookaheads.push("(?=.*[a-z])");
  if (structural.mustIncludeSpecial) lookaheads.push("(?=.*[^a-zA-Z0-9\\s])");
  if (structural.mustIncludeSubstring) lookaheads.push(`(?=.*${escapeRegex(structural.mustIncludeSubstring)})`);
  if (structural.noConsecutiveSpaces) lookaheads.push("(?!.*  )");
  if (structural.noConsecutiveSpecials) lookaheads.push("(?!.*[^a-zA-Z0-9\\s]{2})");
  if (structural.noConsecutiveIdentical) lookaheads.push("(?!.*(.)\\1)");
  if (structural.maxRepeatChars) {
    const max = parseInt(structural.maxRepeatChars) || 2;
    lookaheads.push(`(?!.*(.)\\1{${max},})`);
  }
  if (structural.noMultipleDashes || structural.onlyOneDash) lookaheads.push("(?!.*-.*-)");
  if (structural.noEmoji) lookaheads.push("(?!.*[\\u{1F600}-\\u{1F64F}\\u{1F300}-\\u{1F5FF}\\u{1F680}-\\u{1F6FF}\\u{2600}-\\u{26FF}])");
  if (structural.noNonAscii) lookaheads.push("(?!.*[^\\x00-\\x7F])");
  if (structural.excludeChars) {
    for (const c of structural.excludeChars) {
      lookaheads.push(`(?!.*${escapeRegex(c)})`);
    }
  }
  if (structural.excludeWord) lookaheads.push(`(?!.*${escapeRegex(structural.excludeWord)})`);
  if (structural.mustNotStartWith) lookaheads.push(`(?!^${escapeRegex(structural.mustNotStartWith)})`);
  if (structural.mustNotEndWithSpace) lookaheads.push("(?!.*\\s$)");
  if (structural.mustNotEndWithSpecial) lookaheads.push("(?!.*[^a-zA-Z0-9]$)");

  const startPart = getStartAnchor(structural);
  const endPart = getEndAnchor(structural);

  const min = parseInt(length.minLength) || 0;
  const max = parseInt(length.maxLength) || 0;
  const exact = parseInt(length.exactLength) || 0;
  let quantifier: string;

  if (exact > 0) quantifier = `{${exact}}`;
  else if (min > 0 && max > 0) quantifier = `{${min},${max}}`;
  else if (min > 0) quantifier = `{${min},}`;
  else if (max > 0) quantifier = `{0,${max}}`;
  else quantifier = "+";

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
  if (structural.noLeadingTrailingSpaces) noLeadTrail = "(?!^\\s)(?!.*\\s$)";

  const body = bodyQuantifier ? `${charClass}${bodyQuantifier}` : "";
  return `^${lookaheads.join("")}${noLeadTrail}${startPart}${body}${endPart}$`;
}

// ── Failure Reasons ──
export function getFailureReasons(pattern: string, input: string, config: RuleConfig): string[] {
  if (!input) return [];
  const reasons: string[] = [];
  const { structural, length, charSet } = config;

  try { if (new RegExp(pattern).test(input)) return []; } catch { return ["Invalid regex pattern"]; }

  const min = parseInt(length.minLength) || 0;
  const max = parseInt(length.maxLength) || 0;
  const exact = parseInt(length.exactLength) || 0;
  if (exact > 0 && input.length !== exact) reasons.push(`Must be exactly ${exact} characters (got ${input.length})`);
  if (min > 0 && input.length < min) reasons.push(`Must be at least ${min} characters (got ${input.length})`);
  if (max > 0 && input.length > max) reasons.push(`Must be at most ${max} characters (got ${input.length})`);
  if (structural.mustIncludeUppercase && !/[A-Z]/.test(input)) reasons.push("Must include at least one uppercase letter");
  if (structural.mustIncludeLowercase && !/[a-z]/.test(input)) reasons.push("Must include at least one lowercase letter");
  if (structural.mustIncludeNumber && !/\d/.test(input)) reasons.push("Must include at least one number");
  if (structural.mustIncludeSpecial && /^[a-zA-Z0-9\s]*$/.test(input)) reasons.push("Must include at least one special character");
  if (structural.noConsecutiveSpaces && /  /.test(input)) reasons.push("No consecutive spaces allowed");
  if (structural.noConsecutiveIdentical && /(.)\1/.test(input)) reasons.push("No consecutive identical characters allowed");
  if (structural.noLeadingTrailingSpaces && (input.startsWith(" ") || input.endsWith(" "))) reasons.push("No leading or trailing spaces");
  if (structural.mustNotEndWithSpace && input.endsWith(" ")) reasons.push("Must not end with a space");
  if (structural.mustNotEndWithSpecial && /[^a-zA-Z0-9]$/.test(input)) reasons.push("Must not end with a special character");
  if (structural.noEmoji && /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u.test(input)) reasons.push("Emoji characters are not allowed");
  if (structural.noNonAscii && /[^\x00-\x7F]/.test(input)) reasons.push("Non-ASCII characters are not allowed");
  if (structural.excludeWord && input.includes(structural.excludeWord)) reasons.push(`Must not contain "${structural.excludeWord}"`);
  if (structural.mustStartWith === "uppercase" && !/^[A-Z]/.test(input)) reasons.push("Must start with an uppercase letter");
  if (structural.mustStartWith === "lowercase" && !/^[a-z]/.test(input)) reasons.push("Must start with a lowercase letter");
  if (structural.mustStartWith === "number" && !/^\d/.test(input)) reasons.push("Must start with a number");

  if (reasons.length === 0) reasons.push("Input contains disallowed characters");
  return reasons;
}

// ── Explanation ──
export function explainRegex(pattern: string): string[] {
  const explanations: string[] = [];
  if (pattern.startsWith("^")) explanations.push("^ — Start of string");
  if (pattern.endsWith("$")) explanations.push("$ — End of string");

  const lookaheadMatches = pattern.matchAll(/\(\?[=!][^)]*\)/g);
  for (const m of lookaheadMatches) {
    const la = m[0];
    if (la === "(?=.*\\d)") explanations.push("(?=.*\\d) — Must contain at least one digit");
    else if (la === "(?=.*[A-Z])") explanations.push("(?=.*[A-Z]) — Must contain uppercase");
    else if (la === "(?=.*[a-z])") explanations.push("(?=.*[a-z]) — Must contain lowercase");
    else if (la.includes("[^a-zA-Z0-9\\s]") && la.startsWith("(?=")) explanations.push(`${la} — Must contain special character`);
    else if (la === "(?!.*  )") explanations.push("(?!.*  ) — No consecutive spaces");
    else if (la.includes("[^a-zA-Z0-9") && la.startsWith("(?!")) explanations.push(`${la} — No consecutive special chars`);
    else if (la.includes("(.)\\1")) explanations.push(`${la} — No consecutive identical chars`);
    else if (la === "(?!.*-.*-)") explanations.push("(?!.*-.*-) — Only one dash allowed");
    else if (la.includes("1F600")) explanations.push(`${la} — No emoji allowed`);
    else if (la.includes("\\x00-\\x7F")) explanations.push(`${la} — ASCII only`);
    else if (la === "(?!^\\s)") explanations.push("(?!^\\s) — No leading spaces");
    else if (la === "(?!.*\\s$)") explanations.push("(?!.*\\s$) — No trailing spaces");
    else explanations.push(`${la} — Assertion`);
  }

  const charClassMatch = pattern.match(/\[([^\]]+)\]/);
  if (charClassMatch) explanations.push(`[${charClassMatch[1]}] — Allowed character set`);

  const quantifierMatch = pattern.match(/\{(\d+)(?:,(\d*))?\}/);
  if (quantifierMatch) {
    const qMin = quantifierMatch[1];
    const qMax = quantifierMatch[2];
    if (qMax === undefined) explanations.push(`{${qMin}} — Exactly ${qMin} characters`);
    else if (qMax === "") explanations.push(`{${qMin},} — At least ${qMin} characters`);
    else explanations.push(`{${qMin},${qMax}} — Between ${qMin} and ${qMax} characters`);
  }
  return explanations;
}

// ── Conflict Detection ──
export function detectConflicts(config: RuleConfig): string[] {
  const conflicts: string[] = [];
  const { charSet, structural } = config;

  if (structural.mustIncludeUppercase && !charSet.uppercaseLetters && !config.useSegments) conflicts.push("Uppercase required but not in allowed characters");
  if (structural.mustIncludeLowercase && !charSet.lowercaseLetters && !config.useSegments) conflicts.push("Lowercase required but not in allowed characters");
  if (structural.mustIncludeNumber && !charSet.numbers && !config.useSegments) conflicts.push("Number required but not in allowed characters");
  if (structural.noSpecialChars && (charSet.dash || charSet.dot || charSet.underscore || charSet.basicSymbols)) conflicts.push("No special chars conflicts with allowed specials");
  if (structural.noNonAscii && charSet.thaiChars) conflicts.push("No non-ASCII conflicts with Thai characters enabled");
  if (structural.noNonAscii && charSet.unicodeLetters) conflicts.push("No non-ASCII conflicts with Unicode letters enabled");
  if (structural.noConsecutiveIdentical && structural.maxRepeatChars) conflicts.push("No consecutive identical and max repeat are redundant together");

  const min = parseInt(config.length.minLength) || 0;
  const max = parseInt(config.length.maxLength) || 0;
  const exact = parseInt(config.length.exactLength) || 0;
  if (min > 0 && max > 0 && min > max) conflicts.push("Min length is greater than max length");
  if (exact > 0 && (min > 0 || max > 0)) conflicts.push("Exact length conflicts with min/max length");

  return conflicts;
}

// ── Complexity Score ──
export function computeComplexity(config: RuleConfig): { score: number; label: string; color: string } {
  let score = 0;
  const { structural, length, charSet } = config;

  // Character diversity
  let charTypes = 0;
  if (charSet.uppercaseLetters) charTypes++;
  if (charSet.lowercaseLetters) charTypes++;
  if (charSet.numbers) charTypes++;
  if (charSet.basicSymbols || charSet.customChars) charTypes++;
  if (charSet.thaiChars || charSet.unicodeLetters) charTypes++;
  score += charTypes * 10;

  // Length
  const min = parseInt(length.minLength) || 0;
  if (min >= 12) score += 25;
  else if (min >= 8) score += 15;
  else if (min >= 4) score += 5;

  // Rules
  if (structural.mustIncludeUppercase) score += 10;
  if (structural.mustIncludeLowercase) score += 10;
  if (structural.mustIncludeNumber) score += 10;
  if (structural.mustIncludeSpecial) score += 15;
  if (structural.noConsecutiveIdentical) score += 5;
  if (structural.noEmoji) score += 2;
  if (structural.excludeWord) score += 3;

  if (score >= 80) return { score, label: "Strong", color: "text-success" };
  if (score >= 50) return { score, label: "Medium", color: "text-primary" };
  if (score >= 25) return { score, label: "Basic", color: "text-muted-foreground" };
  return { score, label: "Weak", color: "text-destructive" };
}
