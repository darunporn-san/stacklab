export enum CaseType {
  Camel = "camelCase",
  Pascal = "PascalCase",
  Snake = "snake_case",
  ScreamingSnake = "SCREAMING_SNAKE_CASE",
  Kebab = "kebab-case",
  Train = "Train-Case",
  Dot = "dot.case",
  Path = "path/case",
  Title = "Title Case",
  Lower = "lowercase",
  Upper = "UPPERCASE",
}

export const CASE_TYPES = Object.values(CaseType);

interface ConvertOptions {
  preserveUppercase?: boolean;
  strictAlphanumeric?: boolean;
  removeSpecialChars?: boolean;
  keepLeadingTrailingSeparators?: boolean;
}

/** Split input into word tokens, normalising mixed separators. */
function tokenize(input: string, opts: ConvertOptions = {}): string[] {
  let s = input;

  if (opts.removeSpecialChars) {
    s = s.replace(/[^a-zA-Z0-9\s\-_./]/g, "");
  } else if (opts.strictAlphanumeric) {
    s = s.replace(/[^a-zA-Z0-9\s\-_.]/g, "");
  }

  if (!opts.keepLeadingTrailingSeparators) {
    s = s.trim();
  }

  // Insert boundary before uppercase letters that follow lowercase/digits (camelCase split)
  s = s.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  // Insert boundary between consecutive uppercase followed by lowercase (e.g. HTMLParser → HTML Parser)
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

  // Replace common separators with space, collapse multiples
  s = s.replace(/[-_./]+/g, " ").replace(/\s+/g, " ");

  if (!opts.keepLeadingTrailingSeparators) {
    s = s.trim();
  }

  const words = s.split(" ").filter(Boolean);
  return words;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function convertCase(
  input: string,
  type: CaseType,
  opts: ConvertOptions = {}
): string {
  const words = tokenize(input, opts);
  if (words.length === 0) return "";

  const lower = opts.preserveUppercase
    ? words
    : words.map((w) => w.toLowerCase());

  switch (type) {
    case CaseType.Camel: {
      const w = words.map((w) => w.toLowerCase());
      return w[0] + w.slice(1).map(capitalize).join("");
    }
    case CaseType.Pascal:
      return words.map((w) => capitalize(w)).join("");
    case CaseType.Snake:
      return lower.join("_");
    case CaseType.ScreamingSnake:
      return words.map((w) => w.toUpperCase()).join("_");
    case CaseType.Kebab:
      return lower.join("-");
    case CaseType.Train:
      return words.map((w) => capitalize(w)).join("-");
    case CaseType.Dot:
      return lower.join(".");
    case CaseType.Path:
      return lower.join("/");
    case CaseType.Title:
      return words.map((w) => capitalize(w)).join(" ");
    case CaseType.Lower:
      return words.join(" ").toLowerCase();
    case CaseType.Upper:
      return words.join(" ").toUpperCase();
    default:
      return input;
  }
}

export function convertLine(
  line: string,
  type: CaseType,
  opts: ConvertOptions = {}
): string {
  return convertCase(line, type, opts);
}

export function convertMultiline(
  input: string,
  type: CaseType,
  perLine: boolean,
  opts: ConvertOptions = {}
): string {
  if (!perLine) return convertCase(input, type, opts);
  return input
    .split("\n")
    .map((line) => (line.trim() ? convertCase(line, type, opts) : line))
    .join("\n");
}

/** Attempt to detect the current case of the input. */
export function detectCase(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  if (/^[a-z][a-zA-Z0-9]*$/.test(s) && /[A-Z]/.test(s)) return CaseType.Camel;
  if (/^[A-Z][a-zA-Z0-9]*$/.test(s) && /[a-z]/.test(s)) return CaseType.Pascal;
  if (/^[A-Z][A-Z0-9]*(_[A-Z][A-Z0-9]*)+$/.test(s)) return CaseType.ScreamingSnake;
  if (/^[a-z][a-z0-9]*(_[a-z][a-z0-9]*)+$/.test(s)) return CaseType.Snake;
  if (/^[A-Z][a-z0-9]*(-[A-Z][a-z0-9]*)+$/.test(s)) return CaseType.Train;
  if (/^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)+$/.test(s)) return CaseType.Kebab;
  if (/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(s)) return CaseType.Dot;
  if (/^[a-z][a-z0-9]*(\/[a-z][a-z0-9]*)+$/.test(s)) return CaseType.Path;
  if (s === s.toUpperCase() && /[A-Z]/.test(s)) return CaseType.Upper;
  if (s === s.toLowerCase()) return CaseType.Lower;

  return null;
}
